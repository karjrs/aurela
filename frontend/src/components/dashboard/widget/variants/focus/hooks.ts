"use client";

import { useEffect, useState } from "react";
import { durationFor } from "./helpers";
import type { FocusPhase, FocusState } from "./types";

export const useFocus = (): FocusState => {
  const [phase, setPhase] = useState<FocusPhase>("work");
  const [secondsRemaining, setSecondsRemaining] = useState(durationFor("work"));
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setSecondsRemaining((current) => {
        if (current > 1) return current - 1;

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
    setIsRunning(false);
    setPhase((currentPhase) => (currentPhase === "work" ? "break" : "work"));
  };

  return { phase, secondsRemaining, isRunning, toggle, reset, skipPhase };
};
