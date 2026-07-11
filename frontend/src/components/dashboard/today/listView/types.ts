import type { MutableRefObject } from "react";
import type { Task } from "../types";

export type ListViewProps = {
  tasks: Task[];
  highlightId: string | null;
  blockRefs: MutableRefObject<Record<string, HTMLElement | null>>;
  onToggleDone: (id: string) => void;
  onEdit: (task: Task) => void;
  onRemove: (id: string) => void;
};
