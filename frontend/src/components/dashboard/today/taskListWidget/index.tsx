"use client";

import { useTranslations } from "next-intl";
import { ListView } from "../listView";
import type { TaskListWidgetProps } from "./types";

export const TaskListWidget = ({
  tasks,
  highlightId,
  blockRefs,
  onToggleDone,
  onEdit,
  onRemove,
}: TaskListWidgetProps) => {
  const t = useTranslations("dashboard.today");

  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-semibold text-muted-foreground">
        {t("taskList.heading")}
      </p>

      <div className="mt-2">
        <ListView
          tasks={tasks}
          highlightId={highlightId}
          blockRefs={blockRefs}
          onToggleDone={onToggleDone}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      </div>
    </div>
  );
};
