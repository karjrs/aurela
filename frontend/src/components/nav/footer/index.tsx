"use client";

import { useDashboardRoute } from "@root/hooks/nav/useDashboardRoute";
import { cn } from "@utils/helpers/cn";
import { useTranslations } from "next-intl";
import { dashboardItems, legalItems, productItems } from "../consts";
import { FooterNavSection } from "./section";

export const FooterNav = () => {
  const t = useTranslations("nav.items");
  const isDashboard = useDashboardRoute();

  return (
    <div
      className={cn("grid grid-cols-2 gap-16", isDashboard && "sm:grid-cols-3")}
    >
      <FooterNavSection title={t("product")} items={productItems} />
      {isDashboard && (
        <FooterNavSection title={t("dashboard")} items={dashboardItems} />
      )}
      <FooterNavSection title={t("legal")} items={legalItems} />
    </div>
  );
};
