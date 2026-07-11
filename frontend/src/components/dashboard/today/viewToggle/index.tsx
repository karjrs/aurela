import { Button } from "@components/common/ui/button";
import { CalendarDays, List } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ViewToggleProps } from "./types";

export const ViewToggle = ({ value, onChange }: ViewToggleProps) => {
  const t = useTranslations("dashboard.today.viewToggle");

  return (
    <div
      role="tablist"
      aria-label={t("landmark")}
      className="flex gap-1 rounded-full border border-border bg-muted p-1"
    >
      <Button
        type="button"
        role="tab"
        aria-selected={value === "calendar"}
        variant={value === "calendar" ? "default" : "ghost"}
        size="sm"
        className="flex-1 rounded-full"
        onClick={() => onChange("calendar")}
      >
        <CalendarDays className="size-3.5" aria-hidden />
        {t("calendar")}
      </Button>
      <Button
        type="button"
        role="tab"
        aria-selected={value === "list"}
        variant={value === "list" ? "default" : "ghost"}
        size="sm"
        className="flex-1 rounded-full"
        onClick={() => onChange("list")}
      >
        <List className="size-3.5" aria-hidden />
        {t("list")}
      </Button>
    </div>
  );
};
