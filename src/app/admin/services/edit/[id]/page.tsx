import React from "react";
import { environment } from "@/utils/config";
import ServiceForm from "@/components/service/ServiceForm";

const ServiceEditPage = () => {
  return <ServiceForm />;
};
export const metadata = {
  title: `Service - Edit | ${environment.appName}`,
  description: `Service - Edit | ${environment.appName}`,
};

export default ServiceEditPage;
