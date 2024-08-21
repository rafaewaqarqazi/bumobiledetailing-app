import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import AuthRoutes from "@/components/routes/AuthRoutes";
import { environment } from "@/utils/config";
const Login = () => {
  return (
    <AuthRoutes>
      <LoginForm userType="customer" />
    </AuthRoutes>
  );
};
export const metadata = {
  title: `SignIn | ${environment.appName}`,
  description: `SignIn | ${environment.appName}`,
};

export default Login;
