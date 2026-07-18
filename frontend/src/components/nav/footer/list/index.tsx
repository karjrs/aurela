"use client";

import { Link } from "@i18n/navigation";
import { useTranslations } from "next-intl";
import type { FooterNavListProps } from "./types";

export const FooterNavList = ({ items }: FooterNavListProps) => {
  const t = useTranslations("nav");

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
