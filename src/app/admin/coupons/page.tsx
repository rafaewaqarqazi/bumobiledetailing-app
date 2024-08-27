import React from "react";
import { environment } from "@/utils/config";
import Coupons from "@/components/coupon/Coupons";

const CouponsPage = () => {
  return <Coupons />;
};
export const metadata = {
  title: `Coupons | ${environment.appName}`,
  description: `Coupons | ${environment.appName}`,
};

export default CouponsPage;
