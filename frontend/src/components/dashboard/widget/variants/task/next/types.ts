import type { Task } from "@components/dashboard/types";

export type TaskNextProps = {
  tasks: Task[];
  currentHour: number;
  onToggleDone: (id: string) => void;
  onEdit: (task: Task) => void;
  onRemove: (id: string) => void;
};
