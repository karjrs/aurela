"use client";

import { Button } from "@components/common/ui/button";
import type { ButtonProps } from "@components/common/ui/button/types";
import { usePathname, useRouter } from "@i18n/navigation";
import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { OTHER_LOCALE } from "./consts";

export const Language = (props: ButtonProps) => {
  const t = useTranslations("header.language");
  const locale = useLocale() as keyof typeof OTHER_LOCALE;
  const pathname = usePathname();
  const router = useRouter();
  const nextLocale = OTHER_LOCALE[locale];

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={t(nextLocale === "pl" ? "switchToPl" : "switchToEn")}
      onClick={() => router.replace(pathname, { locale: nextLocale })}
      {...props}
    >
      <Languages />
    </Button>
  );
};
