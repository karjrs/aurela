import { Footer } from "@components/common/footer";
import { Header } from "@components/common/header";
import { Shell } from "@components/dashboard/shell";
import type { ReactNode } from "react";

type DashboardLayoutProps = Readonly<{ children: ReactNode }>;

const DashboardLayout = ({ children }: DashboardLayoutProps) => (
  <>
    <Header />
    <Shell>{children}</Shell>
    <div className="pb-24 md:pb-0">
      <Footer />
    </div>
  </>
);

export default DashboardLayout;
