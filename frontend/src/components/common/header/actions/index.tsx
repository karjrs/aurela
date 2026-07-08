import { Button } from "@components/common/ui/button";
import { Link } from "@i18n/navigation";
import { routes } from "@utils/consts/routes";
import { getTranslations } from "next-intl/server";

export const Actions = async () => {
  const t = await getTranslations("header.actions");

  return (
    <Button asChild variant="default">
      <Link href={routes.dashboard.root}>{t("cta")}</Link>
    </Button>
  );
};
