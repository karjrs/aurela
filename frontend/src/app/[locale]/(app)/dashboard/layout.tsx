import { Shell } from "@components/dashboard/shell";
import { Footer } from "@root/components/footer";
import { Header } from "@root/components/header";
import type { Children } from "@utils/types";

const DashboardLayout = ({ children }: Children) => (
  <>
    <Header />
    <Shell>{children}</Shell>
    <div className="pb-24 md:pb-0">
      <Footer />
    </div>
  </>
);

export default DashboardLayout;
