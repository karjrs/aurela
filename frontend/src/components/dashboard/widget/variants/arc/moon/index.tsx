import type { ArcMoonProps } from "./types";

export const ArcMoon = ({ x, y }: ArcMoonProps) => (
  <>
    <circle cx={x} cy={y} r="14" fill="url(#dashboard-moon-glow)" />
    <circle cx={x} cy={y} r="6" fill="url(#dashboard-moon-fill)" />
  </>
);
