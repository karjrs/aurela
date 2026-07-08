import type { LucideIcon } from "lucide-react";

export type NavItem = {
  key: string;
  href: string;
  labelKey: string;
  icon: LucideIcon;
  exact?: boolean;
  variant?: "primary";
};
