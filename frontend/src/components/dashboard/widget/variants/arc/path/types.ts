import type { ArcData } from "../types";

export type ArcPathProps = Pick<
  ArcData,
  "nightBefore" | "nightAfter" | "daySeg"
>;
