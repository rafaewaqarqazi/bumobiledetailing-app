import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import AuthRoutes from "@/components/routes/AuthRoutes";
const EmployeeLoginPage = () => {
  return (
    <AuthRoutes>
      <LoginForm userType="employee" />
    </AuthRoutes>
  );
};
export default EmployeeLoginPage;
