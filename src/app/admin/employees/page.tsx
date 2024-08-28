import React from "react";
import { environment } from "@/utils/config";
import Employees from "@/components/employee/Employees";

const EmployeesPage = () => {
  return <Employees />;
};
export const metadata = {
  title: `Employees | ${environment.appName}`,
  description: `Employees | ${environment.appName}`,
};

export default EmployeesPage;
