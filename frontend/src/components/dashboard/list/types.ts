import type { RefObject } from "react";
import type { Task } from "../types";

export type DashboardListProps = {
  tasks: Task[];
  blockRefs: RefObject<Record<string, HTMLElement | null>>;
  onToggleDone: (id: string) => void;
  onEdit: (task: Task) => void;
  onRemove: (id: string) => void;
};
