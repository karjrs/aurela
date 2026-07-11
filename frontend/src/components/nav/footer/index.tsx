import { getTranslations } from "next-intl/server";
import { legalItems, productItems } from "../consts";
import { NavList } from "./list";

export const FooterNav = async () => {
  const t = await getTranslations("nav");

  return (
    <>
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">
          {t("items.product")}
        </h2>
        <NavList items={productItems} />
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">
          {t("items.legal.title")}
        </h2>
        <NavList items={legalItems} />
      </div>
    </>
  );
};
