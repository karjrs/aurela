"use client";

import { snapToQuarterHour } from "@utils/dateTime";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { DAY_END, DAY_START, MIN_DURATION } from "../../../consts";
import type { Task, TaskInput } from "../../../types";

type DragMode = "move" | "resize";

type DragSession = {
  mode: DragMode;
  startY: number;
  hour: number;
  duration: number;
};

type Preview = { hour: number; duration: number };

export const useDragResize = (
  task: Task,
  hourHeight: number,
  onUpdateTiming: (patch: Partial<TaskInput>) => void,
) => {
  const sessionRef = useRef<DragSession | null>(null);
  const previewRef = useRef<Preview | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      const session = sessionRef.current;
      if (!session) return;

      const deltaHours = (event.clientY - session.startY) / hourHeight;
      let next: Preview;

      if (session.mode === "move") {
        const hour = Math.max(
          DAY_START,
          Math.min(
            DAY_END - session.duration,
            snapToQuarterHour(session.hour + deltaHours),
          ),
        );
        next = { hour, duration: session.duration };
      } else {
        const duration = Math.max(
          MIN_DURATION,
          Math.min(
            DAY_END - session.hour,
            snapToQuarterHour(session.duration + deltaHours),
          ),
        );
        next = { hour: session.hour, duration };
      }

      previewRef.current = next;
      setPreview(next);
    };

    const handleUp = () => {
      if (sessionRef.current && previewRef.current) {
        onUpdateTiming(previewRef.current);
      }
      sessionRef.current = null;
      previewRef.current = null;
      setIsDragging(false);
      setPreview(null);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [hourHeight, onUpdateTiming]);

  const beginDrag = useCallback(
    (event: ReactPointerEvent, mode: DragMode) => {
      event.stopPropagation();
      event.preventDefault();
      sessionRef.current = {
        mode,
        startY: event.clientY,
        hour: task.hour,
        duration: task.duration,
      };
      setIsDragging(true);
    },
    [task.hour, task.duration],
  );

  return {
    isDragging,
    hour: preview?.hour ?? task.hour,
    duration: preview?.duration ?? task.duration,
    beginMove: (event: ReactPointerEvent) => beginDrag(event, "move"),
    beginResize: (event: ReactPointerEvent) => beginDrag(event, "resize"),
  };
};
