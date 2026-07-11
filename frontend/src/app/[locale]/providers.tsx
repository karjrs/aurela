"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";

import type { ProvidersProps } from "./types";

const queryClient = new QueryClient();

export const Providers = ({ children, locale, messages }: ProvidersProps) => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NextIntlClientProvider>
  </ThemeProvider>
);
