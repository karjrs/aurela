"use client";

import { Widget } from "@components/dashboard/widget";
import { useTranslations } from "next-intl";
import { WeatherCurrent } from "./current";
import { WeatherForecast } from "./forecast";
import { WeatherHeader } from "./header";
import { useUserLocation, useWeather } from "./hooks";
import { WeatherStatus } from "./status";

export const Weather = () => {
  const t = useTranslations("dashboard");
  const location = useUserLocation();
  const { data, status, isFetching, refetch } = useWeather();

  return (
    <Widget className="flex flex-col gap-3 bg-transparent col-start-7 row-start-2 col-span-4">
      <WeatherHeader
        location={location}
        isFetching={isFetching}
        onRefresh={() => refetch()}
      />

      {status === "success" && data ? (
        <>
          <WeatherCurrent condition={data.current} />
          <WeatherForecast
            hours={data.hourly}
            label={t("weather.forecastLabel")}
          />
        </>
      ) : (
        <WeatherStatus status={status} />
      )}
    </Widget>
  );
};
