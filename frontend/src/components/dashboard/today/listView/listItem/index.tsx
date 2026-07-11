"use client";

import { hourToTime } from "@utils/dateTime";
import { cn } from "@utils/helpers/cn";
import { Check, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ListItemProps } from "./types";

export const ListItem = ({
  task,
  highlighted,
  onRegisterNode,
  onToggleDone,
  onEdit,
  onRemove,
}: ListItemProps) => {
  const t = useTranslations("dashboard.today");

  return (
    <li
      ref={onRegisterNode}
      className={cn(
        "flex items-center gap-2.5 rounded-2xl border p-3",
        task.done ? "bg-[color:var(--accent-brand-soft)]" : "bg-card",
        highlighted ? "border-primary" : "border-border",
      )}
    >
      <div
        className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-background text-base"
        aria-hidden
      >
        {task.emoji}
      </div>
      <button
        type="button"
        onClick={onToggleDone}
        aria-label={t(task.done ? "task.markNotDone" : "task.markDone")}
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-white",
          task.done
            ? "border-primary bg-primary"
            : "border-border bg-transparent",
        )}
      >
        {task.done && <Check className="size-3.5" aria-hidden />}
      </button>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "truncate text-sm font-medium",
            task.done
              ? "text-muted-foreground line-through"
              : "text-foreground",
          )}
        >
          {task.title}
        </div>
        <div className="text-xs text-muted-foreground">
          {hourToTime(task.hour)}–{hourToTime(task.hour + task.duration)}
        </div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        aria-label={t("task.edit")}
        className="shrink-0 text-muted-foreground"
      >
        <Pencil className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label={t("task.delete")}
        className="shrink-0 text-muted-foreground"
      >
        <Trash2 className="size-4" aria-hidden />
      </button>
    </li>
  );
};
