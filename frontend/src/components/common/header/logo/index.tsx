"use client";

import { Link } from "@i18n/navigation";
import { routes } from "@utils/consts/routes";
import { useTranslations } from "next-intl";
import { LogoIcon } from "./icon";

export const Logo = () => {
  const t = useTranslations("header");

  return (
    <Link
      href={routes.home}
      aria-label={t("title")}
      className="flex items-center gap-2.5"
    >
      <LogoIcon aria-label={t("logo.alt")} className="shrink-0" />
      <h1 className="font-display text-lg leading-none font-semibold text-foreground mt-0.5">
        {t("title")}
      </h1>
    </Link>
  );
};
