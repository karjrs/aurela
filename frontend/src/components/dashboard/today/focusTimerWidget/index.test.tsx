import dashboard from "@i18n/pl/dashboard.json";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { FocusTimerWidget } from ".";

const { useFocusTimerMock } = vi.hoisted(() => ({
  useFocusTimerMock: vi.fn(),
}));

vi.mock("@hooks/dashboard/useFocusTimer", () => ({
  useFocusTimer: useFocusTimerMock,
  WORK_DURATION_SECONDS: 25 * 60,
  BREAK_DURATION_SECONDS: 5 * 60,
}));

const messages = { dashboard };

const renderWidget = () =>
  render(
    <NextIntlClientProvider locale="pl" messages={messages}>
      <FocusTimerWidget />
    </NextIntlClientProvider>,
  );

describe("FocusTimerWidget", () => {
  it("shows the formatted remaining time and the work phase label while paused", () => {
    useFocusTimerMock.mockReturnValue({
      phase: "work",
      secondsRemaining: 25 * 60,
      isRunning: false,
      toggle: vi.fn(),
      reset: vi.fn(),
      skipPhase: vi.fn(),
    });

    renderWidget();

    expect(screen.getByText("25:00")).toBeInTheDocument();
    expect(screen.getByText("Praca")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
  });

  it("shows the break phase label and a pause action while running", () => {
    useFocusTimerMock.mockReturnValue({
      phase: "break",
      secondsRemaining: 65,
      isRunning: true,
      toggle: vi.fn(),
      reset: vi.fn(),
      skipPhase: vi.fn(),
    });

    renderWidget();

    expect(screen.getByText("01:05")).toBeInTheDocument();
    expect(screen.getByText("Przerwa")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pauza" })).toBeInTheDocument();
  });

  it("calls toggle when the start/pause button is clicked", () => {
    const toggle = vi.fn();
    useFocusTimerMock.mockReturnValue({
      phase: "work",
      secondsRemaining: 25 * 60,
      isRunning: false,
      toggle,
      reset: vi.fn(),
      skipPhase: vi.fn(),
    });

    renderWidget();

    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    expect(toggle).toHaveBeenCalledTimes(1);
  });

  it("calls reset when the reset button is clicked", () => {
    const reset = vi.fn();
    useFocusTimerMock.mockReturnValue({
      phase: "work",
      secondsRemaining: 25 * 60,
      isRunning: false,
      toggle: vi.fn(),
      reset,
      skipPhase: vi.fn(),
    });

    renderWidget();

    fireEvent.click(screen.getByRole("button", { name: "Resetuj" }));

    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("calls skipPhase when the skip button is clicked", () => {
    const skipPhase = vi.fn();
    useFocusTimerMock.mockReturnValue({
      phase: "work",
      secondsRemaining: 25 * 60,
      isRunning: false,
      toggle: vi.fn(),
      reset: vi.fn(),
      skipPhase,
    });

    renderWidget();

    fireEvent.click(screen.getByRole("button", { name: "Pomiń" }));

    expect(skipPhase).toHaveBeenCalledTimes(1);
  });
});
