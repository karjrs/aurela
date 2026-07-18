"use client";

// TEMP DEMO — remove after integrating with the dashboard WIP branch
// (see "integracja później" in the bottom-sheet plan).

import { TaskFormSheet } from "@components/dashboard/todayTaskSheet";
import type { TaskFormValues } from "@components/dashboard/todayTaskSheet/types";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const TaskSheetDemo = () => {
  const t = useTranslations("dashboard.today.taskSheet");
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskFormValues[]>([]);
  const lastTask = tasks[tasks.length - 1];

  return (
    <div className="mt-6">
      {lastTask && (
        <p className="text-sm text-muted-foreground">
          {lastTask.emoji} {lastTask.title}
        </p>
      )}
      <button
        type="button"
        aria-label={t("addButton")}
        onClick={() => setOpen(true)}
        className="fixed right-5 bottom-24 z-30 flex size-14 items-center justify-center rounded-full bg-primary text-2xl text-primary-foreground shadow-lg"
      >
        +
      </button>
      <TaskFormSheet
        open={open}
        onOpenChange={setOpen}
        onSubmit={(values) => setTasks((prev) => [...prev, values])}
      />
    </div>
  );
};
