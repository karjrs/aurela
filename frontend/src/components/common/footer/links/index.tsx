import { NAV_ITEMS } from "@components/common/header/nav/consts";
import { Link } from "@i18n/navigation";
import { getTranslations } from "next-intl/server";
import { LEGAL_LINKS } from "./consts";

export const Links = async () => {
  const t = await getTranslations("header");
  const tFooter = await getTranslations("footer");

  return (
    <>
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">
          {tFooter("links.product")}
        </h2>
        <ul className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.labelKey}>
              <Link
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {t(item.labelKey)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">
          {tFooter("links.legal.title")}
        </h2>
        <ul className="flex flex-col gap-2">
          {LEGAL_LINKS.map((item) => (
            <li key={item.labelKey}>
              <Link
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {tFooter(item.labelKey)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
