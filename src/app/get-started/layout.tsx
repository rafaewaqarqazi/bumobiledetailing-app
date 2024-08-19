import React from "react";
import AuthLayout from "@/components/layouts/AuthLayout";

const GetStartedLayout = ({ children }: React.PropsWithChildren) => {
  return <AuthLayout maxWidth="max-w-xl">{children}</AuthLayout>;
};

export default GetStartedLayout;
