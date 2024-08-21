import React from "react";
import ResetPassword from "@/components/auth/ResetPassword";
import { environment } from "@/utils/config";

const ResetPasswordPage = () => <ResetPassword />;
export const metadata = {
  title: `Reset Password | ${environment.appName}`,
  description: `Reset Password | ${environment.appName}`,
};

export default ResetPasswordPage;
