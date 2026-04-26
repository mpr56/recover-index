import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID     ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),

    // ── Debug credentials login ───────────────────────────────────────────
    // Set DEBUG_EMAIL and DEBUG_PASSWORD in Railway env vars.
    // Remove those vars to disable this provider in production.
    CredentialsProvider({
      id:   'debug-credentials',
      name: 'Debug',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validEmail    = process.env.DEBUG_EMAIL;
        const validPassword = process.env.DEBUG_PASSWORD;

        // If vars aren't set, this provider is effectively disabled
        if (!validEmail || !validPassword) return null;

        if (
          credentials?.email    === validEmail &&
          credentials?.password === validPassword
        ) {
          return {
            id:    'debug-user',
            email: validEmail,
            name:  'Debug User',
          };
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token }) {
      if (!token.userId) {
        token.userId = token.sub ?? token.email ?? '';
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId as string;
      return session;
    },
  },
  pages: { signIn: '/auth/login' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET ?? 'recoveryindex-dev-secret-change-in-prod',
};

export default NextAuth(authOptions);