"use client";

import { DashboardListItem } from "./item";
import type { DashboardListProps } from "./types";

export const DashboardList = ({
  tasks,
  blockRefs,
  onToggleDone,
  onEdit,
  onRemove,
}: DashboardListProps) => {
  if (!tasks.length) return null;

  return (
    <ul className="flex flex-col gap-2.5">
      {tasks.map((task) => (
        <DashboardListItem
          key={task.id}
          task={task}
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
