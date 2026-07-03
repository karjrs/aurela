import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { UserFormValues } from "./types";
import { schema } from "./schema";
import { defaultValues } from "./consts";

export const useUserForm = (
  formDefaultValues: UserFormValues = defaultValues,
) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: formDefaultValues,
  });

  return { register, handleSubmit, errors };
};
