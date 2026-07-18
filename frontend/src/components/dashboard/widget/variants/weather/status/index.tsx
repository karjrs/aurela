"use client";

import { useTranslations } from "next-intl";
import type { WeatherStatusProps } from "./types";

export const WeatherStatus = ({ status }: WeatherStatusProps) => {
  const t = useTranslations("dashboard");

  if (status === "pending") {
    return (
      <div
        aria-hidden
        className="h-16 w-full animate-pulse rounded-2xl bg-muted"
      />
    );
  }

  return <p className="text-sm text-muted-foreground">{t("weather.error")}</p>;
};
