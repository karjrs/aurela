import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { defaultValues } from "./consts";
import { schema } from "./schema";
import type { UserFormValues } from "./types";

export const useUserForm = (
  formDefaultValues: UserFormValues = defaultValues,
) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: formDefaultValues,
  });

  return { register, handleSubmit, setError, errors };
};
