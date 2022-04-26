import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    slug: string;
  }
  interface Session {
    user: User;
  }
}

export {};
