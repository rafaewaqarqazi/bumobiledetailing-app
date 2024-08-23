import React from "react";
import Customers from "@/components/customer/Customers";
import { environment } from "@/utils/config";

const CustomersPage = () => {
  return <Customers />;
};
export const metadata = {
  title: `Customers | ${environment.appName}`,
  description: `Customers | ${environment.appName}`,
};

export default CustomersPage;
