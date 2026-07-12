import { describe, expect, it } from "vitest";
import type { Task } from "../types";
import { selectNextTask } from "./selectNextTask";

const task = (
  id: string,
  hour: number,
  duration: number,
  done = false,
): Task => ({
  id,
  title: id,
  hour,
  duration,
  done,
  emoji: "🙂",
});

describe("selectNextTask", () => {
  it("returns null when there are no tasks", () => {
    expect(selectNextTask([], 10)).toBeNull();
  });

  it("returns null when every task is done", () => {
    const tasks = [task("a", 8, 1, true), task("b", 12, 1, true)];
    expect(selectNextTask(tasks, 10)).toBeNull();
  });

  it("prefers the earliest upcoming task over an overdue one", () => {
    const tasks = [task("overdue", 7, 1), task("next", 12, 1)];
    expect(selectNextTask(tasks, 10)?.id).toBe("next");
  });

  it("treats a task currently in progress as upcoming", () => {
    const tasks = [task("in-progress", 9, 2)];
    expect(selectNextTask(tasks, 10)?.id).toBe("in-progress");
  });

  it("falls back to the oldest overdue task once nothing upcoming remains", () => {
    const tasks = [task("oldest-overdue", 6, 1), task("newer-overdue", 8, 1)];
    expect(selectNextTask(tasks, 10)?.id).toBe("oldest-overdue");
  });

  it("skips done tasks when picking among upcoming ones", () => {
    const tasks = [
      task("done-first", 11, 1, true),
      task("pending-next", 12, 1),
    ];
    expect(selectNextTask(tasks, 10)?.id).toBe("pending-next");
  });
});
