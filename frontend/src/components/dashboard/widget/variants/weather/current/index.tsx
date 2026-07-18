import { getWeatherIcon } from "../helpers";
import type { WeatherCurrentProps } from "./types";

export const WeatherCurrent = ({ condition }: WeatherCurrentProps) => {
  const Icon = getWeatherIcon(condition.weatherCode);

  return (
    <div className="flex items-center gap-2">
      <Icon className="size-8 text-accent-brand" aria-hidden />
      <span className="font-display text-2xl font-medium text-foreground">
        {Math.round(condition.temperature)}°
      </span>
    </div>
  );
};
