"use client";

import { useTranslations } from "next-intl";
import { useUsers } from "@/hooks/useUsers";

export const UsersList = () => {
  const t = useTranslations("usersList");
  const { data, isPending, isError } = useUsers();

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
      <ul className="flex flex-col gap-4">
        {data.users.map((user) => (
          <li
            key={user.id}
            className="rounded-lg border border-ink-200 p-4"
          >
            <p className="font-medium text-ink-900">{user.name}</p>
            <p className="text-ink-600">{user.email}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
