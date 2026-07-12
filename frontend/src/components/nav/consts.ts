import { routes } from "@utils/consts/routes";
import type { Link } from "@utils/types";
import {
  Activity,
  CalendarDays,
  ListChecks,
  Sun,
  User,
  Users,
} from "lucide-react";
import type { NavItem } from "./types";

export const productItems: Link[] = [
  { label: "dailyRhythm", href: "#" },
  { label: "howItWorks", href: "#" },
  { label: "about", href: "#" },
];

export const legalItems: Link[] = [
  { label: "items.legal.privacy", href: "#" },
  { label: "items.legal.terms", href: "#" },
];

export const navItems: NavItem[] = [
  {
    label: "dailyRhythm",
    href: routes.dashboard.dailyRhythm,
    icon: Activity,
  },
  {
    label: "tasks",
    href: routes.dashboard.tasks,
    icon: ListChecks,
  },
  {
    label: "calendar",
    href: routes.dashboard.calendar,
    icon: CalendarDays,
  },
  {
    label: "today",
    href: routes.dashboard.root,
    icon: Sun,
    exact: true,
    fab: true,
  },
  {
    label: "community",
    href: routes.dashboard.community,
    icon: Users,
  },
  {
    label: "profile",
    href: routes.dashboard.profile,
    icon: User,
  },
];
