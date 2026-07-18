import type { ArcSunProps } from "./types";

export const ArcSun = ({ x, y }: ArcSunProps) => (
  <>
    <circle cx={x} cy={y} r="14" fill="url(#dashboard-sun-glow)" />
    <circle cx={x} cy={y} r="6" className="fill-amber-400" />
  </>
);
