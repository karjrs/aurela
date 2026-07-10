import { routing } from "@i18n/routing";
import { fraunces, manrope } from "@utils/layout/consts";
import type { LayoutProps } from "@utils/types";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Providers } from "./providers";

import "@app/globals.css";

const RootLayout = async ({ children, params }: LayoutProps) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body text-foreground">
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
