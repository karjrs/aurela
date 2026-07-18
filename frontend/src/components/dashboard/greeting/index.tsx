"use client";

import { formatFullDate } from "@utils/dateTime";
import { cn } from "@utils/helpers/cn";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getGreetingKey } from "./helpers";
import type { DashboardGreetingProps } from "./types";

export const DashboardGreeting = ({ date, name }: DashboardGreetingProps) => {
  const t = useTranslations("dashboard.greeting");
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  const [key] = useState(() => getGreetingKey(date));

  useEffect(() => setVisible(true), []);

  return (
    <div
      className={cn(
        "flex flex-col transition-opacity duration-500 ease-in",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <p className="font-display text-2xl font-medium text-foreground">
        {t(key, { name })}
      </p>
      <p className="mt-0.5 text-sm text-muted-foreground">
        {formatFullDate(date, locale)}
      </p>
    </div>
  );
};
