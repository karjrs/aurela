export type TaskFormValues = {
  title: string;
  hour: number;
  duration: number;
  emoji: string;
};

export type TaskFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TaskFormValues) => void;
  initialValues?: TaskFormValues;
};
