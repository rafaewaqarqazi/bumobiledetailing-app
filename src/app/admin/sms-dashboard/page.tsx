import React from "react";
import { environment } from "@/utils/config";
import SmsDashboard from "@/components/sms/SMS.Dashboard";

const SMSDashboardPage = () => {
  return <SmsDashboard />;
};
export const metadata = {
  title: `SMS Dashboard | ${environment.appName}`,
  description: `SMS Dashboard | ${environment.appName}`,
};
export default SMSDashboardPage;
