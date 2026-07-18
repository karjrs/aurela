"use client";

import { Widget } from "@components/dashboard/widget";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const Note = () => {
  const t = useTranslations("dashboard.note");
  const [note, setNote] = useState("");

  return (
    <Widget className="flex h-32 flex-col gap-3 row-start-3 col-start-7 col-span-4">
      <p className="text-xs font-semibold text-muted-foreground">
        {t("heading")}
      </p>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder={t("placeholder")}
        aria-label={t("heading")}
        className="w-full flex-1 resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
    </Widget>
  );
};
