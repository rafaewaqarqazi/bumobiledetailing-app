import React from "react";
import { environment } from "@/utils/config";
import AddOnForm from "@/components/addOn/AddOnForm";

const AddOnFormPage = () => {
  return <AddOnForm />;
};
export const metadata = {
  title: `AddOn Add | ${environment.appName}`,
  description: `AddOn Add | ${environment.appName}`,
};

export default AddOnFormPage;
