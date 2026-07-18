import type { ArcMarkerDotProps } from "./types";

export const ArcMarkerDot = ({
  x,
  y,
  radius,
  done,
  emoji,
}: ArcMarkerDotProps) => (
  <>
    <circle
      cx={x}
      cy={y}
      r={radius}
      className={
        done
          ? "fill-coral-500 stroke-coral-500"
          : "fill-elevated stroke-accent-brand"
      }
      strokeWidth="1.5"
    />
    <text
      x={x}
      y={y}
      fontSize="8"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {emoji}
    </text>
  </>
);
