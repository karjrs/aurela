import type { PageProps } from "@components/common/page/types";
import { DashboardCalendar } from "@components/dashboard/calendar";
import { setRequestLocale } from "next-intl/server";

const CalendarPage = async ({ params }: PageProps) => {
  const { locale } = await params;

  setRequestLocale(locale);

  return <DashboardCalendar />;
};

export default CalendarPage;
