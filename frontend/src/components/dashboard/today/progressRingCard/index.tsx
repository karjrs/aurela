import type { ProgressRingCardProps } from "./types";

const RADIUS = 42;
const STROKE_WIDTH = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const ProgressRingCard = ({
  total,
  completed,
  label,
}: ProgressRingCardProps) => {
  const progress = total === 0 ? 0 : completed / total;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="relative aspect-square flex-1 rounded-3xl border border-border bg-card p-4 shadow-sm">
      <svg
        className="size-full -rotate-90"
        viewBox="0 0 100 100"
        role="img"
        aria-label={`${total} ${label}`}
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
          className="stroke-[color:var(--accent-brand)] transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-medium text-foreground">
          {total}
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
};
