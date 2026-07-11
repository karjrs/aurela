import { copyrightYear as year } from "@utils/consts";
import { getTranslations } from "next-intl/server";

export const Copyright = async () => {
  const t = await getTranslations("footer");

  return (
    <div className="mt-10 border-t border-border pt-6">
      <p className="text-sm text-muted-foreground">
        {t("copyright", { year })}
      </p>
    </div>
  );
};
