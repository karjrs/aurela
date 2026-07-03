"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/common/button";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { UserForm, type UserFormValues } from "./UserForm";

type User = { id: string; name: string; email: string };

type UserListItemProps = {
  user: User;
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
  isConfirmingDelete: boolean;
  onRequestDelete: () => void;
  onCancelDelete: () => void;
};

export const UserListItem = ({
  user,
  isEditing,
  onStartEdit,
  onStopEdit,
  isConfirmingDelete,
  onRequestDelete,
  onCancelDelete,
}: UserListItemProps) => {
  const t = useTranslations("usersList");
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleUpdate = (values: UserFormValues) => {
    updateUser.mutate(
      { id: user.id, input: values },
      {
        onSuccess: (data) => {
          if (data.updateUser !== null) onStopEdit();
        },
      },
    );
  };

  const handleDelete = () => {
    deleteUser.mutate(user.id, { onSuccess: () => onCancelDelete() });
  };

  if (isEditing) {
    return (
      <li className="rounded-lg border border-ink-200 p-4">
        <UserForm
          defaultValues={{ name: user.name, email: user.email }}
          onSubmit={handleUpdate}
          onCancel={onStopEdit}
          isSubmitting={updateUser.isPending}
        />
        {updateUser.isSuccess && updateUser.data.updateUser === null && (
          <p role="alert" className="mt-2 text-sm text-coral-700">
            {t("userNotFound")}
          </p>
        )}
      </li>
    );
  }

  return (
    <li className="rounded-lg border border-ink-200 p-4">
      <p className="font-medium text-ink-900">{user.name}</p>
      <p className="text-ink-600">{user.email}</p>

      {isConfirmingDelete ? (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-ink-600">{t("confirmDelete")}</span>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteUser.isPending}
          >
            {t("confirmDeleteButton")}
          </Button>
          <Button variant="secondary" onClick={onCancelDelete}>
            {t("cancelButton")}
          </Button>
        </div>
      ) : (
        <div className="mt-3 flex gap-2">
          <Button variant="secondary" onClick={onStartEdit}>
            {t("editButton")}
          </Button>
          <Button variant="secondary" onClick={onRequestDelete}>
            {t("deleteButton")}
          </Button>
        </div>
      )}

      {deleteUser.isSuccess && deleteUser.data.deleteUser === false && (
        <p role="alert" className="mt-2 text-sm text-coral-700">
          {t("deleteNotFound")}
        </p>
      )}
    </li>
  );
};
