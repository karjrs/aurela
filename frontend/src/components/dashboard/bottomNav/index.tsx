"use client";

import { useActiveRoute } from "@hooks/nav/useActiveRoute";
import { Link } from "@i18n/navigation";
import { useTranslations } from "next-intl";
import { NAV_ITEMS } from "../consts";
import { bottomNavFabVariants, bottomNavItemVariants } from "./consts";

export const BottomNav = () => {
  const t = useTranslations("nav");
  const { isActive } = useActiveRoute();

  return (
    <nav
      aria-label={t("landmark")}
      className="fixed inset-x-0 bottom-0 z-20 flex items-stretch justify-between border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item);
        const Icon = item.icon;

        if (item.variant === "primary") {
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-label={t(item.labelKey)}
              aria-current={active ? "page" : undefined}
              className="flex flex-1 items-center justify-center"
            >
              <span className={bottomNavFabVariants({ active })}>
                <Icon />
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={bottomNavItemVariants({ active })}
          >
            <Icon />
            <span>{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
};
