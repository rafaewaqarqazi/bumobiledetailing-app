import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/actions";
import { Roles } from "@/utils/enums";
import { redirect } from "next/navigation";

const AdminRoutes = async ({ children }: React.PropsWithChildren) => {
  const session = await getServerSession(authOptions);
  console.log({ session });
  if (session && session?.user?.role === Roles.ADMIN) {
    redirect("/admin/dashboard");
  } else if (session && session?.user?.role === Roles.CUSTOMER) {
    redirect("/dashboard");
  } else if (session && session?.user?.role === Roles.EMPLOYEE) {
    redirect("/user/dashboard");
  } else {
    return <>{children}</>;
  }
};

export default AdminRoutes;
