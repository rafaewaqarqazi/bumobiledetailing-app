import React from "react";
import { environment } from "@/utils/config";
import GetStartedThankyou from "@/components/get-started/GetStartedThankyou";

const Page = () => {
  return <GetStartedThankyou />;
};
export const metadata = {
  title: `Booking- Thankyou | ${environment.appName}`,
  description: `Booking - Thankyou | ${environment.appName}`,
};
export default Page;
