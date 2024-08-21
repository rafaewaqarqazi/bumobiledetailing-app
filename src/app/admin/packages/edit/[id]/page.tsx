import React from "react";
import { environment } from "@/utils/config";
import PackageForm from "@/components/packages/PackageForm";

const PackageEditPage = () => {
  return <PackageForm />;
};
export const metadata = {
  title: `Packages - Edit | ${environment.appName}`,
  description: `Packages - Edit | ${environment.appName}`,
};

export default PackageEditPage;
