import React from "react";
import { environment } from "@/utils/config";
import PackageForm from "@/components/packages/PackageForm";

const PackageAddPage = () => {
  return <PackageForm />;
};
export const metadata = {
  title: `Packages - Add | ${environment.appName}`,
  description: `Packages - Add | ${environment.appName}`,
};

export default PackageAddPage;
