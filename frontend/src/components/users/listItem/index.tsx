"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/common/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/common/ui/card";
import type { UserFormValues } from "@/forms/users/types";

import { useDeleteUser } from "@/services/users/delete";
import { useUpdateUser } from "@/services/users/update";
import { UserForm } from "../form";
import type { UserListItemProps } from "./types";

export const UserListItem = ({
  user,
  isEditing,
  onStartEdit,
  onStopEdit,
  isConfirmingDelete,
  onRequestDelete,
  onCancelDelete,
}: UserListItemProps) => {
  const t = useTranslations("users");
  const tActions = useTranslations("actions");
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleUpdate = (values: UserFormValues) =>
    updateUser.mutateAsync({ id: user.id, input: values }).then((data) => {
      if (data.updateUser !== null) onStopEdit();
    });

  const handleDelete = () => {
    deleteUser.mutate(user.id, { onSuccess: () => onCancelDelete() });
  };

  if (isEditing) {
    return (
      <li>
        <Card>
          <CardContent>
            <UserForm
              initialValues={{ name: user.name, email: user.email }}
              onSubmit={handleUpdate}
              onCancel={onStopEdit}
              isSubmitting={updateUser.isPending}
            />
            {updateUser.isSuccess && updateUser.data.updateUser === null && (
              <p role="alert" className="mt-2 text-sm text-coral-700">
                {t("userNotFound")}
              </p>
            )}
          </CardContent>
        </Card>
      </li>
    );
  }

  return (
    <li>
      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-3 border-t-0 bg-transparent">
          {isConfirmingDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink-600">{t("confirmDelete")}</span>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteUser.isPending}
              >
                {tActions("confirm")}
              </Button>
              <Button variant="secondary" onClick={onCancelDelete}>
                {tActions("cancel")}
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={onStartEdit}>
                {tActions("edit")}
              </Button>
              <Button variant="secondary" onClick={onRequestDelete}>
                {tActions("delete")}
              </Button>
            </div>
          )}

          {deleteUser.isSuccess && deleteUser.data.deleteUser === false && (
            <p role="alert" className="text-sm text-coral-700">
              {t("deleteNotFound")}
            </p>
          )}
        </CardFooter>
      </Card>
    </li>
  );
};
