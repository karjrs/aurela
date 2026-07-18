import { act, renderHook } from "@testing-library/react";
import { atHour } from "@utils/dateTime";
import { describe, expect, it } from "vitest";
import { useDashboardTasks } from ".";

const input = { title: "Walk", hour: atHour(9), duration: 1, emoji: "🚶" };

describe("useDashboardTasks", () => {
  it("starts with the given initial tasks", () => {
    const { result } = renderHook(() =>
      useDashboardTasks([{ id: "1", done: false, ...input }]),
    );

    expect(result.current.tasks).toHaveLength(1);
  });

  it("toggles done state", () => {
    const { result } = renderHook(() =>
      useDashboardTasks([{ id: "1", done: false, ...input }]),
    );

    act(() => result.current.toggleTaskDone("1"));
    expect(result.current.tasks[0].done).toBe(true);

    act(() => result.current.toggleTaskDone("1"));
    expect(result.current.tasks[0].done).toBe(false);
  });

  it("updates a task", () => {
    const { result } = renderHook(() =>
      useDashboardTasks([{ id: "1", done: false, ...input }]),
    );

    act(() => result.current.updateTask("1", { title: "Run" }));

    expect(result.current.tasks[0].title).toBe("Run");
  });

  it("removes a task", () => {
    const { result } = renderHook(() =>
      useDashboardTasks([{ id: "1", done: false, ...input }]),
    );

    act(() => result.current.removeTask("1"));

    expect(result.current.tasks).toHaveLength(0);
  });
});
