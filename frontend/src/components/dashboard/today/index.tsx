"use client";

import { Button } from "@components/common/ui/button";
import { TaskForm } from "@components/dashboard/taskForm";
import { useDashboardTasksContext } from "@hooks/dashboard/useDashboardTasks/context";
import { useDesktop } from "@hooks/dashboard/useDesktop";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnalogClockWidget } from "./analogClockWidget";
import { CalendarCardWidget } from "./calendarCardWidget";
import { FocusTimerWidget } from "./focusTimerWidget";
import { Greeting } from "./greeting";
import { NextTaskCard } from "./nextTaskCard";
import { NoteWidget } from "./noteWidget";
import { SunArc } from "./sunArc";
import { TaskListWidget } from "./taskListWidget";
import { TaskProgressWidget } from "./taskProgressWidget";
import type { Task, TaskInput } from "./types";
import { WeatherWidget } from "./weatherWidget";

const HIGHLIGHT_DURATION_MS = 1200;

export const DashboardToday = () => {
  const t = useTranslations("dashboard.today");
  const isDesktop = useDesktop();
  const { tasks, addTask, updateTask, toggleTaskDone, removeTask } =
    useDashboardTasksContext();

  const [now, setNow] = useState<Date | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const blockRefs = useRef<Record<string, HTMLElement | null>>({});
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(
    () => () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    },
    [],
  );

  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => a.hour - b.hour),
    [tasks],
  );

  const handleSelectTask = (id: string) => {
    setHighlightId(id);
    blockRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    highlightTimeoutRef.current = setTimeout(
      () => setHighlightId(null),
      HIGHLIGHT_DURATION_MS,
    );
  };

  const handleAddSubmit = (input: TaskInput) => {
    addTask(input);
    setIsAdding(false);
  };

  const handleEditSubmit = (input: TaskInput) => {
    if (editingTask) updateTask(editingTask.id, input);
    setEditingTask(null);
  };

  const handleStartEdit = (task: Task) => {
    setIsAdding(false);
    setEditingTask(task);
  };

  const handleStartAdd = () => {
    setEditingTask(null);
    setIsAdding(true);
  };

  if (!now) return null;

  const currentHour = now.getHours() + now.getMinutes() / 60;

  return (
    <div className="mx-auto flex w-full flex-col gap-6 py-6 max-w-page">
      <Greeting now={now} userName="Karol" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-start">
        <div className="md:col-span-2 flex flex-col gap-4">
          <SunArc
            tasks={sortedTasks}
            currentHour={currentHour}
            highlightId={highlightId}
            onSelectTask={handleSelectTask}
          />
          <NextTaskCard
            tasks={sortedTasks}
            currentHour={currentHour}
            highlightId={highlightId}
            onToggleDone={toggleTaskDone}
            onEdit={handleStartEdit}
            onRemove={removeTask}
          />
          <TaskListWidget
            tasks={sortedTasks}
            highlightId={highlightId}
            blockRefs={blockRefs}
            onToggleDone={toggleTaskDone}
            onEdit={handleStartEdit}
            onRemove={removeTask}
          />
        </div>

        {isDesktop && (
          <div className="md:col-span-1 flex flex-col gap-4">
            <div className="flex gap-4">
              <CalendarCardWidget now={now} />
              <AnalogClockWidget now={now} tasks={sortedTasks} />
            </div>

            <WeatherWidget />

            <div className="flex gap-4">
              <TaskProgressWidget tasks={sortedTasks} />
              <FocusTimerWidget />
            </div>

            <NoteWidget />
          </div>
        )}
      </div>

      {!isDesktop && (
        <>
          <div className="flex gap-4">
            <CalendarCardWidget now={now} />
            <AnalogClockWidget now={now} tasks={sortedTasks} />
          </div>
          <WeatherWidget />
          <div className="flex gap-4">
            <TaskProgressWidget tasks={sortedTasks} />
            <FocusTimerWidget />
          </div>
          <NoteWidget />
        </>
      )}

      <Button
        type="button"
        onClick={handleStartAdd}
        aria-label={t("form.addTaskButton")}
        className="fixed right-4 bottom-20 z-30 size-14 rounded-full shadow-lg md:right-6 md:bottom-6"
      >
        <Plus className="size-6" aria-hidden />
      </Button>

      {isAdding && (
        <TaskForm
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAdding(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          initialValues={editingTask}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};
