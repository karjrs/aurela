"use client";

import { Button } from "@components/common/ui/button";
import { cn } from "@root/utils/helpers/cn";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useTranslations } from "next-intl";
import { CLASSNAME } from "./consts";
import type { FocusControlsProps } from "./types";

export const FocusControls = ({
  isRunning,
  onToggle,
  onReset,
  onSkip,
}: FocusControlsProps) => {
  const t = useTranslations("dashboard.focus");

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onSkip}
        aria-label={t("skip")}
        className={cn(CLASSNAME, "bottom-4 right-4")}
      >
        <SkipForward aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onReset}
        aria-label={t("reset")}
        className={cn(CLASSNAME, "top-4 right-4")}
      >
        <RotateCcw aria-hidden />
      </Button>
      <Button
        type="button"
        size="icon-sm"
        variant="outline"
        onClick={onToggle}
        aria-label={t(isRunning ? "pause" : "start")}
        className={cn(CLASSNAME, "bottom-4 left-4")}
      >
        {isRunning ? <Pause /> : <Play />}
      </Button>
    </>
  );
};
