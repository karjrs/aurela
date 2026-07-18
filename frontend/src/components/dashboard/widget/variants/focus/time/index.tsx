import type { FocusTimeProps } from "./types";

export const FocusTime = ({ time, label }: FocusTimeProps) => (
  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
    <span className="font-display text-lg font-medium text-foreground">
      {time}
    </span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);
