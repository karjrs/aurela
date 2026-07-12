"use client";

import { clamp01, hourToTime } from "@utils/dateTime";
import { Sunrise, Sunset } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { ARC_STEPS } from "../consts";
import type { SunArcProps } from "./types";
import { useSunPosition } from "./useSunPosition";

const WIDTH = 320;
const HEIGHT = 176;
const CENTER_X = 160;
const CENTER_Y = 158;
const RADIUS = 128;

type Point = { x: number; y: number };

const pointOnArc = (t: number): Point => {
  const angle = Math.PI * (1 - t);
  return {
    x: CENTER_X + RADIUS * Math.cos(angle),
    y: CENTER_Y - RADIUS * Math.sin(angle),
  };
};

const toPath = (points: Point[]) =>
  points.map((point) => `${point.x},${point.y}`).join(" ");

export const SunArc = ({
  tasks,
  currentHour,
  highlightId,
  onSelectTask,
}: SunArcProps) => {
  const t = useTranslations("dashboard.today");
  const sun = useSunPosition();

  const arcPoints = useMemo(() => {
    const points: Point[] = [];
    for (let i = 0; i <= ARC_STEPS; i++) points.push(pointOnArc(i / ARC_STEPS));
    return points;
  }, []);

  if (!sun) {
    return (
      <div
        aria-hidden
        className="h-[220px] w-full animate-pulse rounded-3xl border border-border bg-muted"
      />
    );
  }

  const sliceByT = (from: number, to: number) =>
    arcPoints.filter((_, i) => {
      const t = i / ARC_STEPS;
      return t >= from - 1e-6 && t <= to + 1e-6;
    });

  const sunriseT = clamp01(sun.sunrise / 24);
  const sunsetT = clamp01(sun.sunset / 24);
  const currentT = clamp01(currentHour / 24);
  const isNight = currentHour < sun.sunrise || currentHour > sun.sunset;

  const nightBefore = sliceByT(0, sunriseT);
  const daySeg = sliceByT(sunriseT, sunsetT);
  const nightAfter = sliceByT(sunsetT, 1);
  const elapsed = sliceByT(0, currentT);
  const sunPos = pointOnArc(currentT);

  return (
    <div
      className="rounded-3xl border border-border p-4 shadow-sm"
      style={{
        backgroundImage:
          "linear-gradient(180deg, var(--sky-top) 0%, var(--sky-bottom) 100%)",
      }}
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="block w-full"
        role="img"
        aria-label={t("heading")}
      >
        <defs>
          <linearGradient
            id="dashboard-day-arc"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" style={{ stopColor: "var(--color-coral-500)" }} />
            <stop
              offset="50%"
              style={{ stopColor: "var(--color-amber-400)" }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "var(--color-coral-500)" }}
            />
          </linearGradient>
          <radialGradient id="dashboard-sun-glow">
            <stop
              offset="0%"
              style={{ stopColor: "var(--color-amber-400)", stopOpacity: 0.35 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "var(--color-amber-400)", stopOpacity: 0 }}
            />
          </radialGradient>
          <linearGradient
            id="dashboard-sun-fill"
            x1="0%"
            y1="100%"
            x2="0%"
            y2="0%"
          >
            <stop offset="0%" style={{ stopColor: "var(--color-amber-400)" }} />
            <stop
              offset="100%"
              style={{ stopColor: "var(--color-coral-500)" }}
            />
          </linearGradient>
          <radialGradient id="dashboard-moon-glow">
            <stop
              offset="0%"
              style={{ stopColor: "var(--color-navy-300)", stopOpacity: 0.35 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "var(--color-navy-300)", stopOpacity: 0 }}
            />
          </radialGradient>
          <linearGradient
            id="dashboard-moon-fill"
            x1="0%"
            y1="100%"
            x2="0%"
            y2="0%"
          >
            <stop offset="0%" style={{ stopColor: "var(--color-navy-400)" }} />
            <stop
              offset="100%"
              style={{ stopColor: "var(--color-navy-200)" }}
            />
          </linearGradient>
        </defs>

        <line
          x1={CENTER_X - RADIUS}
          y1={CENTER_Y}
          x2={CENTER_X + RADIUS}
          y2={CENTER_Y}
          style={{ stroke: "var(--horizon)" }}
          strokeWidth="1.5"
        />

        <polyline
          points={toPath(nightBefore)}
          fill="none"
          style={{ stroke: "var(--night-arc)" }}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
        <polyline
          points={toPath(nightAfter)}
          fill="none"
          style={{ stroke: "var(--night-arc)" }}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
        <polyline
          points={toPath(daySeg)}
          fill="none"
          stroke="url(#dashboard-day-arc)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        <polyline
          points={toPath(elapsed)}
          fill="none"
          style={{ stroke: "var(--color-coral-500)" }}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.35"
        />

        {tasks.map((task) => {
          const point = pointOnArc(clamp01(task.hour / 24));
          const isHighlighted = highlightId === task.id;
          const radius = isHighlighted ? 10 : 8;

          return (
            // biome-ignore lint/a11y/useSemanticElements: <button> isn't valid inside <svg>; this SVG <g> is the interactive marker itself
            <g
              key={task.id}
              className="cursor-pointer outline-none"
              tabIndex={0}
              role="button"
              aria-label={t("arc.taskAt", {
                title: task.title,
                time: hourToTime(task.hour),
              })}
              onClick={() => onSelectTask(task.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectTask(task.id);
                }
              }}
            >
              <circle
                cx={point.x}
                cy={point.y}
                r={radius}
                style={{
                  fill: task.done
                    ? "var(--color-coral-500)"
                    : "var(--bg-elevated)",
                  stroke: task.done
                    ? "var(--color-coral-500)"
                    : "var(--accent-brand)",
                }}
                strokeWidth="1.5"
              />
              <text
                x={point.x}
                y={point.y}
                fontSize="8"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {task.emoji}
              </text>
            </g>
          );
        })}

        {isNight ? (
          <>
            <circle
              cx={sunPos.x}
              cy={sunPos.y}
              r="24"
              fill="url(#dashboard-moon-glow)"
            />
            <circle
              cx={sunPos.x}
              cy={sunPos.y}
              r="9"
              fill="url(#dashboard-moon-fill)"
            />
          </>
        ) : (
          <>
            <circle
              cx={sunPos.x}
              cy={sunPos.y}
              r="26"
              fill="url(#dashboard-sun-glow)"
            />
            <circle
              cx={sunPos.x}
              cy={sunPos.y}
              r="9"
              fill="url(#dashboard-sun-fill)"
            />
          </>
        )}
      </svg>

      <div className="mt-1 flex items-center justify-between px-1.5">
        <div className="flex items-center gap-1.5">
          <Sunrise className="size-3.5 text-primary" aria-hidden />
          <span className="text-xs font-semibold text-muted-foreground">
            {hourToTime(sun.sunrise)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sunset
            className="size-3.5 text-[color:var(--accent-brand)]"
            aria-hidden
          />
          <span className="text-xs font-semibold text-muted-foreground">
            {hourToTime(sun.sunset)}
          </span>
        </div>
      </div>
    </div>
  );
};
