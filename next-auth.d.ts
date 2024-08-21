// src/types/next-auth.d.ts or src/@types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** The user's custom property */
      role?: number;
      accessToken?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    /** The user's custom property */
    role?: number;
    accessToken?: string;
  }
}
