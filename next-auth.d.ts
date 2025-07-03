import type { DefaultSession, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { Role } from "@prisma/client"
import NextAuth from "next-auth"

// common.d.ts
declare module '@auth/core/types' {
  interface User {
    role?: 'STUDENT' | 'COACH' | 'ADMIN'
  }
  interface Session {
    user?: {
      role?: 'STUDENT' | 'COACH' | 'ADMIN'
    } & DefaultSession['user']
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role?: 'STUDENT' | 'COACH' | 'ADMIN'
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"]
  }
} 