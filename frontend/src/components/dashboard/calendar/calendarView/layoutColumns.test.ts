import type { Task } from "@components/dashboard/types";
import { atHour } from "@utils/dateTime";
import { describe, expect, it } from "vitest";
import { layoutColumns } from "./layoutColumns";

const task = (id: string, hour: number, duration: number): Task => ({
  id,
  title: id,
  hour: atHour(hour),
  duration,
  done: false,
  emoji: "🙂",
});

describe("layoutColumns", () => {
  it("puts non-overlapping tasks in a single column", () => {
    const tasks = [task("a", 8, 1), task("b", 10, 1)];
    const { columnOf, columnCountOf } = layoutColumns(tasks);

    expect(columnOf.a).toBe(0);
    expect(columnOf.b).toBe(0);
    expect(columnCountOf.a).toBe(1);
    expect(columnCountOf.b).toBe(1);
  });

  it("splits overlapping tasks into separate columns", () => {
    const tasks = [task("a", 8, 2), task("b", 9, 2)];
    const { columnOf, columnCountOf } = layoutColumns(tasks);

    expect(columnOf.a).not.toBe(columnOf.b);
    expect(columnCountOf.a).toBe(2);
    expect(columnCountOf.b).toBe(2);
  });

  it("starts a fresh column count once the overlapping cluster ends", () => {
    const tasks = [task("a", 8, 1), task("b", 8.5, 1), task("c", 10, 1)];
    const { columnOf, columnCountOf } = layoutColumns(tasks);

    expect(columnOf.a).toBe(0);
    expect(columnOf.b).toBe(1);
    expect(columnCountOf.a).toBe(2);
    expect(columnCountOf.b).toBe(2);

    expect(columnOf.c).toBe(0);
    expect(columnCountOf.c).toBe(1);
  });
});
