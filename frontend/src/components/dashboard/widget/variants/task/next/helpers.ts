import type { Task } from "@components/dashboard/types";
import { hourOfDay } from "@utils/dateTime";

export const selectNextTask = (
  sortedTasks: Task[],
  currentHour: number,
): Task | null => {
  const pending = sortedTasks.filter((task) => !task.done);
  const upcoming = pending.find(
    (task) => hourOfDay(task.hour) + task.duration >= currentHour,
  );
  if (upcoming) return upcoming;

  return (
    pending.find(
      (task) => hourOfDay(task.hour) + task.duration < currentHour,
    ) ?? null
  );
};
