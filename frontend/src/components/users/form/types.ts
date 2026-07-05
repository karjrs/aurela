import type { UserFormValues } from "@/forms/users/types";

export type UserFormProps = {
  initialValues?: UserFormValues;
  onSubmit: (values: UserFormValues) => Promise<unknown>;
  onCancel: () => void;
  isSubmitting?: boolean;
};
