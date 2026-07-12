import type { Task, TaskInput } from "@components/dashboard/today/types";

export type TaskBlockProps = {
  task: Task;
  highlighted: boolean;
  column: number;
  columnCount: number;
  onRegisterNode: (node: HTMLDivElement | null) => void;
  onToggleDone: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onUpdateTiming: (patch: Partial<TaskInput>) => void;
};
