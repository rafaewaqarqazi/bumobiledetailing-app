import React from "react";
import ForgotPassword from "@/components/auth/ForgotPassword";
import { environment } from "@/utils/config";

const ForgotPasswordPage = () => <ForgotPassword />;

export const metadata = {
  title: `Forgot Password | ${environment.appName}`,
  description: `Forgot Password | ${environment.appName}`,
};

export default ForgotPasswordPage;
