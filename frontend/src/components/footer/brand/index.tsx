import { Logo } from "@root/components/header/logo";
import { getTranslations } from "next-intl/server";
import { Social } from "../social";

export const Brand = async () => {
  const t = await getTranslations("footer.brand");

  return (
    <div className="flex flex-col gap-4">
      <Logo as="span" />
      <p className="max-w-xs text-sm text-muted-foreground">{t("tagline")}</p>
      <Social />
    </div>
  );
};
