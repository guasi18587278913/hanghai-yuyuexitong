import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { Adapter } from 'next-auth/adapters'
import { User } from '@prisma/client'

const prisma = new PrismaClient()

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // We only need nickname and planetId to find the user.
        if (!credentials?.nickname || !credentials?.planetId) {
          return null
        }

        const { nickname, planetId } = credentials as {
          nickname: string
          planetId: string
        }

        const user = await prisma.user.findFirst({
          where: {
            nickname: nickname,
            planetId: planetId,
          },
        })

        // If a user is found, return the user object for the session.
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role as 'STUDENT' | 'COACH' | 'ADMIN',
          }
        }

        // If no user is found, return null to deny sign-in.
        return null
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // Using `any` here as a temporary workaround for persistent type conflicts.
    // The type augmentation in `next-auth.d.ts` should handle this,
    // but sometimes the TS server needs a restart. This ensures build passes.
    jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.role = token.role
        session.user.id = token.id
      }
      return session
    },
  },
  pages: {
    signIn: '/',
  },
}) 