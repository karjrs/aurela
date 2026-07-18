import type { NavItemProps } from "@components/nav/types";
import { Link } from "@i18n/navigation";
import { useTranslations } from "next-intl";
import { variants } from "./consts";

export const MobileNavItem = ({ item, active }: NavItemProps) => {
  const t = useTranslations("nav");
  const { label, href, icon: Icon } = item;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={variants({ active })}
    >
      {Icon && <Icon />}
      <span>{t(label)}</span>
    </Link>
  );
};
