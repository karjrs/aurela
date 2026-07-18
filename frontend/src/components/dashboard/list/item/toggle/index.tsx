"use client";

import { cn } from "@utils/helpers/cn";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import type { DashboardListItemToggleProps } from "./types";

export const DashboardListItemToggle = ({
  done,
  onToggle,
}: DashboardListItemToggleProps) => {
  const t = useTranslations("dashboard.task");

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={t(done ? "markNotDone" : "markDone")}
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-white",
        done ? "border-primary bg-primary" : "border-border bg-transparent",
      )}
    >
      {done && <Check className="size-3.5" aria-hidden />}
    </button>
  );
};
