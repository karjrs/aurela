"use client";

import { Button } from "@components/common/ui/button";
import { CalendarView } from "@components/dashboard/calendar/calendarView";
import { TaskForm } from "@components/dashboard/taskForm";
import type { Task, TaskInput } from "@components/dashboard/today/types";
import { useDashboardTasksContext } from "@hooks/dashboard/useDashboardTasks/context";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

export const DashboardCalendar = () => {
  const t = useTranslations("dashboard.calendar");
  const tToday = useTranslations("dashboard.today");
  const { tasks, addTask, updateTask, toggleTaskDone, removeTask } =
    useDashboardTasksContext();

  const [now, setNow] = useState<Date | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [highlightId] = useState<string | null>(null);

  const blockRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => a.hour - b.hour),
    [tasks],
  );

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
      <h1 className="font-display text-lg font-semibold text-foreground">
        {t("heading")}
      </h1>

      <Button
        type="button"
        onClick={handleStartAdd}
        aria-label={tToday("form.addTaskButton")}
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
    </div>
  );
};
