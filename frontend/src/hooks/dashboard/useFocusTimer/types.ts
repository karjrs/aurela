export type FocusPhase = "work" | "break";

export type FocusTimerState = {
  phase: FocusPhase;
  secondsRemaining: number;
  isRunning: boolean;
  toggle: () => void;
  reset: () => void;
};
