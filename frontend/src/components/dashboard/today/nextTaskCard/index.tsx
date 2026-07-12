"use client";

import { hourToTime } from "@utils/dateTime";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { selectNextTask } from "./selectNextTask";
import type { NextTaskCardProps } from "./types";

export const NextTaskCard = ({
  tasks,
  currentHour,
  onToggleDone,
  onSelectTask,
}: NextTaskCardProps) => {
  const t = useTranslations("dashboard.today");
  const nextTask = useMemo(
    () => selectNextTask(tasks, currentHour),
    [tasks, currentHour],
  );

  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-semibold text-muted-foreground">
        {t("nextTask.heading")}
      </p>

      {nextTask ? (
        <div className="mt-2 flex items-center gap-2.5">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleDone(nextTask.id);
            }}
            aria-label={t(nextTask.done ? "task.markNotDone" : "task.markDone")}
            className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-border bg-transparent text-white"
          >
            {nextTask.done && <Check className="size-3.5" aria-hidden />}
          </button>

          {/* biome-ignore lint/a11y/useSemanticElements: sibling <button> above already covers the toggle action; this row is a separate select/scroll trigger */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => onSelectTask(nextTask.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelectTask(nextTask.id);
              }
            }}
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5"
          >
            <div
              className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-background text-base"
              aria-hidden
            >
              {nextTask.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-foreground">
                {nextTask.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {hourToTime(nextTask.hour)}–
                {hourToTime(nextTask.hour + nextTask.duration)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          {t("nextTask.empty")}
        </p>
      )}
    </div>
  );
};
