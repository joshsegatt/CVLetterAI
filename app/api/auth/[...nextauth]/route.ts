import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error('Google OAuth environment variables are not configured');
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId,
      clientSecret
    })
  ],
  session: {
    strategy: 'jwt' as const
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
