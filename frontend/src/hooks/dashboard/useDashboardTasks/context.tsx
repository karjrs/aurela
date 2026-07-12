"use client";

import { INITIAL_TASKS } from "@components/dashboard/today/consts";
import type { Children } from "@utils/types";
import { createContext, useContext } from "react";
import { useDashboardTasks } from ".";

type DashboardTasksContextValue = ReturnType<typeof useDashboardTasks>;

const DashboardTasksContext = createContext<DashboardTasksContextValue | null>(
  null,
);

export const DashboardTasksProvider = ({ children }: Children) => {
  const value = useDashboardTasks(INITIAL_TASKS);

  return (
    <DashboardTasksContext.Provider value={value}>
      {children}
    </DashboardTasksContext.Provider>
  );
};

export const useDashboardTasksContext = () => {
  const context = useContext(DashboardTasksContext);

  if (!context) {
    throw new Error(
      "useDashboardTasksContext must be used within a DashboardTasksProvider",
    );
  }

  return context;
};
