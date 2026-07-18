"use client";

import { addHours, formatClockTime } from "@utils/dateTime";
import { cn } from "@utils/helpers/cn";
import { useLocale } from "next-intl";
import type { DashboardListItemDetailsProps } from "./types";

export const DashboardListItemDetails = ({
  task: { done, title, hour, duration },
}: DashboardListItemDetailsProps) => {
  const locale = useLocale();

  return (
    <div className="min-w-0 flex-1">
      <div
        className={cn(
          "truncate text-sm font-medium",
          done ? "text-muted-foreground line-through" : "text-foreground",
        )}
      >
        {title}
      </div>
      <div className="text-xs text-muted-foreground">
        {formatClockTime(hour, locale)}–
        {formatClockTime(addHours(hour, duration), locale)}
      </div>
    </div>
  );
};
