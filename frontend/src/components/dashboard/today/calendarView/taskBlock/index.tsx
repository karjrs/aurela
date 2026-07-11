"use client";

import { hourToTime } from "@utils/dateTime";
import { cn } from "@utils/helpers/cn";
import { Check, GripVertical, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { DAY_START, HOUR_HEIGHT } from "../../consts";
import type { TaskBlockProps } from "./types";
import { useDragResize } from "./useDragResize";

export const TaskBlock = ({
  task,
  highlighted,
  column,
  columnCount,
  onRegisterNode,
  onToggleDone,
  onEdit,
  onRemove,
  onUpdateTiming,
}: TaskBlockProps) => {
  const t = useTranslations("dashboard.today");
  const { isDragging, hour, duration, beginMove, beginResize } = useDragResize(
    task,
    HOUR_HEIGHT,
    onUpdateTiming,
  );

  const top = (hour - DAY_START) * HOUR_HEIGHT;
  const height = Math.max(duration * HOUR_HEIGHT, 30);
  const widthPct = 100 / columnCount;

  return (
    <div
      ref={onRegisterNode}
      className={cn(
        "absolute flex flex-col overflow-hidden rounded-xl border p-1.5 transition-shadow",
        task.done ? "bg-[color:var(--accent-brand-soft)]" : "bg-card",
        highlighted ? "border-primary" : "border-border",
        isDragging ? "z-5 opacity-85 shadow-lg" : "z-2 shadow-xs",
      )}
      style={{
        top,
        height,
        left: `${column * widthPct}%`,
        width: `calc(${widthPct}% - 6px)`,
      }}
    >
      <div className="flex items-start gap-1.5">
        <button
          type="button"
          onPointerDown={beginMove}
          aria-label={t("calendar.dragHandle")}
          className="mt-0.5 shrink-0 touch-none text-muted-foreground"
        >
          <GripVertical className="size-3.5" aria-hidden />
        </button>
        <span className="shrink-0 text-sm" aria-hidden>
          {task.emoji}
        </span>
        <button
          type="button"
          onClick={onToggleDone}
          aria-label={t(task.done ? "task.markNotDone" : "task.markDone")}
          className={cn(
            "flex size-[18px] shrink-0 items-center justify-center rounded-full border-2 p-0 text-white",
            task.done
              ? "border-primary bg-primary"
              : "border-border bg-transparent",
          )}
        >
          {task.done && <Check className="size-2.5" aria-hidden />}
        </button>
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              "truncate text-[12.5px] font-semibold",
              task.done
                ? "text-muted-foreground line-through"
                : "text-foreground",
            )}
          >
            {task.title}
          </div>
          <div className="text-[10.5px] text-muted-foreground">
            {hourToTime(hour)}–{hourToTime(hour + duration)}
          </div>
        </div>
        <button
          type="button"
          onClick={onEdit}
          aria-label={t("task.edit")}
          className="shrink-0 text-muted-foreground"
        >
          <Pencil className="size-3" aria-hidden />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label={t("task.delete")}
          className="shrink-0 text-muted-foreground"
        >
          <Trash2 className="size-3" aria-hidden />
        </button>
      </div>
      <button
        type="button"
        onPointerDown={beginResize}
        aria-label={t("calendar.resizeHandle")}
        className="mt-auto h-1 w-7 shrink-0 touch-none self-center rounded-full bg-border"
      />
    </div>
  );
};
