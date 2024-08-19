import React from "react";
import AuthLayout from "@/components/layouts/AuthLayout";

const GetStartedLayout = ({ children }: React.PropsWithChildren) => {
  return <AuthLayout size="xl">{children}</AuthLayout>;
};

export default GetStartedLayout;
