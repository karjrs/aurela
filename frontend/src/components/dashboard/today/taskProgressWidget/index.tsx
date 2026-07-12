"use client";

import { useTranslations } from "next-intl";
import { ProgressRingCard } from "../progressRingCard";
import type { TaskProgressWidgetProps } from "./types";

export const TaskProgressWidget = ({ tasks }: TaskProgressWidgetProps) => {
  const t = useTranslations("dashboard.today");
  const total = tasks.length;
  const completed = tasks.filter((task) => task.done).length;
  const label = t("progress.label", { count: total });

  return <ProgressRingCard total={total} completed={completed} label={label} />;
};
