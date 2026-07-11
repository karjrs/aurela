import type { PageProps } from "@components/common/page/types";
import { DashboardToday } from "@components/dashboard/today";
import { setRequestLocale } from "next-intl/server";

const DashboardPage = async ({ params }: PageProps) => {
  const { locale } = await params;

  setRequestLocale(locale);

  return <DashboardToday />;
};

export default DashboardPage;
