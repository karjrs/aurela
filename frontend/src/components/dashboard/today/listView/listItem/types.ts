import type { Task } from "../../types";

export type ListItemProps = {
  task: Task;
  highlighted: boolean;
  onRegisterNode: (node: HTMLLIElement | null) => void;
  onToggleDone: () => void;
  onEdit: () => void;
  onRemove: () => void;
};
