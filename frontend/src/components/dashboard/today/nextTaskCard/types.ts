import type { Task } from "../types";

export type NextTaskCardProps = {
  tasks: Task[];
  currentHour: number;
  onToggleDone: (id: string) => void;
  onSelectTask: (id: string) => void;
};
