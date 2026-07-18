import type { Task, TaskInput } from "@components/dashboard/types";

export type DashboardCalendarViewTaskBlockProps = {
  task: Task;
  column: number;
  columnCount: number;
  onToggleDone: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onUpdateTiming: (patch: Partial<TaskInput>) => void;
};
