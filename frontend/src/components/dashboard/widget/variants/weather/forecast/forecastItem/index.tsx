import { getWeatherIcon } from "@widget/weather/helpers";
import type { ForecastItemProps } from "./types";

export const ForecastItem = ({ hour, time }: ForecastItemProps) => {
  const Icon = getWeatherIcon(hour.weatherCode);

  return (
    <li className="flex w-20 shrink-0 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-center">
      <span className="text-xs text-muted-foreground">{time}</span>
      <Icon className="size-5 text-muted-foreground" aria-hidden />
      <span className="text-xs font-medium text-foreground">
        {Math.round(hour.temperature)}°
      </span>
      {hour.precipitationProbability > 0 && (
        <span className="text-[10px] text-muted-foreground">
          {Math.round(hour.precipitationProbability)}% •{" "}
          {hour.precipitation.toFixed(1)}mm
        </span>
      )}
    </li>
  );
};
