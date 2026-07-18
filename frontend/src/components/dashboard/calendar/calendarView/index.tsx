"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { DAY_END, DAY_START, HOUR_HEIGHT } from "./consts";
import { layoutColumns } from "./layoutColumns";
import { DashboardCalendarViewTaskBlock } from "./taskBlock";
import type { DashboardCalendarViewProps } from "./types";

const SPAN = DAY_END - DAY_START;

export const DashboardCalendarView = ({
  tasks,
  currentHour,
  onToggleDone,
  onEdit,
  onRemove,
  onUpdateTiming,
}: DashboardCalendarViewProps) => {
  const t = useTranslations("dashboard.calendar");
  const gridHeight = SPAN * HOUR_HEIGHT;
  const { columnOf, columnCountOf } = useMemo(
    () => layoutColumns(tasks),
    [tasks],
  );
  const hours = useMemo(
    () => Array.from({ length: SPAN + 1 }, (_, i) => DAY_START + i),
    [],
  );

  return (
    <div>
      <p className="mb-2.5 text-xs text-muted-foreground">
        {t("dragHandle")} · {t("resizeHandle")}
      </p>
      <div className="flex">
        <div className="relative w-11 shrink-0" style={{ height: gridHeight }}>
          {hours.map((hour) => (
            <div
              key={hour}
              className="absolute left-0 text-[11px] text-muted-foreground"
              style={{ top: (hour - DAY_START) * HOUR_HEIGHT - 6 }}
            >
              {String(hour).padStart(2, "0")}:00
            </div>
          ))}
        </div>
        <div
          className="relative flex-1 border-l border-border"
          style={{ height: gridHeight }}
        >
          {hours.map((hour, i) => (
            <div
              key={hour}
              className="absolute right-0 left-0 border-t border-border opacity-60"
              style={{ top: i * HOUR_HEIGHT }}
            />
          ))}

          {currentHour >= DAY_START && currentHour <= DAY_END && (
            <div
              className="absolute right-0 left-0 z-3 flex items-center"
              style={{ top: (currentHour - DAY_START) * HOUR_HEIGHT }}
            >
              <div className="-ml-1 size-2 rounded-full bg-primary" />
              <div className="h-[1.5px] flex-1 bg-primary opacity-70" />
            </div>
          )}

          {tasks.map((task) => (
            <DashboardCalendarViewTaskBlock
              key={task.id}
              task={task}
              column={columnOf[task.id] ?? 0}
              columnCount={columnCountOf[task.id] ?? 1}
              onToggleDone={() => onToggleDone(task.id)}
              onEdit={() => onEdit(task)}
              onRemove={() => onRemove(task.id)}
              onUpdateTiming={(patch) => onUpdateTiming(task.id, patch)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
