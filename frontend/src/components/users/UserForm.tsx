"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/common/button";
import { Input } from "@/components/ui/Input";

// Mirrors backend/src/graphql/users/mutation/schemas.ts. Duplicated
// intentionally — frontend and backend are separate pnpm packages with no
// shared TypeScript import boundary, same as the schema.graphql SDL split
// documented in the README's "Structure" section.
const userFormSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

type UserFormProps = {
  defaultValues?: UserFormValues;
  onSubmit: (values: UserFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export const UserForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
}: UserFormProps) => {
  const t = useTranslations("userForm");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        id="name"
        label={t("nameLabel")}
        error={errors.name && t("nameError")}
        {...register("name")}
      />
      <Input
        id="email"
        label={t("emailLabel")}
        error={errors.email && t("emailError")}
        {...register("email")}
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {defaultValues ? t("saveButton") : t("createButton")}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t("cancelButton")}
        </Button>
      </div>
    </form>
  );
};
