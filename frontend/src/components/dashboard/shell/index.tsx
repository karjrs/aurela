import { MobileNav } from "@components/nav/mobile";
import { SidebarNav } from "@components/nav/sidebar";
import type { Children } from "@utils/types";

export const Shell = ({ children }: Children) => (
  <div className="flex flex-1 flex-col md:flex-row">
    <SidebarNav />
    <main className="flex-1">{children}</main>
    <MobileNav />
  </div>
);
