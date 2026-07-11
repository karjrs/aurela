import { Link } from "@i18n/navigation";
import { useTranslations } from "next-intl";
import type { NavItemProps } from "../../types";
import { variants } from "./consts";

export const MobileNavFab = ({ item, active }: NavItemProps) => {
  const t = useTranslations("nav");
  const { label, href, icon: Icon } = item;

  return (
    <Link
      href={href}
      aria-label={t(label)}
      aria-current={active ? "page" : undefined}
      className="flex flex-1 items-center justify-center"
    >
      <span className={variants({ active })}>
        <Icon />
      </span>
    </Link>
  );
};
