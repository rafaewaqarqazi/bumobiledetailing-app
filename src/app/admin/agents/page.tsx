import React from "react";
import { environment } from "@/utils/config";
import AgentsMain from "@/components/agent/AgentsMain";

const AgentsPage = () => {
  return <AgentsMain />;
};
export const metadata = {
  title: `Agents | ${environment.appName}`,
  description: `Agents | ${environment.appName}`,
};
export default AgentsPage;
