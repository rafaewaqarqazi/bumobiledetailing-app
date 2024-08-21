import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import AuthRoutes from "@/components/routes/AuthRoutes";
import { environment } from "@/utils/config";
const AdminLoginPage = () => {
  return (
    <AuthRoutes>
      <LoginForm userType="admin" />
    </AuthRoutes>
  );
};
export const metadata = {
  title: `SignIn Admin | ${environment.appName}`,
  description: `SignIn Admin | ${environment.appName}`,
};

export default AdminLoginPage;
