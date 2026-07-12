"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { ListItem } from "../listView/listItem";
import { selectNextTask } from "./selectNextTask";
import type { NextTaskCardProps } from "./types";

export const NextTaskCard = ({
  tasks,
  currentHour,
  highlightId,
  onToggleDone,
  onEdit,
  onRemove,
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
        <ul className="mt-2">
          <ListItem
            task={nextTask}
            highlighted={highlightId === nextTask.id}
            onRegisterNode={() => {}}
            onToggleDone={() => onToggleDone(nextTask.id)}
            onEdit={() => onEdit(nextTask)}
            onRemove={() => onRemove(nextTask.id)}
          />
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          {t("nextTask.empty")}
        </p>
      )}
    </div>
  );
};
