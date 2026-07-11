import type { Task } from "./types";

export const DAY_START = 6;
export const DAY_END = 22;
export const HOUR_HEIGHT = 60;
export const MIN_DURATION = 0.25;
export const ARC_STEPS = 96;

export const DURATION_OPTIONS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4];

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

export const INITIAL_TASKS: Task[] = [
  {
    id: "seed-1",
    title: "Coffee and a moment to yourself",
    hour: 7,
    duration: 0.5,
    done: true,
    emoji: "☕",
  },
  {
    id: "seed-2",
    title: "Review priorities",
    hour: 8.5,
    duration: 0.5,
    done: true,
    emoji: "🎯",
  },
  {
    id: "seed-3",
    title: "Design workshop",
    hour: 10,
    duration: 3,
    done: false,
    emoji: "🎨",
  },
  {
    id: "seed-4",
    title: "Walk during the break",
    hour: 13,
    duration: 0.5,
    done: false,
    emoji: "🚶",
  },
  {
    id: "seed-5",
    title: "Client call",
    hour: 15.5,
    duration: 1,
    done: false,
    emoji: "📞",
  },
  {
    id: "seed-6",
    title: "Dinner with family",
    hour: 19,
    duration: 1.5,
    done: false,
    emoji: "🍽️",
  },
];
