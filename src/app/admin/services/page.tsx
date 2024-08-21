import React from "react";
import { environment } from "@/utils/config";
import Services from "@/components/service/Services";

const ServicesPage = () => {
  return <Services />;
};
export const metadata = {
  title: `Services | ${environment.appName}`,
  description: `Services | ${environment.appName}`,
};

export default ServicesPage;
