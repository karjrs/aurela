import type {
  HourlyWeatherCondition,
  WeatherCondition,
  WeatherData,
} from "./types";

export const HOURLY_FORECAST_COUNT = 8;

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
