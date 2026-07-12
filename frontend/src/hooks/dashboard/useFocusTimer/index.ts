"use client";

import { useEffect, useState } from "react";
import { playChime } from "./playChime";
import type { FocusPhase, FocusTimerState } from "./types";

export const WORK_DURATION_SECONDS = 25 * 60;
export const BREAK_DURATION_SECONDS = 5 * 60;

const durationFor = (phase: FocusPhase) =>
  phase === "work" ? WORK_DURATION_SECONDS : BREAK_DURATION_SECONDS;

export const useFocusTimer = (): FocusTimerState => {
  const [phase, setPhase] = useState<FocusPhase>("work");
  const [secondsRemaining, setSecondsRemaining] = useState(
    WORK_DURATION_SECONDS,
  );
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setSecondsRemaining((current) => {
        if (current > 1) return current - 1;

        playChime();
        setPhase((currentPhase) =>
          currentPhase === "work" ? "break" : "work",
        );
        setIsRunning(false);
        return 0;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    setSecondsRemaining(durationFor(phase));
  }, [phase]);

  const toggle = () => setIsRunning((current) => !current);

  const reset = () => {
    setIsRunning(false);
    setSecondsRemaining(durationFor(phase));
  };

  const skipPhase = () => {
    setPhase((currentPhase) => (currentPhase === "work" ? "break" : "work"));
  };

  return { phase, secondsRemaining, isRunning, toggle, reset, skipPhase };
};
