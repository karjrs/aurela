import { Footer } from "@root/components/footer";
import { Header } from "@root/components/header";
import type { Children } from "@utils/types";

const MarketingLayout = ({ children }: Children) => (
  <>
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </>
);

export default MarketingLayout;
