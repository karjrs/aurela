"use client";

import { formatClockTime } from "@utils/dateTime";
import { Sunrise, Sunset } from "lucide-react";
import { useLocale } from "next-intl";
import { ArcDayBoundsItem } from "./item";
import type { ArcDayBoundsProps } from "./types";

export const ArcDayBounds = ({ sunrise, sunset }: ArcDayBoundsProps) => {
  const locale = useLocale();

  return (
    <div className="mt-1 flex items-center justify-between px-1.5">
      <ArcDayBoundsItem time={formatClockTime(sunrise, locale)}>
        <Sunrise className="size-3.5 text-primary" aria-hidden />
      </ArcDayBoundsItem>
      <ArcDayBoundsItem time={formatClockTime(sunset, locale)}>
        <Sunset className="size-3.5 text-accent-brand" aria-hidden />
      </ArcDayBoundsItem>
    </div>
  );
};
