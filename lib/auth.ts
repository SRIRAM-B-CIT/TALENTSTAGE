/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Safe singleton instantiation of Prisma to avoid multiple active connections in dev mode
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days session
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials. Input complete user identifier properties.");
        }

        const emailOrUser = credentials.email as string;
        const password = credentials.password as string;

        // Perform look-up across either unique emails or unique usernames
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: emailOrUser },
              { username: emailOrUser }
            ]
          }
        });

        if (!user || !user.passwordHash) {
          throw new Error("Account credentials match verification failure.");
        }

        // Secure bcrypt password validation checks
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
          throw new Error("Account credentials match verification failure.");
        }

        // Return core properties mapped to NextAuth Session adapter structures
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar,
          role: user.role,
          username: user.username,
          aiProfileScore: user.aiProfileScore,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.username = (user as any).username;
        token.aiProfileScore = (user as any).aiProfileScore;
      }
      // Support dynamic updates with update() in useSession()
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        session.user.username = token.username as string;
        session.user.aiProfileScore = token.aiProfileScore as number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
