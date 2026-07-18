export type Task = {
  id: string;
  title: string;
  hour: Date;
  duration: number;
  done: boolean;
  emoji: string;
};

export type TaskInput = {
  title: string;
  hour: Date;
  duration: number;
  emoji: string;
};

export type ViewMode = "calendar" | "list";
