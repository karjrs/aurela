"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";

import type { ProvidersProps } from "./types";

const queryClient = new QueryClient();

export const Providers = ({ children, locale, messages }: ProvidersProps) => (
  <NextIntlClientProvider locale={locale} messages={messages}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </NextIntlClientProvider>
);
