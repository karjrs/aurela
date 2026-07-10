import type { ReactNode } from "react";

export type PageProps = {
  params: Promise<{ locale: string }>;
};

export type LayoutProps = PageProps & {
  children: ReactNode;
};
