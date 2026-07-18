import { BREAK_DURATION_SECONDS, WORK_DURATION_SECONDS } from "./consts";
import type { FocusPhase } from "./types";

export const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const durationFor = (phase: FocusPhase) =>
  phase === "work" ? WORK_DURATION_SECONDS : BREAK_DURATION_SECONDS;
