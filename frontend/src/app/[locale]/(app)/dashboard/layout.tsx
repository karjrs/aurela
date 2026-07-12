import { Shell } from "@components/dashboard/shell";
import { DashboardTasksProvider } from "@hooks/dashboard/useDashboardTasks/context";
import { Footer } from "@root/components/footer";
import { Header } from "@root/components/header";
import type { Children } from "@utils/types";

const DashboardLayout = ({ children }: Children) => (
  <DashboardTasksProvider>
    <Header />
    <Shell>{children}</Shell>
    <div className="pb-24 md:pb-0">
      <Footer />
    </div>
  </DashboardTasksProvider>
);

export default DashboardLayout;
