// src/app/api/auth/[...nextauth]/route.ts
import type { NextRequest } from 'next/server';

/**
 * Lazy-initialize NextAuth handler to avoid throwing during module import
 * when environment variables are not present at build-time.
 *
 * Exports GET and POST for the App Router.
 */

type NextAuthHandler = any;

let cachedHandler: NextAuthHandler | null = null;

function envsConfigured(): boolean {
  return Boolean(
    process.env.NEXTAUTH_SECRET &&
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET
  );
}

async function initHandler(): Promise<NextAuthHandler> {
  if (cachedHandler) return cachedHandler;

  // dynamic import so nothing runs at top-level import time
  const NextAuth = (await import('next-auth')).default;
  const GoogleProvider = (await import('next-auth/providers/google')).default;

  const options = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
  };

  cachedHandler = NextAuth(options);
  return cachedHandler;
}

async function handleRequest(req: NextRequest) {
  if (!envsConfigured()) {
    return new Response(
      JSON.stringify({ error: 'Google OAuth environment variables not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const handler = await initHandler();

  // NextAuth returns a Node-style handler (req, res). In the App Router
  // runtime the handler can accept the Request; we call it and return result.
  // Type-cast to any because NextAuth types don't match exact Request signature here.
  const res = (await handler(req as any)) as Response | undefined;

  // If handler returned a Response, return it; otherwise send generic OK.
  if (res instanceof Response) return res;
  return new Response(null, { status: 204 });
}

// Export both GET and POST for next-auth
export async function GET(req: Request) {
  return handleRequest(req as NextRequest);
}
export async function POST(req: Request) {
  return handleRequest(req as NextRequest);
}
