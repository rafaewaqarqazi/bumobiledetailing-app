import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import AuthRoutes from "@/components/routes/AuthRoutes";
import { environment } from "@/utils/config";
const EmployeeLoginPage = () => {
  return (
    <AuthRoutes>
      <LoginForm userType="employee" />
    </AuthRoutes>
  );
};
export const metadata = {
  title: `SignIn Employee | ${environment.appName}`,
  description: `SignIn Employee | ${environment.appName}`,
};

export default EmployeeLoginPage;
