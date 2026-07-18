"use client";

import { useLocale } from "next-intl";
import { formatHour } from "../helpers";
import { ForecastItem } from "./forecastItem";
import type { WeatherForecastProps } from "./types";

export const WeatherForecast = ({ hours, label }: WeatherForecastProps) => {
  const locale = useLocale();

  return (
    <ul className="flex gap-3 overflow-x-auto pb-1" aria-label={label}>
      {hours.map((hour) => (
        <ForecastItem
          key={hour.time}
          hour={hour}
          time={formatHour(hour.time, locale)}
        />
      ))}
    </ul>
  );
};
