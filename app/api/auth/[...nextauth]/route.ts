import type { NextAuthOptions } from 'next-auth';

const missingEnvResponse = new Response(
  JSON.stringify({ error: 'Google OAuth environment variables not configured' }),
  {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  }
);

function loadEnv() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const secret = process.env.NEXTAUTH_SECRET;

  if (!clientId || !clientSecret || !secret) {
    return null;
  }

  return { clientId, clientSecret, secret };
}

async function resolveAuthHandler() {
  const env = loadEnv();
  if (!env) {
    return null;
  }

  const { default: NextAuth } = await import('next-auth/next');
  const { default: GoogleProvider } = await import('next-auth/providers/google');

  const authOptions: NextAuthOptions = {
    providers: [
      GoogleProvider({
        clientId: env.clientId,
        clientSecret: env.clientSecret
      })
    ],
    session: {
      strategy: 'jwt'
    },
    secret: env.secret
  };

  return NextAuth(authOptions) as (
    request: Request,
    context: { params: { nextauth: string[] } }
  ) => Promise<Response>;
}

async function handleAuth(request: Request, context: { params: { nextauth: string[] } }) {
  const handler = await resolveAuthHandler();
  if (!handler) {
    return missingEnvResponse;
  }
  return handler(request, context);
}

export async function GET(request: Request, context: { params: { nextauth: string[] } }) {
  return handleAuth(request, context);
}

export async function POST(request: Request, context: { params: { nextauth: string[] } }) {
  return handleAuth(request, context);
}
