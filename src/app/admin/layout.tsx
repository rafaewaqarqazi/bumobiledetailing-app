import React from "react";
import AdminRoutes from "@/components/routes/AdminRoutes";
import AdminLayout from "@/components/layouts/AdminLayout";

const AdminLayoutPage = ({ children }: React.PropsWithChildren) => {
  return (
    <AdminRoutes>
      <AdminLayout>{children}</AdminLayout>
    </AdminRoutes>
  );
};

export default AdminLayoutPage;
