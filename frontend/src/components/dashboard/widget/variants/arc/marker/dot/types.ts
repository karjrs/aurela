import type { Point } from "@widget/arc/types";

export type ArcMarkerDotProps = Point & {
  radius: number;
  done: boolean;
  emoji: string;
};
