"use client";

import { formatClockTime, hourOfDay } from "@utils/dateTime";
import { useLocale, useTranslations } from "next-intl";
import { pointOnArc } from "../helpers";
import { ArcMarkerDot } from "./dot";
import type { ArcMarkerProps } from "./types";

export const ArcMarker = ({ task, onSelect }: ArcMarkerProps) => {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const point = pointOnArc(hourOfDay(task.hour) / 24);

  return (
    // biome-ignore lint/a11y/useSemanticElements: <button> isn't valid inside <svg>; this SVG <g> is the interactive marker itself
    <g
      className="cursor-pointer outline-none"
      tabIndex={0}
      role="button"
      aria-label={t("arc.taskAt", {
        title: task.title,
        time: formatClockTime(task.hour, locale),
      })}
      onClick={() => onSelect(task.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(task.id);
        }
      }}
    >
      <ArcMarkerDot {...point} radius={8} done={task.done} emoji={task.emoji} />
    </g>
  );
};
