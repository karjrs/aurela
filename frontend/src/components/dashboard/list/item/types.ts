import type { Task } from "@components/dashboard/types";

export type DashboardListItemProps = {
  task: Task;
  onRegisterNode: (node: HTMLLIElement | null) => void;
  onToggleDone: () => void;
  onEdit: () => void;
  onRemove: () => void;
};
