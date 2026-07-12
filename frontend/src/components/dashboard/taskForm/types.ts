import type { TaskInput } from "@components/dashboard/today/types";

export type TaskFormProps = {
  initialValues?: TaskInput;
  onSubmit: (input: TaskInput) => void;
  onCancel: () => void;
};
