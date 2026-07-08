"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import type { ProvidersProps } from "./types";

const queryClient = new QueryClient();

export const Providers = ({ children }: ProvidersProps) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
