"use client";

import { hourOfDay } from "@utils/dateTime";
import { useEffect, useMemo, useState } from "react";
import { ARC_STEPS, DEFAULT_LAT, DEFAULT_LON } from "./consts";
import { computeSunTimes, isNightTime, pointOnArc, sliceByT } from "./helpers";
import type { ArcData, Point, SunTimes } from "./types";

const useSunPosition = () => {
  const [sun, setSun] = useState<SunTimes | null>(null);

  useEffect(() => {
    setSun(computeSunTimes(new Date(), DEFAULT_LAT, DEFAULT_LON));

    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (position) =>
        setSun(
          computeSunTimes(
            new Date(),
            position.coords.latitude,
            position.coords.longitude,
          ),
        ),
      () => {},
      { timeout: 6000 },
    );
  }, []);

  return sun;
};

export const useArc = (now: Date): ArcData | null => {
  const sun = useSunPosition();

  const arcPoints = useMemo(() => {
    const points: Point[] = [];
    for (let i = 0; i <= ARC_STEPS; i++) points.push(pointOnArc(i / ARC_STEPS));
    return points;
  }, []);

  if (!sun) return null;

  const sunriseT = hourOfDay(sun.sunrise) / 24;
  const sunsetT = hourOfDay(sun.sunset) / 24;
  const currentT = hourOfDay(now) / 24;

  return {
    nightBefore: sliceByT(arcPoints, ARC_STEPS, 0, sunriseT),
    daySeg: sliceByT(arcPoints, ARC_STEPS, sunriseT, sunsetT),
    nightAfter: sliceByT(arcPoints, ARC_STEPS, sunsetT, 1),
    sunPos: pointOnArc(currentT),
    isNight: isNightTime(now, sun.sunrise, sun.sunset),
    sun,
  };
};
