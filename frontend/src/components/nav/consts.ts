import { routes } from "@utils/consts/routes";
import { CalendarDays, Sun } from "lucide-react";
import type { NavLink } from "./types";

export const productItems: NavLink[] = [
  { label: "dailyRhythm", href: "#" },
  { label: "howItWorks", href: "#" },
  { label: "about", href: "#" },
];

export const dashboardItems: NavLink[] = [
  {
    label: "dailyRhythm",
    href: routes.dashboard.root,
    icon: Sun,
    exact: true,
    fab: true,
  },
  {
    label: "calendar",
    href: routes.dashboard.calendar,
    icon: CalendarDays,
  },
];

export const legalItems: NavLink[] = [
  { label: "privacy", href: "#" },
  { label: "terms", href: "#" },
];
