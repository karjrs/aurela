import type { TaskFormValues } from "./types";

export const EMOJI_PRESETS = [
  "☕",
  "📋",
  "🎯",
  "🚶",
  "🍽️",
  "🛠️",
  "📞",
  "🎨",
  "🧘",
  "😴",
  "📚",
  "💪",
];

export const DURATION_OPTIONS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4];

export const DEFAULT_VALUES: TaskFormValues = {
  title: "",
  hour: 9,
  duration: 0.5,
  emoji: EMOJI_PRESETS[0],
};

// Duplicated from the in-progress utils/dateTime — replace with hourToTime/timeToHour on integration.
export const hourToTimeString = (hour: number) => {
  const wholeHours = Math.floor(hour);
  const minutes = Math.round((hour - wholeHours) * 60);
  return `${String(wholeHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

export const timeStringToHour = (value: string) => {
  const [hours, minutes] = value.split(":").map(Number);
  return hours + minutes / 60;
};
