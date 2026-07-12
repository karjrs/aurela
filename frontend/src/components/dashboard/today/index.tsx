"use client";

import { Button } from "@components/common/ui/button";
import { useDashboardTasks } from "@hooks/dashboard/useDashboardTasks";
import { useDesktop } from "@hooks/dashboard/useDesktop";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarView } from "./calendarView";
import { INITIAL_TASKS } from "./consts";
import { Greeting } from "./greeting";
import { ListView } from "./listView";
import { NextTaskCard } from "./nextTaskCard";
import { SunArc } from "./sunArc";
import { TaskForm } from "./taskForm";
import type { Task, TaskInput, ViewMode } from "./types";
import { ViewToggle } from "./viewToggle";
import { WeatherWidget } from "./weatherWidget";

const HIGHLIGHT_DURATION_MS = 1200;

export const DashboardToday = () => {
  const t = useTranslations("dashboard.today");
  const isDesktop = useDesktop();
  const { tasks, addTask, updateTask, toggleTaskDone, removeTask } =
    useDashboardTasks(INITIAL_TASKS);

  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
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
  const doneCount = tasks.filter((task) => task.done).length;

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

  const showCalendar = isDesktop || viewMode === "calendar";
  const showList = !isDesktop && viewMode === "list";

  return (
    <div className="mx-auto flex w-full flex-col gap-6 py-6 max-w-6xl">
      <Greeting now={now} userName="Karol" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-start">
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
            onToggleDone={toggleTaskDone}
            onSelectTask={handleSelectTask}
          />
        </div>

        {isDesktop && (
          <div className="md:col-span-1 flex flex-col gap-4">
            <WeatherWidget />
            <ListView
              tasks={sortedTasks}
              highlightId={highlightId}
              blockRefs={blockRefs}
              onToggleDone={toggleTaskDone}
              onEdit={handleStartEdit}
              onRemove={removeTask}
            />
          </div>
        )}
      </div>

      {!isDesktop && <WeatherWidget />}

      <p className="text-center text-sm text-muted-foreground">
        {t("completedCount", { completed: doneCount, total: tasks.length })}
      </p>

      <div className="flex items-center justify-between">
        <h1 className="font-display text-lg font-semibold text-foreground">
          {t("heading")}
        </h1>
        <Button type="button" size="sm" onClick={handleStartAdd}>
          <Plus className="size-4" aria-hidden />
          {t("form.addTaskButton")}
        </Button>
      </div>

      {!isDesktop && <ViewToggle value={viewMode} onChange={setViewMode} />}

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

      {showCalendar && (
        <CalendarView
          tasks={sortedTasks}
          currentHour={currentHour}
          highlightId={highlightId}
          blockRefs={blockRefs}
          onToggleDone={toggleTaskDone}
          onEdit={handleStartEdit}
          onRemove={removeTask}
          onUpdateTiming={(id, patch) => updateTask(id, patch)}
        />
      )}

      {showList && (
        <ListView
          tasks={sortedTasks}
          highlightId={highlightId}
          blockRefs={blockRefs}
          onToggleDone={toggleTaskDone}
          onEdit={handleStartEdit}
          onRemove={removeTask}
        />
      )}
    </div>
  );
};
