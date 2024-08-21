import React from "react";
import { environment } from "@/utils/config";
import AddOnForm from "@/components/addOn/AddOnForm";

const AddOnEditPage = () => {
  return <AddOnForm />;
};
export const metadata = {
  title: `AddOn - Edit | ${environment.appName}`,
  description: `AddOn - Edit | ${environment.appName}`,
};

export default AddOnEditPage;
