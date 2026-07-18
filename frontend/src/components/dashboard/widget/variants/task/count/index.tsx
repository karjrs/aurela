"use client";

import { Widget } from "@components/dashboard/widget";
import { useTranslations } from "next-intl";
import { CIRCUMFERENCE, RADIUS, STROKE_WIDTH } from "./consts";
import type { TaskCountProps } from "./types";

export const TaskCount = ({ tasks }: TaskCountProps) => {
  const t = useTranslations("dashboard");
  const total = tasks.length;
  const completed = tasks.filter((task) => task.done).length;
  const label = t("progress.label", { count: total });
  const progress = total === 0 ? 0 : completed / total;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <Widget className="relative col-start-7 col-span-2 row-start-4 h-32">
      <svg
        className="mx-auto block h-24 w-auto -rotate-90"
        viewBox="0 0 100 100"
        role="img"
        aria-label={`${total} ${label}`}
      >
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE_WIDTH}
          className="stroke-muted-foreground/20"
        />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          className="stroke-accent-brand transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-lg font-medium text-foreground">
          {total}
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </Widget>
  );
};
