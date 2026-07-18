"use client";

import { Button } from "@components/common/ui/button";
import { Link } from "@i18n/navigation";
import { useDashboardRoute } from "@root/hooks/nav/useDashboardRoute";
import { routes } from "@utils/consts/routes";
import { useTranslations } from "next-intl";
import { HeaderActionsUser } from "./user";

export const HeaderActions = () => {
  const t = useTranslations("header.actions");
  const isDashboard = useDashboardRoute();

  if (isDashboard) return <HeaderActionsUser />;

  return (
    <Button asChild variant="default">
      <Link href={routes.dashboard.root}>{t("cta")}</Link>
    </Button>
  );
};
