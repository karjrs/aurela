"use client";

import type { Task, TaskInput } from "@components/dashboard/today/types";
import { useCallback, useState } from "react";

export const useDashboardTasks = (initialTasks: Task[] = []) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = useCallback((input: TaskInput) => {
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), done: false, ...input },
    ]);
  }, []);

  const updateTask = useCallback((id: string, input: Partial<TaskInput>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...input } : task)),
    );
  }, []);

  const toggleTaskDone = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  return { tasks, addTask, updateTask, toggleTaskDone, removeTask };
};
