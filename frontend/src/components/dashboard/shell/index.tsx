import { BottomNav } from "../bottomNav";
import { Sidebar } from "../sidebar";
import type { ShellProps } from "./types";

export const Shell = ({ children }: ShellProps) => (
  <div className="flex flex-1 flex-col md:flex-row">
    <Sidebar />
    <main className="flex-1">{children}</main>
    <BottomNav />
  </div>
);
