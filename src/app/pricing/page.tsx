import React from "react";
import Pricing from "@/components/pricing/Pricing";
import { environment } from "@/utils/config";

const PricingPage = () => {
  return <Pricing />;
};
export const metadata = {
  title: `Pricing | ${environment.appName}`,
  description: `Pricing | ${environment.appName}`,
};

export default PricingPage;
