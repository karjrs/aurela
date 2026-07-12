"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { parseWeatherResponse } from "./parseWeatherResponse";
import type { WeatherData } from "./types";

// Warsaw — fallback used until (or unless) geolocation is granted.
const DEFAULT_LAT = 52.2297;
const DEFAULT_LON = 21.0122;

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

type Coords = { latitude: number; longitude: number };

const fetchWeather = async ({
  latitude,
  longitude,
}: Coords): Promise<WeatherData> => {
  const url = `${OPEN_METEO_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code,precipitation_probability,precipitation&timezone=auto`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch weather");
  return parseWeatherResponse(await response.json());
};

export const useWeather = () => {
  const [coords, setCoords] = useState<Coords>({
    latitude: DEFAULT_LAT,
    longitude: DEFAULT_LON,
  });

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) =>
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      () => {},
      { timeout: 6000 },
    );
  }, []);

  return useQuery({
    queryKey: ["dashboard-weather", coords.latitude, coords.longitude],
    queryFn: () => fetchWeather(coords),
    staleTime: 5 * 60 * 1000,
  });
};
