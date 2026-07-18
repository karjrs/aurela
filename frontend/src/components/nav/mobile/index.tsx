"use client";

import { useActiveRoute } from "@hooks/nav/useActiveRoute";
import { useTranslations } from "next-intl";
import { dashboardItems } from "../consts";
import { MobileNavFab } from "./fab";
import { MobileNavItem } from "./item";

export const MobileNav = () => {
  const t = useTranslations("nav");
  const { isActive } = useActiveRoute();

  return (
    <nav
      aria-label={t("landmark")}
      className="fixed inset-x-0 bottom-0 z-20 flex items-stretch justify-between border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {dashboardItems.map((item) => {
        const { label, href, exact, fab } = item;
        const active = isActive(href, exact);

        if (fab)
          return <MobileNavFab key={label} item={item} active={active} />;

        return <MobileNavItem key={label} item={item} active={active} />;
      })}
    </nav>
  );
};
