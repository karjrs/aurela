"use client";

import type { SleepData } from "./types";

const MOCK_SLEPT_HOURS = 6.75;
const MOCK_MAX_HOURS = 8;

export const useSleep = (): SleepData => ({
  sleptHours: MOCK_SLEPT_HOURS,
  maxHours: MOCK_MAX_HOURS,
});
