import { Footer } from "@root/components/footer";
import { Header } from "@root/components/header";
import { MobileNav } from "@root/components/nav/mobile";
import type { Children } from "@utils/types";

const DashboardLayout = ({ children }: Children) => (
  <>
    <Header />
    <div className="flex flex-1 flex-col md:flex-row">
      <main className="flex-1">{children}</main>
      <MobileNav />
    </div>
    <div className="pb-24 md:pb-0">
      <Footer />
    </div>
  </>
);

export default DashboardLayout;
