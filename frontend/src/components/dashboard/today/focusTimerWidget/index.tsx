"use client";

import {
  BREAK_DURATION_SECONDS,
  useFocusTimer,
  WORK_DURATION_SECONDS,
} from "@hooks/dashboard/useFocusTimer";
import type { FocusPhase } from "@hooks/dashboard/useFocusTimer/types";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

const RADIUS = 42;
const STROKE_WIDTH = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const durationFor = (phase: FocusPhase) =>
  phase === "work" ? WORK_DURATION_SECONDS : BREAK_DURATION_SECONDS;

export const FocusTimerWidget = () => {
  const t = useTranslations("dashboard.today");
  const { phase, secondsRemaining, isRunning, toggle, reset } = useFocusTimer();

  const progress = secondsRemaining / durationFor(phase);
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const phaseColorClass =
    phase === "work"
      ? "stroke-[color:var(--accent-brand)]"
      : "stroke-[color:var(--accent)]";

  return (
    <div className="relative aspect-square flex-1 rounded-3xl border border-border bg-card p-4 shadow-sm">
      <button
        type="button"
        onClick={toggle}
        aria-label={t(isRunning ? "focusTimer.pause" : "focusTimer.start")}
        className="absolute inset-4"
      >
        <svg className="size-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE_WIDTH}
            className="stroke-muted-foreground/20"
          />
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className={`${phaseColorClass} transition-[stroke-dashoffset] duration-500`}
          />
        </svg>
      </button>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-medium text-foreground">
          {formatTime(secondsRemaining)}
        </span>
        <span className="text-xs text-muted-foreground">
          {t(phase === "work" ? "focusTimer.work" : "focusTimer.break")}
        </span>
      </div>

      <button
        type="button"
        onClick={reset}
        aria-label={t("focusTimer.reset")}
        className="absolute top-2 right-2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted"
      >
        <RotateCcw className="size-3.5" aria-hidden />
      </button>
    </div>
  );
};
