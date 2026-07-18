import { hourOfDay } from "@root/utils/dateTime";
import { GREETINGS_COUNT } from "./consts";

export const getPeriod = (hour: number) => {
  if (hour < 5 || hour >= 22) return "night";
  if (hour < 11) return "morning";
  if (hour < 14) return "noon";
  if (hour < 18) return "afternoon";
  return "evening";
};

export const getGreetingKey = (date: Date) => {
  const period = getPeriod(hourOfDay(date));
  const index = Math.floor(Math.random() * GREETINGS_COUNT);
  return [period, index].join(".");
};
