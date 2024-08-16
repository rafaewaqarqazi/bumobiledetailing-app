import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/actions";
import { Roles } from "@/utils/enums";
import { redirect } from "next/navigation";

const AdminRoutes = async ({ children }: React.PropsWithChildren) => {
  const session = await getServerSession(authOptions);
  if (session?.user?.role === Roles.ADMIN) {
    return <> {children} </>;
  } else {
    redirect("/auth/login");
  }
};

export default AdminRoutes;
