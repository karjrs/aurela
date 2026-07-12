"use client";

import { useNote } from "@hooks/dashboard/useNote";
import { useTranslations } from "next-intl";

export const NoteWidget = () => {
  const t = useTranslations("dashboard.today");
  const { note, setNote } = useNote();

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-semibold text-muted-foreground">
        {t("note.heading")}
      </p>

      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder={t("note.placeholder")}
        rows={4}
        aria-label={t("note.heading")}
        className="w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
};
