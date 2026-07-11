import type { Task } from "../types";

export type SunArcProps = {
  tasks: Task[];
  currentHour: number;
  highlightId: string | null;
  onSelectTask: (id: string) => void;
};
