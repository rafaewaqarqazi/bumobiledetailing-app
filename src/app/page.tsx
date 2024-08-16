import { getServerSession } from "next-auth";
import Main from "@/components/Main";
import { redirect } from "next/navigation";
import { Roles } from "@/utils/enums";
import { authOptions } from "@/app/api/auth/[...nextauth]/actions";
export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role === Roles.CUSTOMER) {
    return <Main />;
  } else {
    if (session?.user?.role === Roles.ADMIN) {
      redirect("/admin/dashboard");
    }
    if (session?.user?.role === Roles.EMPLOYEE) {
      redirect("/employee/dashboard");
    } else {
      redirect("/auth/login");
    }
  }
}
