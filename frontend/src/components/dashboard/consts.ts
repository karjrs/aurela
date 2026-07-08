import { routes } from "@utils/consts/routes";
import { Activity, ListChecks, Sun, User, Users } from "lucide-react";
import type { NavItem } from "./types";

export const NAV_ITEMS: NavItem[] = [
  {
    key: "dailyRhythm",
    href: routes.dashboard.dailyRhythm,
    labelKey: "dailyRhythm",
    icon: Activity,
  },
  {
    key: "tasks",
    href: routes.dashboard.tasks,
    labelKey: "tasks",
    icon: ListChecks,
  },
  {
    key: "today",
    href: routes.dashboard.root,
    labelKey: "today",
    icon: Sun,
    exact: true,
    variant: "primary",
  },
  {
    key: "community",
    href: routes.dashboard.community,
    labelKey: "community",
    icon: Users,
  },
  {
    key: "profile",
    href: routes.dashboard.profile,
    labelKey: "profile",
    icon: User,
  },
];
