"use client";

import { useDurationLabel } from "@hooks/dashboard/useDurationLabel";
import { useSleep } from "@hooks/dashboard/useSleep";
import { clamp01 } from "@utils/dateTime";
import { useTranslations } from "next-intl";

export const SleepWidget = () => {
  const t = useTranslations("dashboard.today");
  const durationLabel = useDurationLabel();
  const { sleptHours, maxHours } = useSleep();

  const progress = clamp01(sleptHours / maxHours);

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-semibold text-muted-foreground">
        {t("sleep.heading")}
      </p>
      <p className="font-display text-2xl font-medium text-foreground">
        {durationLabel(sleptHours)}
      </p>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted-foreground/20">
        <div
          data-testid="sleep-bar-fill"
          className="h-full rounded-full bg-[color:var(--accent-brand)] transition-[width] duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
};
