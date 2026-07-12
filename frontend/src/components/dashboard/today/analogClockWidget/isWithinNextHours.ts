export const isWithinNextHours = (
  taskHour: number,
  currentHour: number,
  windowHours: number,
): boolean => {
  const delta = (((taskHour - currentHour) % 24) + 24) % 24;
  return delta < windowHours;
};
