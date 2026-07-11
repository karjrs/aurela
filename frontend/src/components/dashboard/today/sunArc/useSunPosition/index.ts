"use client";

import { computeSunTimes, type SunTimes } from "@utils/dateTime/astronomy";
import { useEffect, useState } from "react";

// Warsaw — fallback used until (or unless) geolocation is granted.
const DEFAULT_LAT = 52.2297;
const DEFAULT_LON = 21.0122;

export const useSunPosition = () => {
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
