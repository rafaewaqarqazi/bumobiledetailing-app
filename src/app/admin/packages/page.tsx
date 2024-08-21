import React from "react";
import Packages from "@/components/packages/Packages";
import { environment } from "@/utils/config";

const PackagesPage = () => {
  return <Packages />;
};
export const metadata = {
  title: `Packages | ${environment.appName}`,
  description: `Packages | ${environment.appName}`,
};

export default PackagesPage;
