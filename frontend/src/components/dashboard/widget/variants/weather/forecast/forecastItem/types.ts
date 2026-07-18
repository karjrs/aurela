import type { HourlyWeatherCondition } from "@widget/weather/types";

export type ForecastItemProps = {
  hour: HourlyWeatherCondition;
  time: string;
};
