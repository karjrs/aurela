import type { Task, TaskInput } from "@components/dashboard/today/types";
import type { MutableRefObject } from "react";

export type CalendarViewProps = {
  tasks: Task[];
  currentHour: number;
  highlightId: string | null;
  blockRefs: MutableRefObject<Record<string, HTMLElement | null>>;
  onToggleDone: (id: string) => void;
  onEdit: (task: Task) => void;
  onRemove: (id: string) => void;
  onUpdateTiming: (id: string, patch: Partial<TaskInput>) => void;
};
