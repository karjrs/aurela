"use client";

import { Widget } from "@components/dashboard/widget";
import { DashboardList } from "@root/components/dashboard/list";
import { useTranslations } from "next-intl";
import type { TaskListProps } from "./types";

export const TaskList = ({
  tasks,
  blockRefs,
  onToggleDone,
  onEdit,
  onRemove,
}: TaskListProps) => {
  const t = useTranslations("dashboard");

  return (
    <Widget className="gap-0 col-start-1 col-end-7">
      <p className="text-xs font-semibold text-muted-foreground">
        {t("taskList.heading")}
      </p>

      <div className="mt-2">
        <DashboardList
          tasks={tasks}
          blockRefs={blockRefs}
          onToggleDone={onToggleDone}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      </div>
    </Widget>
  );
};
