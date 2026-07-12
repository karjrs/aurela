export type Point = { x: number; y: number };

export const pointOnClock = (
  fraction: number,
  radius: number,
  center: number,
): Point => {
  const angle = fraction * 2 * Math.PI;
  return {
    x: center + radius * Math.sin(angle),
    y: center - radius * Math.cos(angle),
  };
};
