import type { NextAuthOptions } from 'next-auth';

const missingEnvResponse = new Response(
  JSON.stringify({ error: 'NextAuth environment variables not configured' }),
  {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  }
);

function loadEnv() {
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret) {
    return null;
  }

  return { 
    secret,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET
  };
}

async function resolveAuthHandler() {
  const env = loadEnv();
  if (!env) {
    return null;
  }

  const { default: NextAuth } = await import('next-auth/next');
  const { default: GoogleProvider } = await import('next-auth/providers/google');
  const { default: CredentialsProvider } = await import('next-auth/providers/credentials');

  const providers = [
    // Credentials Provider for email/password
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // For demo purposes, accept any email/password combination
        // In production, validate against your database
        if (credentials.email && credentials.password.length >= 6) {
          return {
            id: credentials.email,
            email: credentials.email,
            name: credentials.email.split('@')[0],
            image: null,
          };
        }

        return null;
      }
    })
  ];

  // Only add Google provider if credentials are available
  if (env.googleClientId && env.googleClientSecret) {
    providers.push(
      GoogleProvider({
        clientId: env.googleClientId,
        clientSecret: env.googleClientSecret
      }) as any
    );
  }

  const authOptions: NextAuthOptions = {
    providers,
    session: {
      strategy: 'jwt'
    },
    secret: env.secret,
    pages: {
      signIn: '/sign-in',
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      async session({ session, token }) {
        if (token && session.user) {
          (session.user as any).id = token.id as string;
        }
        return session;
      }
    }
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
