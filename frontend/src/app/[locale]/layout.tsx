import type { PageProps } from "@components/common/page/types";
import { routing } from "@i18n/routing";
import { fraunces, manrope } from "@utils/layout/consts";
import type { Children } from "@utils/types";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Providers } from "./providers";

import "@app/globals.css";

type RootLayoutProps = PageProps & Children;

const RootLayout = async ({ children, params }: RootLayoutProps) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body text-foreground bg-aurela bg-cover bg-no-repeat">
        <Providers locale={locale} messages={messages}>
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
