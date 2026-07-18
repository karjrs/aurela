import type { Task } from "@components/dashboard/types";
import { hourOfDay } from "@utils/dateTime";

export type ColumnLayout = {
  columnOf: Record<string, number>;
  columnCountOf: Record<string, number>;
};

type TaskInterval = { id: string; hour: number; end: number };

export const layoutColumns = (sortedTasks: Task[]): ColumnLayout => {
  const withEnd: TaskInterval[] = sortedTasks.map((task) => {
    const hour = hourOfDay(task.hour);
    return { id: task.id, hour, end: hour + task.duration };
  });

  const columnOf: Record<string, number> = {};
  const columnCountOf: Record<string, number> = {};

  let cluster: TaskInterval[] = [];
  let clusterEnd = Number.NEGATIVE_INFINITY;

  const flush = () => {
    if (!cluster.length) return;

    const columnsEnd: number[] = [];
    for (const task of cluster) {
      let placed = false;
      for (let column = 0; column < columnsEnd.length; column++) {
        if (task.hour >= columnsEnd[column]) {
          columnsEnd[column] = task.end;
          columnOf[task.id] = column;
          placed = true;
          break;
        }
      }
      if (!placed) {
        columnsEnd.push(task.end);
        columnOf[task.id] = columnsEnd.length - 1;
      }
    }
    for (const task of cluster) columnCountOf[task.id] = columnsEnd.length;

    cluster = [];
    clusterEnd = Number.NEGATIVE_INFINITY;
  };

  for (const task of withEnd) {
    if (cluster.length && task.hour >= clusterEnd) flush();
    cluster.push(task);
    clusterEnd = Math.max(clusterEnd, task.end);
  }
  flush();

  return { columnOf, columnCountOf };
};
