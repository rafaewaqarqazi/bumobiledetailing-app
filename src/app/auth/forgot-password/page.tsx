import React from "react";
import ForgotPassword from "@/components/auth/ForgotPassword";

const ForgotPasswordPage = () => <ForgotPassword />;

export async function generateMetadata() {
  return {
    title: `Forgot Password | BU Mobile Detailing`,
    description: `Forgot Password | BU Mobile Detailing`,
  };
}

export default ForgotPasswordPage;
