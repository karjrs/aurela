import dashboard from "@i18n/pl/dashboard.json";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import type { Task } from "../types";
import { AnalogClockWidget } from ".";

const messages = { dashboard };

const makeTask = (overrides: Partial<Task>): Task => ({
  id: "task-1",
  title: "Task",
  hour: 8,
  duration: 0.5,
  done: false,
  emoji: "📋",
  ...overrides,
});

const renderWidget = (now: Date, tasks: Task[] = []) =>
  render(
    <NextIntlClientProvider locale="pl" messages={messages}>
      <AnalogClockWidget now={now} tasks={tasks} />
    </NextIntlClientProvider>,
  );

describe("AnalogClockWidget", () => {
  it("shows the digital caption in 24-hour format for the Polish locale", () => {
    renderWidget(new Date("2026-07-12T14:05:00"));
    expect(screen.getByText("14:05")).toBeInTheDocument();
    expect(screen.queryByText(/AM|PM/)).not.toBeInTheDocument();
  });

  it("renders a dot for a task within the next 12 hours", () => {
    renderWidget(new Date("2026-07-12T10:00:00"), [
      makeTask({ id: "soon", hour: 14 }),
    ]);
    expect(screen.getAllByTestId("clock-task-dot")).toHaveLength(1);
  });

  it("does not render a dot for a task outside the next 12 hours", () => {
    renderWidget(new Date("2026-07-12T10:00:00"), [
      makeTask({ id: "later", hour: 23 }),
    ]);
    expect(screen.queryByTestId("clock-task-dot")).not.toBeInTheDocument();
  });

  it("does not render a dot for a task earlier today", () => {
    renderWidget(new Date("2026-07-12T10:00:00"), [
      makeTask({ id: "past", hour: 7 }),
    ]);
    expect(screen.queryByTestId("clock-task-dot")).not.toBeInTheDocument();
  });

  it("renders one dot per qualifying task and ignores non-qualifying ones", () => {
    const tasks = [
      makeTask({ id: "a", hour: 11 }),
      makeTask({ id: "b", hour: 20 }),
      makeTask({ id: "c", hour: 23 }),
    ];
    renderWidget(new Date("2026-07-12T10:00:00"), tasks);
    expect(screen.getAllByTestId("clock-task-dot")).toHaveLength(2);
  });

  it("exposes an accessible label via the section wrapper", () => {
    renderWidget(new Date("2026-07-12T10:00:00"));
    expect(
      screen.getByLabelText(dashboard.today.clock.heading),
    ).toBeInTheDocument();
  });
});
