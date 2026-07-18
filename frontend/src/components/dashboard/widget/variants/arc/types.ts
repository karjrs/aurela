import type { Task } from "@components/dashboard/types";

export type Point = { x: number; y: number };

export type ArcProps = {
  tasks: Task[];
  now: Date;
  onSelectTask: (id: string) => void;
};

export type ArcData = {
  nightBefore: Point[];
  daySeg: Point[];
  nightAfter: Point[];
  sunPos: Point;
  isNight: boolean;
  sun: SunTimes;
};

export type SunTimes = {
  sunrise: Date;
  sunset: Date;
};
