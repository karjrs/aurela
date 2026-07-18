"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  DEFAULT_LAT,
  DEFAULT_LON,
  NOMINATIM_URL,
  OPEN_METEO_URL,
} from "./consts";
import { parseWeatherResponse } from "./helpers";
import type { UserLocationState, WeatherData } from "./types";

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

const reverseGeocode = async (
  latitude: number,
  longitude: number,
): Promise<string | null> => {
  const url = `${NOMINATIM_URL}?format=json&lat=${latitude}&lon=${longitude}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) return null;

  const data = await response.json();
  const city =
    data.address?.city ?? data.address?.town ?? data.address?.village;
  const country = data.address?.country;

  if (!city || !country) return null;

  return `${city}, ${country}`;
};

export const useUserLocation = (): UserLocationState => {
  const [state, setState] = useState<UserLocationState>({
    status: "loading",
  });

  useEffect(() => {
    let cancelled = false;

    if (!navigator.geolocation) {
      setState({ status: "error" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        reverseGeocode(position.coords.latitude, position.coords.longitude)
          .then((label) => {
            if (cancelled) return;
            setState(
              label ? { status: "success", label } : { status: "error" },
            );
          })
          .catch(() => {
            if (!cancelled) setState({ status: "error" });
          });
      },
      () => {
        if (!cancelled) setState({ status: "error" });
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
};
