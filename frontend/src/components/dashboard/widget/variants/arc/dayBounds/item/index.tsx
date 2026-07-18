import type { ArcDayBoundsItemProps } from "./types";

export const ArcDayBoundsItem = ({ children, time }: ArcDayBoundsItemProps) => (
  <div className="flex items-center gap-1.5">
    {children}
    <span className="text-xs font-semibold text-muted-foreground">{time}</span>
  </div>
);
