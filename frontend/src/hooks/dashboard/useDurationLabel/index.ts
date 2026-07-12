"use client";

import { splitDuration } from "@utils/dateTime";
import { useTranslations } from "next-intl";

export const useDurationLabel = () => {
  const t = useTranslations("dashboard.today.duration");

  return (durationHours: number) => {
    const { hours, minutes } = splitDuration(durationHours);
    if (hours && minutes) return t("hoursMinutes", { hours, minutes });
    if (hours) return t("hours", { hours });
    return t("minutes", { minutes });
  };
};
