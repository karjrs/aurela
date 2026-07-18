import type { TaskFormValues } from "../types";

export type TaskSheetFormProps = {
  initialValues?: TaskFormValues;
  onSubmit: (values: TaskFormValues) => void;
  onCancel: () => void;
};
