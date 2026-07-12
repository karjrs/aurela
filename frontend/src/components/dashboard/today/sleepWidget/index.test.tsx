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
  it("shows the heading and formatted slept duration", () => {
    useSleepMock.mockReturnValue({ sleptHours: 6.75, maxHours: 8 });

    renderWidget();

    expect(screen.getByText("Sen")).toBeInTheDocument();
    expect(screen.getByText("6 h 45 min")).toBeInTheDocument();
  });

  it("fills the progress bar proportionally to slept vs max hours", () => {
    useSleepMock.mockReturnValue({ sleptHours: 6.75, maxHours: 8 });

    const { container } = renderWidget();

    const fill = container.querySelector('[data-testid="sleep-bar-fill"]');
    expect(fill).toHaveStyle({ width: "84.375%" });
  });

  it("caps the progress bar at 100% when slept hours exceed max", () => {
    useSleepMock.mockReturnValue({ sleptHours: 9, maxHours: 8 });

    const { container } = renderWidget();

    const fill = container.querySelector('[data-testid="sleep-bar-fill"]');
    expect(fill).toHaveStyle({ width: "100%" });
  });
});
