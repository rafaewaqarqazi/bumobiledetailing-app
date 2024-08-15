import NextAuth from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/actions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
