"use client";

import { useTranslations } from "next-intl";
import { ProgressRingCard } from "../progressRingCard";

const PLACEHOLDER_TOTAL = 6;
const PLACEHOLDER_COMPLETED = 4;

export const PlaceholderProgressWidget = () => {
  const t = useTranslations("dashboard.today");
  const label = t("progress.label", { count: PLACEHOLDER_TOTAL });

  return (
    <ProgressRingCard
      total={PLACEHOLDER_TOTAL}
      completed={PLACEHOLDER_COMPLETED}
      label={label}
    />
  );
};
