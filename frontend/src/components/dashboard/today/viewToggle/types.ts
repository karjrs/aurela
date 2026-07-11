import type { ViewMode } from "../types";

export type ViewToggleProps = {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
};
