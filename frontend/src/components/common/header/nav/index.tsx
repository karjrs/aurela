import { Button } from "@components/common/ui/button";
import { Link } from "@i18n/navigation";
import { getTranslations } from "next-intl/server";
import { NAV_ITEMS } from "./consts";

export const Nav = async () => {
  const t = await getTranslations("header");

  return (
    <nav className="hidden items-center justify-center gap-1 md:flex">
      {NAV_ITEMS.map((item) => (
        <Button key={item.labelKey} asChild variant="ghost" size="sm">
          <Link href={item.href}>{t(item.labelKey)}</Link>
        </Button>
      ))}
    </nav>
  );
};
