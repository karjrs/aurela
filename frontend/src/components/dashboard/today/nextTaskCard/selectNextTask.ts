import type { Task } from "../types";

export const selectNextTask = (
  sortedTasks: Task[],
  currentHour: number,
): Task | null => {
  const pending = sortedTasks.filter((task) => !task.done);
  const upcoming = pending.find(
    (task) => task.hour + task.duration >= currentHour,
  );
  if (upcoming) return upcoming;

  return (
    pending.find((task) => task.hour + task.duration < currentHour) ?? null
  );
};
