"use client";

import { Link } from "@i18n/navigation";
import { routes } from "@utils/consts/routes";
import { ArrowUpRight } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import type { CalendarCardWidgetProps } from "./types";

export const CalendarCardWidget = ({ now }: CalendarCardWidgetProps) => {
  const t = useTranslations("dashboard.today");
  const format = useFormatter();

  const weekday = format.dateTime(now, { weekday: "long" });
  const day = format.dateTime(now, { day: "numeric" });
  const month = format.dateTime(now, { month: "long" });

  return (
    <Link
      href={routes.dashboard.calendar}
      aria-label={t("calendarCard.linkLabel")}
      className="relative flex aspect-square flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-opacity hover:opacity-90"
    >
      <div className="shrink-0 bg-primary px-2 py-2 text-center text-primary-foreground">
        <span className="text-sm font-bold tracking-wide uppercase">
          {month}
        </span>
      </div>
      <ArrowUpRight
        className="absolute top-2.5 right-2.5 size-4 text-primary-foreground/70"
        aria-hidden
      />
      <div className="flex flex-1 flex-col items-center justify-center gap-1 px-1.5 text-center">
        <span className="font-display text-6xl leading-none font-bold text-primary">
          {day}
        </span>
        <span className="text-sm font-bold tracking-wide text-foreground uppercase">
          {weekday}
        </span>
      </div>
    </Link>
  );
};
