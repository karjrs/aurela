"use client";

import { useActiveRoute } from "@hooks/nav/useActiveRoute";
import { useTranslations } from "next-intl";
import { navItems } from "../consts";
import { SidebarItem } from "./item";

export const SidebarNav = () => {
  const t = useTranslations("nav");
  const { isActive } = useActiveRoute();

  return (
    <aside className="hidden shrink-0 border-r border-border bg-background md:flex md:w-60 md:flex-col md:gap-1 md:p-3">
      <nav aria-label={t("landmark")} className="flex flex-col gap-1">
        {navItems.map((item) => {
          const { label, href, exact } = item;
          const active = isActive(href, exact);

          return <SidebarItem key={label} item={item} active={active} />;
        })}
      </nav>
    </aside>
  );
};
