import { Button } from "@components/common/ui/button";
import { Link } from "@i18n/navigation";
import { getTranslations } from "next-intl/server";
import { productItems } from "../consts";

export const HeaderNav = async () => {
  const t = await getTranslations("nav");

  return (
    <nav className="hidden items-center justify-center gap-1 md:flex">
      {productItems.map(({ label, href }) => (
        <Button key={label} asChild variant="ghost" size="sm">
          <Link href={href}>{t(label)}</Link>
        </Button>
      ))}
    </nav>
  );
};
