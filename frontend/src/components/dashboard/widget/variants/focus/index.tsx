"use client";

import { Widget } from "@components/dashboard/widget";
import { useTranslations } from "next-intl";
import { FocusControls } from "./controls";
import { durationFor, formatTime } from "./helpers";
import { useFocus } from "./hooks";
import { FocusProgress } from "./progress";
import { FocusTime } from "./time";

export const Focus = () => {
  const t = useTranslations("dashboard.focus");
  const { phase, secondsRemaining, isRunning, toggle, reset, skipPhase } =
    useFocus();

  const value = secondsRemaining / durationFor(phase);

  return (
    <Widget className="relative col-start-9 col-span-2 row-start-4 h-32">
      <FocusProgress value={value} />
      <FocusTime time={formatTime(secondsRemaining)} label={t(phase)} />
      <FocusControls
        isRunning={isRunning}
        onToggle={toggle}
        onReset={reset}
        onSkip={skipPhase}
      />
    </Widget>
  );
};
