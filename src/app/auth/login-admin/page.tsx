import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import AuthRoutes from "@/components/routes/AuthRoutes";
const AdminLoginPage = () => {
  return (
    <AuthRoutes>
      <LoginForm userType="admin" />
    </AuthRoutes>
  );
};
export default AdminLoginPage;
