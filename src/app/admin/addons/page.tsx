import React from "react";
import AddOns from "@/components/addOn/AddOns";
import { environment } from "@/utils/config";

const AddOnsPage = () => {
  return <AddOns />;
};
export const metadata = {
  title: `Addons | ${environment.appName}`,
  description: `Addons | ${environment.appName}`,
};

export default AddOnsPage;
