import type { HourlyWeatherCondition } from "../types";

export type WeatherForecastProps = {
  hours: HourlyWeatherCondition[];
  label: string;
};
