import type { NextIntlClientProvider } from "next-intl";
import type { ComponentProps, ReactNode } from "react";

export type ProvidersProps = {
  children: ReactNode;
  locale: string;
  messages: ComponentProps<typeof NextIntlClientProvider>["messages"];
};
