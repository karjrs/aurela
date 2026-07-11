"use client";

import { useTranslations } from "next-intl";
import type { GreetingProps } from "./types";

const greetingKey = (hour: number) => {
  if (hour < 5) return "night";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
};

export const Greeting = ({ now }: GreetingProps) => {
  const t = useTranslations("dashboard.today");
  const hour = now.getHours() + now.getMinutes() / 60;

  return (
    <div>
      <p className="font-display text-2xl font-medium text-foreground">
        {t(`greeting.${greetingKey(hour)}`)}
      </p>
      <p className="mt-0.5 text-sm text-muted-foreground">
        {t("dateLabel", { date: now })}
      </p>
    </div>
  );
};
