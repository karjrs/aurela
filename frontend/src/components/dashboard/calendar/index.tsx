"use client";

import { DashboardCalendarView } from "@components/dashboard/calendar/calendarView";
import { INITIAL_TASKS } from "@components/dashboard/consts";
import { useDashboardTasks } from "@hooks/dashboard/useDashboardTasks";
import { useNow } from "@hooks/dashboard/useNow";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { DashboardFab } from "../fab";

export const DashboardCalendar = () => {
  const t = useTranslations("dashboard.calendar");
  const { tasks, updateTask, toggleTaskDone, removeTask } =
    useDashboardTasks(INITIAL_TASKS);
  const now = useNow();

  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => a.hour.getTime() - b.hour.getTime()),
    [tasks],
  );

  if (!now) return null;

  const currentHour = now.getHours() + now.getMinutes() / 60;

  return (
    <div className="mx-auto flex w-full flex-col gap-6 py-6 max-w-page">
      <h1 className="font-display text-lg font-semibold text-foreground">
        {t("heading")}
      </h1>

      <DashboardFab onClick={() => {}} />

      <DashboardCalendarView
        tasks={sortedTasks}
        currentHour={currentHour}
        onToggleDone={toggleTaskDone}
        onEdit={() => {}}
        onRemove={removeTask}
        onUpdateTiming={(id, patch) => updateTask(id, patch)}
      />
    </div>
  );
};
