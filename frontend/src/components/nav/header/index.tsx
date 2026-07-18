"use client";

import { useActiveRoute } from "@hooks/nav/useActiveRoute";
import { useDashboardRoute } from "@root/hooks/nav/useDashboardRoute";
import { dashboardItems, productItems } from "../consts";
import { HeaderNavItem } from "./item";

export const HeaderNav = () => {
  const isDashboard = useDashboardRoute();
  const { isActive } = useActiveRoute();

  const items = isDashboard ? dashboardItems : productItems;

  return (
    <nav className="hidden items-center justify-center gap-1 md:flex">
      {items.map((item) => (
        <HeaderNavItem
          key={item.label}
          item={item}
          active={isDashboard && isActive(item.href, item.exact)}
        />
      ))}
    </nav>
  );
};
