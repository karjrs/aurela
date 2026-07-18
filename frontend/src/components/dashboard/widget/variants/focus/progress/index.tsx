import { CIRCUMFERENCE, RADIUS, STROKE_WIDTH } from "./consts";
import type { FocusProgressProps } from "./types";

export const FocusProgress = ({ value }: FocusProgressProps) => {
  const dashOffset = CIRCUMFERENCE * (1 - value);

  return (
    <svg
      className="mx-auto block h-24 w-auto -rotate-90"
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
        className="stroke-primary transition-[stroke-dashoffset] duration-500"
      />
    </svg>
  );
};
