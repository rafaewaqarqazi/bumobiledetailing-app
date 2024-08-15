import React from "react";
import AuthLayout from "@/components/layouts/AuthLayout";
import AuthRoutes from "@/components/routes/AuthRoutes";

const AuthLayoutPage = ({ children }: React.PropsWithChildren) => {
  return (
    <AuthRoutes>
      <AuthLayout>{children}</AuthLayout>
    </AuthRoutes>
  );
};

export default AuthLayoutPage;
