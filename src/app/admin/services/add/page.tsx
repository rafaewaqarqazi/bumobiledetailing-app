import React from "react";
import { environment } from "@/utils/config";
import ServiceForm from "@/components/service/ServiceForm";

const ServiceAddPage = () => {
  return <ServiceForm />;
};
export const metadata = {
  title: `Service - Add | ${environment.appName}`,
  description: `Service - Add | ${environment.appName}`,
};

export default ServiceAddPage;
