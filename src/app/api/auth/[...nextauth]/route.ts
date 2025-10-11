import NextAuth from 'next-auth/next';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!clientId || !clientSecret || !nextAuthSecret) {
  throw new Error('Missing Google OAuth or NextAuth configuration');
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
  },
  secret: nextAuthSecret
};

interface NextAuthRequestContext {
  params: { nextauth: string[] };
}

const authHandler = NextAuth(authOptions) as (
  request: Request,
  context: NextAuthRequestContext
) => Promise<Response>;

export function GET(request: Request, context: NextAuthRequestContext) {
  return authHandler(request, context);
}

export function POST(request: Request, context: NextAuthRequestContext) {
  return authHandler(request, context);
}
