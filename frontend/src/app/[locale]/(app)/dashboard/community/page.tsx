import { Page } from "@components/common/page";
import type { PageProps } from "@components/common/page/types";
import { getTranslations } from "next-intl/server";

const CommunityPage = async (props: PageProps) => {
  const t = await getTranslations("dashboard.community");

  return (
    <Page {...props}>
      <h1 className="font-display text-3xl font-medium text-foreground">
        {t("heading")}
      </h1>
      <p className="text-muted-foreground">{t("placeholder")}</p>
    </Page>
  );
};

export default CommunityPage;
