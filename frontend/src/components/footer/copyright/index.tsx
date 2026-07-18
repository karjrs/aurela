import { copyrightYear as year } from "@utils/consts";
import { getTranslations } from "next-intl/server";

export const Copyright = async () => {
  const t = await getTranslations("footer");

  return (
    <div className="py-6 px-4">
      <p className="text-sm text-muted-foreground">
        {t("copyright", { year })}
      </p>
    </div>
  );
};
