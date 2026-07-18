"use client";

import type { Task, TaskInput } from "@components/dashboard/types";
import { useCallback, useState } from "react";

export const useDashboardTasks = (initialTasks: Task[] = []) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

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

  return { tasks, updateTask, toggleTaskDone, removeTask };
};
