import { cn } from "@utils/helpers/cn";
import { DashboardListItemActions } from "./actions";
import { DashboardListItemDetails } from "./details";
import { DashboardListItemEmoji } from "./emoji";
import { DashboardListItemToggle } from "./toggle";
import type { DashboardListItemProps } from "./types";

export const DashboardListItem = ({
  task,
  onRegisterNode,
  onToggleDone,
  onEdit,
  onRemove,
}: DashboardListItemProps) => {
  const { emoji, done } = task;

  return (
    <li
      ref={onRegisterNode}
      tabIndex={-1}
      className={cn(
        "flex items-center gap-2.5 rounded-2xl border border-border p-3 outline-none",
        "focus-visible:ring-3 focus-visible:ring-ring/50",
        done ? "bg-accent-brand-soft" : "bg-card",
      )}
    >
      <DashboardListItemEmoji emoji={emoji} />
      <DashboardListItemToggle done={done} onToggle={onToggleDone} />
      <DashboardListItemDetails task={task} />
      <DashboardListItemActions onEdit={onEdit} onRemove={onRemove} />
    </li>
  );
};
