import { LogoIcon } from "@components/common/header/logo/icon";
import { Link } from "@i18n/navigation";
import { routes } from "@utils/consts/routes";
import { getTranslations } from "next-intl/server";
import { Social } from "../social";

export const Brand = async () => {
  const t = await getTranslations("header");
  const tFooter = await getTranslations("footer");

  return (
    <div className="flex flex-col gap-4">
      <Link
        href={routes.home}
        aria-label={t("title")}
        className="flex items-center gap-2.5"
      >
        <LogoIcon aria-label={t("logo.alt")} className="shrink-0" />
        <span className="font-display text-lg leading-none font-semibold text-foreground">
          {t("title")}
        </span>
      </Link>
      <p className="max-w-xs text-sm text-muted-foreground">
        {tFooter("brand.tagline")}
      </p>
      <Social />
    </div>
  );
};
