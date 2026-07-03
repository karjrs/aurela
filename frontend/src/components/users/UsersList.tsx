"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/common/button";
import { useCreateUser } from "@/hooks/useCreateUser";
import { useUsers } from "@/hooks/useUsers";
import { UserForm } from "./UserForm";
import { UserListItem } from "./UserListItem";

export const UsersList = () => {
  const t = useTranslations("usersList");
  const { data, isPending, isError } = useUsers();
  const createUser = useCreateUser();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(
    null,
  );

  if (isPending) {
    return <p>{t("loading")}</p>;
  }

  if (isError) {
    return <p role="alert">{t("error")}</p>;
  }

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-20">
      <h1 className="font-display text-3xl font-medium text-ink-900">
        {t("heading")}
      </h1>

      {isCreating ? (
        <UserForm
          onSubmit={(values) =>
            createUser.mutate(values, {
              onSuccess: () => setIsCreating(false),
            })
          }
          onCancel={() => setIsCreating(false)}
          isSubmitting={createUser.isPending}
        />
      ) : (
        <Button onClick={() => setIsCreating(true)}>
          {t("addUserButton")}
        </Button>
      )}

      <ul className="flex flex-col gap-4">
        {data.users.map((user) => (
          <UserListItem
            key={user.id}
            user={user}
            isEditing={editingId === user.id}
            onStartEdit={() => setEditingId(user.id)}
            onStopEdit={() => setEditingId(null)}
            isConfirmingDelete={confirmingDeleteId === user.id}
            onRequestDelete={() => setConfirmingDeleteId(user.id)}
            onCancelDelete={() => setConfirmingDeleteId(null)}
          />
        ))}
      </ul>
    </section>
  );
};
