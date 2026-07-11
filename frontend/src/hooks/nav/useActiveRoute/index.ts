"use client";

import { usePathname } from "@i18n/navigation";

export const useActiveRoute = () => {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (!pathname) return false;
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return { isActive };
};
