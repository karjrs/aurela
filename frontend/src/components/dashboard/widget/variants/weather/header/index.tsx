"use client";

import { cn } from "@utils/helpers/cn";
import { MapPin, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import type { WeatherHeaderProps } from "./types";

export const WeatherHeader = ({
  location,
  isFetching,
  onRefresh,
}: WeatherHeaderProps) => {
  const t = useTranslations("dashboard");

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
        <MapPin className="size-4 shrink-0" aria-hidden />
        <span className="truncate">
          {location.status === "success" ? location.label : t("location.error")}
        </span>
      </div>

      <button
        type="button"
        onClick={onRefresh}
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
  );
};
