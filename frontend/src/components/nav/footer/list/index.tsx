import { Link } from "@i18n/navigation";
import { getTranslations } from "next-intl/server";
import type { NavListProps } from "./types";

export const NavList = async ({ items }: NavListProps) => {
  const t = await getTranslations("nav");

  return (
    <ul className="flex flex-col gap-2">
      {items.map(({ label, href }) => (
        <li key={label}>
          <Link
            href={href}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t(label)}
          </Link>
        </li>
      ))}
    </ul>
  );
};
