"use client";

import { Link } from "@i18n/navigation";
import { routes } from "@utils/consts/routes";
import { useTranslations } from "next-intl";
import { LogoIcon } from "./icon";
import type { LogoProps } from "./types";

export const Logo = ({ as: Tag = "h1" }: LogoProps) => {
  const t = useTranslations("common");

  return (
    <Link
      href={routes.home}
      aria-label={t("title")}
      className="flex items-center gap-2.5"
    >
      <LogoIcon aria-label={t("logo.alt")} className="shrink-0" />
      <Tag className="font-display text-lg leading-none font-semibold text-foreground mt-0.5">
        {t("title")}
      </Tag>
    </Link>
  );
};
