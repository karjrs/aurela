import type { Link } from "@utils/types";
import type { LucideIcon } from "lucide-react";

export type NavItem = Link & {
  icon: LucideIcon;
  exact?: boolean;
  fab?: boolean;
};

export type NavItemProps = {
  item: NavItem;
  active: boolean;
};
