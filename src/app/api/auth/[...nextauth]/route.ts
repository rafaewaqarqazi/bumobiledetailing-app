import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { environment } from "@/utils/config";
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "text" },
        remember: { label: "Remember", type: "boolean" },
      },
      async authorize(credentials) {
        try {
          const baseURL = `${environment.apiURL}/auth/login`;
          const url =
            credentials?.userType === "admin"
              ? `${baseURL}-admin`
              : credentials?.userType === "employee"
                ? `${baseURL}-employee`
                : baseURL;

          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
              remember: credentials?.remember,
            }),
          });
          if (!res.ok) {
            const error = await res.json();
            throw new Error(error?.message || "Unable to login");
          }
          const user = await res.json();
          if (user?.data) {
            return user?.data;
          } else {
            return null;
          }
        } catch (e: any) {
          throw new Error(e);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
