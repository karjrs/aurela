import type { Task, TaskInput } from "@components/dashboard/types";

export type DashboardCalendarViewProps = {
  tasks: Task[];
  currentHour: number;
  onToggleDone: (id: string) => void;
  onEdit: (task: Task) => void;
  onRemove: (id: string) => void;
  onUpdateTiming: (id: string, patch: Partial<TaskInput>) => void;
};
