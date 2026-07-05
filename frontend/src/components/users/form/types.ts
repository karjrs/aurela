import type { UserFormValues } from "@/forms/users/types";

export type UserFormProps = {
  defaultValues?: UserFormValues;
  onSubmit: (values: UserFormValues) => Promise<unknown>;
  onCancel: () => void;
  isSubmitting?: boolean;
};
