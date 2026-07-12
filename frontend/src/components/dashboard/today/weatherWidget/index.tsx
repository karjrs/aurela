"use client";

import { useUserLocation } from "@hooks/dashboard/useUserLocation";
import { useWeather } from "@hooks/dashboard/useWeather";
import type { WeatherCondition } from "@hooks/dashboard/useWeather/types";
import { cn } from "@utils/helpers/cn";
import { getWeatherIcon } from "@utils/weather";
import { MapPin, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

const formatHour = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const CurrentWeather = ({ condition }: { condition: WeatherCondition }) => {
  const Icon = getWeatherIcon(condition.weatherCode);
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-8 text-[color:var(--accent-brand)]" aria-hidden />
      <span className="font-display text-2xl font-medium text-foreground">
        {Math.round(condition.temperature)}°
      </span>
    </div>
  );
};

const HourlyForecast = ({
  hours,
  label,
}: {
  hours: WeatherCondition[];
  label: string;
}) => (
  <ul className="flex gap-3 overflow-x-auto pb-1" aria-label={label}>
    {hours.map((hour) => {
      const Icon = getWeatherIcon(hour.weatherCode);
      return (
        <li
          key={hour.time}
          className="flex shrink-0 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-center"
        >
          <span className="text-xs text-muted-foreground">
            {formatHour(hour.time)}
          </span>
          <Icon className="size-5 text-muted-foreground" aria-hidden />
          <span className="text-xs font-medium text-foreground">
            {Math.round(hour.temperature)}°
          </span>
        </li>
      );
    })}
  </ul>
);

export const WeatherWidget = () => {
  const t = useTranslations("dashboard.today");
  const location = useUserLocation();
  const { data, status, isFetching, refetch } = useWeather();

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-border p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden />
          <span className="truncate">
            {location.status === "success"
              ? location.label
              : t("location.error")}
          </span>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          aria-label={t("weather.refresh")}
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-60"
        >
          <RefreshCw
            className={cn("size-4", isFetching && "animate-spin")}
            aria-hidden
          />
        </button>
      </div>

      {status === "pending" && (
        <div
          aria-hidden
          className="h-16 w-full animate-pulse rounded-2xl bg-muted"
        />
      )}

      {status === "error" && (
        <p className="text-sm text-muted-foreground">{t("weather.error")}</p>
      )}

      {status === "success" && data && (
        <>
          <CurrentWeather condition={data.current} />
          <HourlyForecast
            hours={data.hourly}
            label={t("weather.forecastLabel")}
          />
        </>
      )}
    </div>
  );
};
