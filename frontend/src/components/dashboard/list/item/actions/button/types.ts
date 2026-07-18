import type { Children } from "@root/utils/types";

export type DashboardListItemActionsButtonProps = Children & {
  onClick: () => void;
  ariaLabel: string;
};
