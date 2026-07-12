import dashboard from "@i18n/pl/dashboard.json";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import type { Task } from "../types";
import { TaskProgressWidget } from ".";

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

const renderWidget = (tasks: Task[]) =>
  render(
    <NextIntlClientProvider locale="pl" messages={messages}>
      <TaskProgressWidget tasks={tasks} />
    </NextIntlClientProvider>,
  );

describe("TaskProgressWidget", () => {
  it("shows the total count with the correct Polish plural label", () => {
    const tasks = [
      makeTask({ id: "1", done: true }),
      makeTask({ id: "2", done: true }),
      makeTask({ id: "3", done: false }),
      makeTask({ id: "4", done: false }),
    ];

    renderWidget(tasks);

    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("zadania")).toBeInTheDocument();
  });

  it("shows zero with the many-form label when there are no tasks", () => {
    renderWidget([]);

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("zadań")).toBeInTheDocument();
  });

  it("uses the singular label for exactly one task", () => {
    renderWidget([makeTask({ id: "1" })]);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("zadanie")).toBeInTheDocument();
  });
});
