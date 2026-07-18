import type { Point } from "../types";

export const toPath = (points: Point[]) =>
  points.map((point) => `${point.x},${point.y}`).join(" ");
