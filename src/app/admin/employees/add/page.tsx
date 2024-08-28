import React from "react";
import { environment } from "@/utils/config";
import EmployeeForm from "@/components/employee/EmployeeForm";

const EmployeeAddPage = () => {
  return <EmployeeForm />;
};
export const metadata = {
  title: `Employees - Add | ${environment.appName}`,
  description: `Employees - Add | ${environment.appName}`,
};

export default EmployeeAddPage;
