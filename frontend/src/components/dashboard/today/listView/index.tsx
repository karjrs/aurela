"use client";

import { useTranslations } from "next-intl";
import { ListItem } from "./listItem";
import type { ListViewProps } from "./types";

export const ListView = ({
  tasks,
  highlightId,
  blockRefs,
  onToggleDone,
  onEdit,
  onRemove,
}: ListViewProps) => {
  const t = useTranslations("dashboard.today.task");

  if (!tasks.length) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        {t("emptyState")}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {tasks.map((task) => (
        <ListItem
          key={task.id}
          task={task}
          highlighted={highlightId === task.id}
          onRegisterNode={(node) => {
            blockRefs.current[task.id] = node;
          }}
          onToggleDone={() => onToggleDone(task.id)}
          onEdit={() => onEdit(task)}
          onRemove={() => onRemove(task.id)}
        />
      ))}
    </ul>
  );
};
