export const timeToHour = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h + m / 60;
};

export const hourToTime = (hour: number) => {
  const normalized = ((hour % 24) + 24) % 24;
  const h = Math.floor(normalized);
  const m = Math.round((normalized - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const snapToQuarterHour = (hour: number) => Math.round(hour * 4) / 4;

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const splitDuration = (durationHours: number) => {
  const hours = Math.floor(durationHours);
  const minutes = Math.round((durationHours - hours) * 60);
  return { hours, minutes };
};
