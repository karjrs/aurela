"use client";

import { Button } from "@components/common/ui/button";
import type { ButtonProps } from "@components/common/ui/button/types";
import { usePathname, useRouter } from "@i18n/navigation";
import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export const HeaderLanguage = (props: ButtonProps) => {
  const t = useTranslations("header.language");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const nextLocale = locale === "en" ? "pl" : "en";

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
