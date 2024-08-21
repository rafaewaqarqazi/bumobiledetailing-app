import React from "react";
import GetStartedMain from "@/components/get-started/GetStartedMain";
import { environment } from "@/utils/config";

const Page = () => {
  return <GetStartedMain />;
};
export const metadata = {
  title: `Booking | ${environment.appName}`,
  description: `Booking | ${environment.appName}`,
};

export default Page;
