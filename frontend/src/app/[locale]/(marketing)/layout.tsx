import { Footer } from "@components/common/footer";
import { Header } from "@components/common/header";
import type { ReactNode } from "react";

type MarketingLayoutProps = Readonly<{ children: ReactNode }>;

const MarketingLayout = ({ children }: MarketingLayoutProps) => (
  <>
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </>
);

export default MarketingLayout;
