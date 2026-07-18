import type { Task } from "@components/dashboard/types";

export type ArcMarkerProps = {
  task: Task;
  onSelect: (id: string) => void;
};
