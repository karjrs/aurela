import type { Task } from "@components/dashboard/types";
import type { MutableRefObject } from "react";

export type TaskListProps = {
  tasks: Task[];
  blockRefs: MutableRefObject<Record<string, HTMLElement | null>>;
  onToggleDone: (id: string) => void;
  onEdit: (task: Task) => void;
  onRemove: (id: string) => void;
};
