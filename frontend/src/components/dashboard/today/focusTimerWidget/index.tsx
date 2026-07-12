"use client";

import { Button } from "@components/common/ui/button";
import {
  BREAK_DURATION_SECONDS,
  useFocusTimer,
  WORK_DURATION_SECONDS,
} from "@hooks/dashboard/useFocusTimer";
import type { FocusPhase } from "@hooks/dashboard/useFocusTimer/types";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
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
  const { phase, secondsRemaining, isRunning, toggle, reset, skipPhase } =
    useFocusTimer();

  const progress = secondsRemaining / durationFor(phase);
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const phaseColorClass =
    phase === "work"
      ? "stroke-[color:var(--accent-brand)]"
      : "stroke-[color:var(--accent)]";
  const ToggleIcon = isRunning ? Pause : Play;

  return (
    <div className="flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-sm">
      <svg
        className="size-20 shrink-0 -rotate-90"
        viewBox="0 0 100 100"
        aria-hidden
      >
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

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div>
          <p className="font-display text-2xl font-medium text-foreground">
            {formatTime(secondsRemaining)}
          </p>
          <p className="text-xs text-muted-foreground">
            {t(phase === "work" ? "focusTimer.work" : "focusTimer.break")}
          </p>
        </div>

        <div className="flex gap-2">
          <Button type="button" size="sm" onClick={toggle}>
            <ToggleIcon className="size-3.5" aria-hidden />
            {t(isRunning ? "focusTimer.pause" : "focusTimer.start")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={skipPhase}
            aria-label={t("focusTimer.skip")}
          >
            <SkipForward className="size-3.5" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={reset}
            aria-label={t("focusTimer.reset")}
          >
            <RotateCcw className="size-3.5" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
};
