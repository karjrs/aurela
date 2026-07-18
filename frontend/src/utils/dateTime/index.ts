export const timeToHour = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h + m / 60;
};

const normalizeHour = (hour: number) => {
  const normalized = ((hour % 24) + 24) % 24;
  const h = Math.floor(normalized);
  const m = Math.round((normalized - h) * 60);
  return { h, m };
};

export const hourToTime = (hour: number) => {
  const { h, m } = normalizeHour(hour);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const snapToQuarterHour = (hour: number) => Math.round(hour * 4) / 4;

export const splitDuration = (durationHours: number) => {
  const hours = Math.floor(durationHours);
  const minutes = Math.round((durationHours - hours) * 60);
  return { hours, minutes };
};

export const hourOfDay = (date: Date): number =>
  date.getHours() + date.getMinutes() / 60;

export const atHour = (hour: number, reference: Date = new Date()): Date => {
  const { h, m } = normalizeHour(hour);
  const result = new Date(reference);
  result.setHours(h, m, 0, 0);
  return result;
};

export const addHours = (date: Date, hours: number): Date =>
  new Date(date.getTime() + hours * 3600_000);

export const formatClockTime = (date: Date, locale: string): string =>
  date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });

export const formatFullDate = (date: Date, locale: string): string =>
  date.toLocaleDateString(locale, { dateStyle: "full" });
