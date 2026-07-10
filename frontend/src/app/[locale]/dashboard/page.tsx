import type { PageProps } from "@utils/types";
import { getTranslations, setRequestLocale } from "next-intl/server";

const DashboardPage = async ({ params }: PageProps) => {
  const t = await getTranslations("dashboard");

  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-20">
      <h1 className="font-display text-3xl font-medium text-foreground">
        {t("heading")}
      </h1>
      <p className="text-muted-foreground">{t("placeholder")}</p>
    </div>
  );
};

export default DashboardPage;
