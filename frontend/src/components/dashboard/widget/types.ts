import type { Children } from "@root/utils/types";

export type WidgetProps = Children & {
  href?: string;
  className?: string;
  ariaLabel?: string;
};
