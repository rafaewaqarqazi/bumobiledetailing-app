import React, { FC, PropsWithChildren } from "react";
import { getServerSession } from "next-auth";
import { Roles } from "@/utils/enums";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/actions";
const AuthLayout: FC<PropsWithChildren> = async ({ children }) => {
  const session = await getServerSession(authOptions);
  console.log({ session });
  if (session && session?.user?.role === Roles.ADMIN) {
    redirect("/");
  } else {
    return (
      <div className="flex flex-col flex-1 justify-center items-center ">
        <div className="max-w-lg w-full">{children}</div>
      </div>
    );
  }
};

export default AuthLayout;
