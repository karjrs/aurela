import type { DashboardListItemActionsButtonProps } from "./types";

export const DashboardListItemActionsButton = ({
  onClick,
  ariaLabel,
  children,
}: DashboardListItemActionsButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    className="shrink-0 text-muted-foreground [&>svg]:size-4"
  >
    {children}
  </button>
);
