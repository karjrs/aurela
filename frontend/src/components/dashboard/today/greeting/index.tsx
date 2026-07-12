"use client";

import { useTranslations } from "next-intl";
import type { GreetingProps } from "./types";

const greetingPeriod = (hour: number) => {
  if (hour < 5) return "night";
  if (hour < 11) return "morning";
  if (hour < 14) return "noon";
  if (hour < 18) return "afternoon";
  if (hour < 22) return "evening";
  return "night";
};

export const Greeting = ({ now, userName }: GreetingProps) => {
  const t = useTranslations("dashboard.today");
  const hour = now.getHours() + now.getMinutes() / 60;

  const variants = t.raw(`greeting.${greetingPeriod(hour)}`) as string[];
  const greeting = variants[Math.floor(Math.random() * variants.length)];

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-display text-2xl font-medium text-foreground">
          {greeting}, {userName}.
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {t("dateLabel", { date: now })}
        </p>
      </div>
    </div>
  );
};
