"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/common/ui/button";
import { useUsers } from "@/services/users";
import { useCreateUser } from "@/services/users/create";
import { UserForm } from "../form";
import { UserListItem } from "../listItem";

export const UsersList = () => {
  const t = useTranslations("users");
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
    return <p role="alert">{t("loadError")}</p>;
  }

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-20">
      <h1 className="font-display text-3xl font-medium text-ink-900">
        {t("heading")}
      </h1>

      {isCreating ? (
        <UserForm
          onSubmit={(values) =>
            createUser.mutateAsync(values).then(() => setIsCreating(false))
          }
          onCancel={() => setIsCreating(false)}
          isSubmitting={createUser.isPending}
        />
      ) : (
        <Button onClick={() => setIsCreating(true)}>{t("addButton")}</Button>
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
