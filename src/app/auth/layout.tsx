import React from "react";
import AuthLayout from "@/components/layouts/AuthLayout";

const AuthLayoutPage = ({ children }: React.PropsWithChildren) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default AuthLayoutPage;
