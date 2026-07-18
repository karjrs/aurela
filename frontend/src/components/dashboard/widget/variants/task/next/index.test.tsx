import type { Task } from "@components/dashboard/types";
import dashboard from "@i18n/pl/dashboard.json";
import { fireEvent, render, screen } from "@testing-library/react";
import { atHour } from "@utils/dateTime";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { TaskNext } from ".";

const { selectNextTaskMock } = vi.hoisted(() => ({
  selectNextTaskMock: vi.fn(),
}));

vi.mock("./helpers", () => ({
  selectNextTask: selectNextTaskMock,
}));

const messages = { dashboard };

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: "task-1",
  title: "Walk the dog",
  hour: atHour(8),
  duration: 0.5,
  done: false,
  emoji: "🐕",
  ...overrides,
});

const renderWidget = (props?: {
  onToggleDone?: (id: string) => void;
  onEdit?: (task: Task) => void;
  onRemove?: (id: string) => void;
}) =>
  render(
    <NextIntlClientProvider locale="pl" messages={messages}>
      <TaskNext
        tasks={[]}
        currentHour={10}
        onToggleDone={props?.onToggleDone ?? vi.fn()}
        onEdit={props?.onEdit ?? vi.fn()}
        onRemove={props?.onRemove ?? vi.fn()}
      />
    </NextIntlClientProvider>,
  );

describe("TaskNext", () => {
  it("shows the empty state when there is no upcoming task", () => {
    selectNextTaskMock.mockReturnValue(null);

    renderWidget();

    expect(screen.getByText("Wszystko zrobione 🎉")).toBeInTheDocument();
  });

  it("renders the selected task", () => {
    selectNextTaskMock.mockReturnValue(makeTask());

    renderWidget();

    expect(screen.getByText("Walk the dog")).toBeInTheDocument();
  });

  it("calls onToggleDone with the task id", () => {
    selectNextTaskMock.mockReturnValue(makeTask());
    const onToggleDone = vi.fn();

    renderWidget({ onToggleDone });

    fireEvent.click(
      screen.getByRole("button", { name: "Oznacz jako ukończone" }),
    );

    expect(onToggleDone).toHaveBeenCalledWith("task-1");
  });

  it("calls onEdit with the task", () => {
    const task = makeTask();
    selectNextTaskMock.mockReturnValue(task);
    const onEdit = vi.fn();

    renderWidget({ onEdit });

    fireEvent.click(screen.getByRole("button", { name: "Edytuj" }));

    expect(onEdit).toHaveBeenCalledWith(task);
  });

  it("calls onRemove with the task id", () => {
    selectNextTaskMock.mockReturnValue(makeTask());
    const onRemove = vi.fn();

    renderWidget({ onRemove });

    fireEvent.click(screen.getByRole("button", { name: "Usuń" }));

    expect(onRemove).toHaveBeenCalledWith("task-1");
  });
});
