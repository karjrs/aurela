import { Link } from "@i18n/navigation";
import { useTranslations } from "next-intl";
import type { NavItemProps } from "../../types";
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
      <Icon />
      <span>{t(label)}</span>
    </Link>
  );
};
