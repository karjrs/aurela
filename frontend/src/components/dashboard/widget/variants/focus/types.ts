export type FocusPhase = "work" | "break";

export type FocusState = {
  phase: FocusPhase;
  secondsRemaining: number;
  isRunning: boolean;
  toggle: () => void;
  reset: () => void;
  skipPhase: () => void;
};
