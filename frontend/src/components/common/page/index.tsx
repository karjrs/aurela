import { setRequestLocale } from "next-intl/server";
import type { PagePropsWithChildren } from "./types";

export const Page = async ({ params, children }: PagePropsWithChildren) => {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-20">
      {children}
    </div>
  );
};
