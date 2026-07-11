import type { TaskInput } from "../types";

export type TaskFormProps = {
  initialValues?: TaskInput;
  onSubmit: (input: TaskInput) => void;
  onCancel: () => void;
};
