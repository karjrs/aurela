import type { PageProps } from "@components/common/page/types";
import { Dashboard } from "@root/components/dashboard";
import { setRequestLocale } from "next-intl/server";

const DashboardPage = async ({ params }: PageProps) => {
  const { locale } = await params;

  setRequestLocale(locale);

  return <Dashboard />;
};

export default DashboardPage;
