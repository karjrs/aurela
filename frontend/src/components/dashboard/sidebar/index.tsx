"use client";

import { useActiveRoute } from "@hooks/nav/useActiveRoute";
import { Link } from "@i18n/navigation";
import { useTranslations } from "next-intl";
import { NAV_ITEMS } from "../consts";
import { sidebarItemVariants } from "./consts";

export const Sidebar = () => {
  const t = useTranslations("nav");
  const { isActive } = useActiveRoute();

  return (
    <aside className="hidden shrink-0 border-r border-border bg-background md:flex md:w-60 md:flex-col md:gap-1 md:p-3">
      <nav aria-label={t("landmark")} className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={sidebarItemVariants({ active })}
            >
              <Icon />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
