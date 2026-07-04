import type { UserFormValues } from "@/forms/users/types";

export type UserFormProps = {
  defaultValues?: UserFormValues;
  onSubmit: (values: UserFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};
