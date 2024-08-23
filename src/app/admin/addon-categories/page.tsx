import React from "react";
import AddOnCategories from "@/components/addOn/AddOnCategories";
import { environment } from "@/utils/config";

const AddOnCategoriesPage = () => {
  return <AddOnCategories />;
};
export const metadata = {
  title: `Addon Categories | ${environment.appName}`,
  description: `Addon Categories | ${environment.appName}`,
};

export default AddOnCategoriesPage;
