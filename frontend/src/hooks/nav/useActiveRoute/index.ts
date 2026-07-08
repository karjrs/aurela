"use client";

import { usePathname } from "@i18n/navigation";

type RouteMatch = { href: string; exact?: boolean };

export const useActiveRoute = () => {
  const pathname = usePathname();

  const isActive = ({ href, exact }: RouteMatch) =>
    exact
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return { isActive };
};
