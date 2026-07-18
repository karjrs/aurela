"use client";

import { Widget } from "@components/dashboard/widget";
import { DashboardListItem } from "@root/components/dashboard/list/item";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { selectNextTask } from "./helpers";
import type { TaskNextProps } from "./types";

export const TaskNext = ({
  tasks,
  currentHour,
  onToggleDone,
  onEdit,
  onRemove,
}: TaskNextProps) => {
  const t = useTranslations("dashboard");

  const nextTask = useMemo(
    () => selectNextTask(tasks, currentHour),
    [tasks, currentHour],
  );

  return (
    <Widget className="col-start-1 col-span-6 gap-0">
      <p className="text-xs font-semibold text-muted-foreground">
        {t("nextTask.heading")}
      </p>

      {nextTask ? (
        <ul className="mt-2">
          <DashboardListItem
            task={nextTask}
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
    </Widget>
  );
};
