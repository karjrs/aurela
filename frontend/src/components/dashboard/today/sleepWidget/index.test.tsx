import dashboard from "@i18n/pl/dashboard.json";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { SleepWidget } from ".";

const { useSleepMock } = vi.hoisted(() => ({
  useSleepMock: vi.fn(),
}));

vi.mock("@hooks/dashboard/useSleep", () => ({
  useSleep: useSleepMock,
}));

const messages = { dashboard };

const renderWidget = () =>
  render(
    <NextIntlClientProvider locale="pl" messages={messages}>
      <SleepWidget />
    </NextIntlClientProvider>,
  );

describe("SleepWidget", () => {
  it("shows the heading and formatted slept duration inside the ring", () => {
    useSleepMock.mockReturnValue({ sleptHours: 6.75, maxHours: 8 });

    renderWidget();

    expect(screen.getByText("snu")).toBeInTheDocument();
    expect(screen.getByText("6 h 45 min")).toBeInTheDocument();
  });

  it("renders a background and a progress ring circle", () => {
    useSleepMock.mockReturnValue({ sleptHours: 6.75, maxHours: 8 });

    const { container } = renderWidget();

    expect(container.querySelectorAll("circle")).toHaveLength(2);
  });

  it("leaves the ring unfilled when there is no sleep data", () => {
    useSleepMock.mockReturnValue({ sleptHours: 0, maxHours: 8 });

    const { container } = renderWidget();

    const progressCircle = container.querySelectorAll("circle")[1];
    const dashoffset = Number(
      progressCircle?.getAttribute("stroke-dashoffset"),
    );
    const dasharray = Number(progressCircle?.getAttribute("stroke-dasharray"));
    expect(dashoffset).toBeCloseTo(dasharray);
  });

  it("fully fills the ring when slept hours meet or exceed max", () => {
    useSleepMock.mockReturnValue({ sleptHours: 9, maxHours: 8 });

    const { container } = renderWidget();

    const progressCircle = container.querySelectorAll("circle")[1];
    expect(progressCircle).toHaveAttribute("stroke-dashoffset", "0");
  });
});
