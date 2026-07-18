"use client";

import { usePathname } from "@i18n/navigation";
import { routes } from "@utils/consts/routes";

export const useDashboardRoute = () => {
  const pathname = usePathname();

  return (
    pathname === routes.dashboard.root ||
    pathname.startsWith(`${routes.dashboard.root}/`)
  );
};
