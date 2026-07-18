import type { Link } from "@utils/types";
import type { LucideIcon } from "lucide-react";

export type NavLink = Link & {
  icon?: LucideIcon;
  exact?: boolean;
  fab?: boolean;
};

export type NavItemProps = {
  item: NavLink;
  active: boolean;
};
