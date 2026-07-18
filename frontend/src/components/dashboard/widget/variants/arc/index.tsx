"use client";

import { Widget } from "@components/dashboard/widget";
import { useTranslations } from "next-intl";
import { HEIGHT, WIDTH } from "./consts";
import { ArcDayBounds } from "./dayBounds";
import { ArcGradients } from "./gradients";
import { useArc } from "./hooks";
import { ArcMarker } from "./marker";
import { ArcMoon } from "./moon";
import { ArcPath } from "./path";
import { ArcSun } from "./sun";
import type { ArcProps } from "./types";

export const Arc = ({ tasks, now, onSelectTask }: ArcProps) => {
  const t = useTranslations("dashboard");
  const arc = useArc(now);

  if (!arc) return null;

  const { nightBefore, nightAfter, daySeg, isNight, sunPos, sun } = arc;

  return (
    <Widget className="gap-0 self-stretch bg-widget col-start-1 col-span-6 row-start-2 row-span-3">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="block w-full flex-1"
        role="img"
        aria-label={t("heading")}
      >
        <ArcGradients />

        <ArcPath
          nightBefore={nightBefore}
          nightAfter={nightAfter}
          daySeg={daySeg}
        />

        {isNight ? <ArcMoon {...sunPos} /> : <ArcSun {...sunPos} />}

        {tasks.map((task) => (
          <ArcMarker key={task.id} task={task} onSelect={onSelectTask} />
        ))}
      </svg>

      <ArcDayBounds {...sun} />
    </Widget>
  );
};
