import React from "react";
import { environment } from "@/utils/config";
import EmployeeForm from "@/components/employee/EmployeeForm";

const EmployeeEditPage = () => {
  return <EmployeeForm />;
};
export const metadata = {
  title: `Employees - Edit | ${environment.appName}`,
  description: `Employees - Edit | ${environment.appName}`,
};

export default EmployeeEditPage;
