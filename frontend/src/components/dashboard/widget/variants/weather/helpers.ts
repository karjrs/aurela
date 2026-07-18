import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  type LucideIcon,
  Sun,
} from "lucide-react";
import { HOURLY_FORECAST_COUNT } from "./consts";
import type {
  HourlyWeatherCondition,
  WeatherCondition,
  WeatherData,
} from "./types";

export const formatHour = (iso: string, locale: string) =>
  new Date(iso).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

const WEATHER_ICON_BY_CODE: Record<number, LucideIcon> = {
  0: Sun,
  1: CloudSun,
  2: CloudSun,
  3: Cloud,
  45: CloudFog,
  48: CloudFog,
  51: CloudDrizzle,
  53: CloudDrizzle,
  55: CloudDrizzle,
  56: CloudDrizzle,
  57: CloudDrizzle,
  61: CloudRain,
  63: CloudRain,
  65: CloudRain,
  66: CloudRain,
  67: CloudRain,
  71: CloudSnow,
  73: CloudSnow,
  75: CloudSnow,
  77: CloudSnow,
  80: CloudRain,
  81: CloudRain,
  82: CloudRain,
  85: CloudSnow,
  86: CloudSnow,
  95: CloudLightning,
  96: CloudLightning,
  99: CloudLightning,
};

export const getWeatherIcon = (weatherCode: number): LucideIcon =>
  WEATHER_ICON_BY_CODE[weatherCode] ?? Cloud;

type OpenMeteoResponse = {
  current: { time: string; temperature_2m: number; weather_code: number };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
    precipitation: number[];
  };
};

export const parseWeatherResponse = (
  raw: OpenMeteoResponse,
  now: Date = new Date(),
): WeatherData => {
  const current: WeatherCondition = {
    time: raw.current.time,
    temperature: raw.current.temperature_2m,
    weatherCode: raw.current.weather_code,
  };

  const startIndex = raw.hourly.time.findIndex(
    (time) => new Date(time).getTime() > now.getTime(),
  );
  const from = startIndex === -1 ? raw.hourly.time.length : startIndex;

  const hourly: HourlyWeatherCondition[] = raw.hourly.time
    .slice(from, from + HOURLY_FORECAST_COUNT)
    .map((time, i) => ({
      time,
      temperature: raw.hourly.temperature_2m[from + i],
      weatherCode: raw.hourly.weather_code[from + i],
      precipitationProbability: raw.hourly.precipitation_probability[from + i],
      precipitation: raw.hourly.precipitation[from + i],
    }));

  return { current, hourly };
};
