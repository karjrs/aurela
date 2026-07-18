import { toPath } from "./helpers";
import type { ArcPathProps } from "./types";

export const ArcPath = ({ nightBefore, nightAfter, daySeg }: ArcPathProps) => (
  <>
    <polyline
      points={toPath(nightBefore)}
      fill="none"
      className="stroke-night-arc"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.8"
    />
    <polyline
      points={toPath(nightAfter)}
      fill="none"
      className="stroke-night-arc"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.8"
    />
    <polyline
      points={toPath(daySeg)}
      fill="none"
      stroke="url(#dashboard-day-arc)"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.9"
    />
  </>
);
