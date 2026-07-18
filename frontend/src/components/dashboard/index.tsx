"use client";

import { useDashboardTasks } from "@hooks/dashboard/useDashboardTasks";
import { useNow } from "@hooks/dashboard/useNow";
import { Arc } from "@widget/arc";
import { Focus } from "@widget/focus";
import { Note } from "@widget/note";
import { TaskCount } from "@widget/task/count";
import { TaskList } from "@widget/task/list";
import { TaskNext } from "@widget/task/next";
import { Weather } from "@widget/weather";
import { useMemo, useRef } from "react";
import { INITIAL_TASKS } from "./consts";
import { DashboardFab } from "./fab";
import { DashboardGreeting } from "./greeting";

export const Dashboard = () => {
  const { tasks, toggleTaskDone, removeTask } =
    useDashboardTasks(INITIAL_TASKS);
  const now = useNow();

  const blockRefs = useRef<Record<string, HTMLElement | null>>({});

  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => a.hour.getTime() - b.hour.getTime()),
    [tasks],
  );

  const handleSelectTask = (id: string) => {
    blockRefs.current[id]?.focus({ preventScroll: true });
    blockRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  if (!now) return null;

  const currentHour = now.getHours() + now.getMinutes() / 60;

  return (
    <div className="mx-auto flex w-full flex-col gap-6 py-6 max-w-page">
      <DashboardGreeting date={now} name="Karol" />
      <div className="grid grid-cols-10 gap-4 md:items-start">
        <TaskNext
          tasks={sortedTasks}
          currentHour={currentHour}
          onToggleDone={toggleTaskDone}
          onEdit={() => {}}
          onRemove={removeTask}
        />
        <Arc tasks={sortedTasks} now={now} onSelectTask={handleSelectTask} />
        <TaskList
          tasks={sortedTasks}
          blockRefs={blockRefs}
          onToggleDone={toggleTaskDone}
          onEdit={() => {}}
          onRemove={removeTask}
        />
        <Weather />
        <TaskCount tasks={sortedTasks} />
        <Focus />
        <Note />
      </div>
      <DashboardFab onClick={() => {}} />
    </div>
  );
};
