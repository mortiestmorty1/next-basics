import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import type { User } from '@/app/lib/definitions';

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

async function getUser(email: string): Promise<User | undefined> {
  const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
  return user[0];
}

export const authConfig = {
  secret: process.env.AUTH_SECRET, // ✅ add this line
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await getUser(email);
        if (!user) return null;

        const match = await bcrypt.compare(password, user.password);
        if (!match) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard && !isLoggedIn) return false;
      if (!isOnDashboard && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
