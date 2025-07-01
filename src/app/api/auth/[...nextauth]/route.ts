import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        nickname: { label: "Nickname", type: "text", placeholder: "sailing_master" },
        planetId: {  label: "Planet ID", type: "password", placeholder: "9527" }
      },
      async authorize(credentials, req) {
        if (credentials?.nickname === 'sailing_master' && credentials?.planetId === '9527') {
           const user = await prisma.user.upsert({
                where: { nickname: 'sailing_master' },
                update: {},
                create: {
                    nickname: 'sailing_master',
                    planetId: '9527', // In a real app, you should hash this value
                    email: 'sailing_master@example.com', // A dummy unique email
                    name: '航海大师',
                    role: 'COACH'
                }
            });
          return user;
        }
        return null
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 