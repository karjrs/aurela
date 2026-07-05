"use client";

import { useTranslations } from "next-intl";
import { Field, FieldError, FieldLabel } from "@/components/common/forms/field";
import { Input } from "@/components/common/inputs/input";
import { Button } from "@/components/common/ui/button";

import { useUserForm } from "@/forms/users";

import type { UserFormProps } from "./types";

export const UserForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
}: UserFormProps) => {
  const t = useTranslations("users");
  const tActions = useTranslations("actions");
  const { register, handleSubmit, errors } = useUserForm(defaultValues);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="name">{t("nameLabel")}</FieldLabel>
        <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
        {errors.name && <FieldError>{t("nameError")}</FieldError>}
      </Field>
      <Field>
        <FieldLabel htmlFor="email">{t("emailLabel")}</FieldLabel>
        <Input
          id="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && <FieldError>{t("emailError")}</FieldError>}
      </Field>
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {defaultValues ? tActions("save") : tActions("create")}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          {tActions("cancel")}
        </Button>
      </div>
    </form>
  );
};
