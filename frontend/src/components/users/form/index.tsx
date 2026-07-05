"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/common/forms/field";
import { Input } from "@/components/common/inputs/input";
import { Button } from "@/components/common/ui/button";
import { useUserForm } from "@/forms/users";
import { getFieldErrors } from "@/utils/helpers/getFieldErrors";

import type { UserFormProps } from "./types";

const FIELDS = ["name", "email"] as const;

export const UserForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
}: UserFormProps) => {
  const t = useTranslations("users");
  const tActions = useTranslations("actions");
  const tErrors = useTranslations("errors");
  const { register, handleSubmit, setError, errors } =
    useUserForm(initialValues);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await onSubmit(values);
    } catch (error) {
      const fieldErrors = getFieldErrors(error);
      if (!fieldErrors) {
        setFormError("unexpected");
        return;
      }
      for (const field of FIELDS) {
        const message = fieldErrors[field]?.[0];
        if (message) setError(field, { message });
      }
    }
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="name">{t("nameLabel")}</FieldLabel>
        <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
        {errors.name?.message && (
          <FieldError>{tErrors(errors.name.message)}</FieldError>
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="email">{t("emailLabel")}</FieldLabel>
        <Input
          id="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email?.message && (
          <FieldError>{tErrors(errors.email.message)}</FieldError>
        )}
      </Field>
      {formError && <FieldError>{tErrors(formError)}</FieldError>}
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {initialValues ? tActions("save") : tActions("create")}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          {tActions("cancel")}
        </Button>
      </div>
    </form>
  );
};
