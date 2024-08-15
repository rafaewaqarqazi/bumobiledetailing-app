import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import AuthRoutes from "@/components/routes/AuthRoutes";
const Login = () => {
  return (
    <AuthRoutes>
      <LoginForm userType="customer" />
    </AuthRoutes>
  );
};
export default Login;
