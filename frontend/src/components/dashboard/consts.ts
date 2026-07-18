import { atHour } from "@utils/dateTime";
import type { Task } from "./types";

export const INITIAL_TASKS: Task[] = [
  {
    id: "seed-1",
    title: "Coffee and a moment to yourself",
    hour: atHour(7),
    duration: 0.5,
    done: true,
    emoji: "☕",
  },
  {
    id: "seed-2",
    title: "Review priorities",
    hour: atHour(8.5),
    duration: 0.5,
    done: true,
    emoji: "🎯",
  },
  {
    id: "seed-3",
    title: "Design workshop",
    hour: atHour(10),
    duration: 3,
    done: false,
    emoji: "🎨",
  },
  {
    id: "seed-4",
    title: "Walk during the break",
    hour: atHour(13),
    duration: 0.5,
    done: false,
    emoji: "🚶",
  },
  {
    id: "seed-5",
    title: "Client call",
    hour: atHour(15.5),
    duration: 1,
    done: false,
    emoji: "📞",
  },
  {
    id: "seed-6",
    title: "Dinner with family",
    hour: atHour(19),
    duration: 1.5,
    done: false,
    emoji: "🍽️",
  },
];
