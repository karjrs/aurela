import type { Children } from "@utils/types";

export type PageParams = {
  locale: string;
};

export type PageProps = {
  params: Promise<PageParams>;
};

export type PagePropsWithChildren = PageProps & Children;
