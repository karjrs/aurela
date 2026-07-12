"use client";

import { useTranslations } from "next-intl";
import { isWithinNextHours } from "./isWithinNextHours";
import { pointOnClock } from "./pointOnClock";
import type { AnalogClockWidgetProps } from "./types";

const CENTER = 50;
const FACE_RADIUS = 44;
const TICK_LENGTH = 4;
const HOUR_HAND_LENGTH = 22;
const MINUTE_HAND_LENGTH = 34;
const TASK_DOT_RADIUS = FACE_RADIUS;
const TASK_DOT_SIZE = 3;
const HOUR_MARK_COUNT = 12;
const NEXT_HOURS_WINDOW = 12;

export const AnalogClockWidget = ({ now, tasks }: AnalogClockWidgetProps) => {
  const t = useTranslations("dashboard.today");

  const currentHour = now.getHours() + now.getMinutes() / 60;
  const hourHandPoint = pointOnClock(
    (currentHour % 12) / 12,
    HOUR_HAND_LENGTH,
    CENTER,
  );
  const minuteHandPoint = pointOnClock(
    now.getMinutes() / 60,
    MINUTE_HAND_LENGTH,
    CENTER,
  );

  const upcomingTasks = tasks.filter((task) =>
    isWithinNextHours(task.hour, currentHour, NEXT_HOURS_WINDOW),
  );

  return (
    <section
      aria-label={t("clock.heading")}
      className="flex aspect-square flex-1 items-center justify-center rounded-3xl border border-border bg-card p-4 shadow-sm"
    >
      <svg viewBox="0 0 100 100" aria-hidden className="size-full">
        <circle
          cx={CENTER}
          cy={CENTER}
          r={FACE_RADIUS}
          fill="none"
          strokeWidth="2"
          className="stroke-muted-foreground/20"
        />

        {Array.from({ length: HOUR_MARK_COUNT }, (_, i) => {
          const fraction = i / HOUR_MARK_COUNT;
          const inner = pointOnClock(
            fraction,
            FACE_RADIUS - TICK_LENGTH,
            CENTER,
          );
          const outer = pointOnClock(fraction, FACE_RADIUS, CENTER);
          return (
            <line
              key={fraction}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              strokeWidth="1.5"
              strokeLinecap="round"
              className="stroke-muted-foreground/40"
            />
          );
        })}

        {upcomingTasks.map((task) => {
          const point = pointOnClock(
            (task.hour % 12) / 12,
            TASK_DOT_RADIUS,
            CENTER,
          );
          return (
            <circle
              key={task.id}
              data-testid="clock-task-dot"
              cx={point.x}
              cy={point.y}
              r={TASK_DOT_SIZE}
              style={{
                fill: task.done
                  ? "var(--color-coral-500)"
                  : "var(--accent-brand)",
              }}
            />
          );
        })}

        <line
          x1={CENTER}
          y1={CENTER}
          x2={hourHandPoint.x}
          y2={hourHandPoint.y}
          strokeWidth="3.5"
          strokeLinecap="round"
          className="stroke-foreground"
        />
        <line
          x1={CENTER}
          y1={CENTER}
          x2={minuteHandPoint.x}
          y2={minuteHandPoint.y}
          strokeWidth="2.5"
          strokeLinecap="round"
          className="stroke-foreground"
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r="2.5"
          className="fill-[color:var(--accent-brand)]"
        />
      </svg>
    </section>
  );
};
