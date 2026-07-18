import { Button } from "@components/common/ui/button";
import { Link } from "@i18n/navigation";
import { useTranslations } from "next-intl";
import type { HeaderNavItemProps } from "./types";

export const HeaderNavItem = ({ item, active }: HeaderNavItemProps) => {
  const t = useTranslations("nav");
  const { label, href } = item;

  return (
    <Button asChild variant="ghost" size="sm">
      <Link href={href} aria-current={active ? "page" : undefined}>
        {t(label)}
      </Link>
    </Button>
  );
};
