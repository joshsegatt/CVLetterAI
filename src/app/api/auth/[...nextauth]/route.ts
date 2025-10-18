import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

const authOptions: NextAuthOptions = {
  // Use adapter only if DATABASE_URL is available
  ...(process.env.DATABASE_URL ? { adapter: PrismaAdapter(prisma) } : {}),
  providers: [
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

        try {
          // If database is available, use it
          if (process.env.DATABASE_URL) {
            // Check if user exists in database
            const existingUser = await prisma.user.findUnique({
              where: { email: credentials.email.toLowerCase() }
            });

            if (existingUser) {
              // For simplicity, accept any password for existing users
              // In production, you should hash passwords and compare
              return {
                id: existingUser.id,
                email: existingUser.email,
                name: existingUser.name,
                image: existingUser.image,
              };
            } else {
              // Create new user if doesn't exist
              const newUser = await prisma.user.create({
                data: {
                  email: credentials.email.toLowerCase(),
                  name: credentials.email.split('@')[0],
                }
              });

              return {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                image: newUser.image,
              };
            }
          } else {
            // Fallback without database - just validate credentials format
            if (credentials.email && credentials.password.length >= 6) {
              return {
                id: credentials.email,
                email: credentials.email,
                name: credentials.email.split('@')[0],
                image: null,
              };
            }
          }
        } catch (error) {
          console.error('Auth error:', error);
          // Fallback without database
          if (credentials.email && credentials.password.length >= 6) {
            return {
              id: credentials.email,
              email: credentials.email,
              name: credentials.email.split('@')[0],
              image: null,
            };
          }
        }
        return null;
      }
    }),
    
    // Google Provider - only if properly configured
    ...(process.env.GOOGLE_CLIENT_ID && 
        process.env.GOOGLE_CLIENT_SECRET && 
        process.env.GOOGLE_CLIENT_ID !== "seu_google_client_id_aqui"
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code",
              scope: "openid email profile"
            }
          },
          httpOptions: {
            timeout: 40000,
          }
        })]
      : []
    ),

    // GitHub Provider - only if properly configured
    ...(process.env.GITHUB_CLIENT_ID && 
        process.env.GITHUB_CLIENT_SECRET && 
        process.env.GITHUB_CLIENT_ID !== "seu_github_client_id_aqui"
      ? [GitHubProvider({
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        })]
      : []
    )
  ],
  
  session: {
    strategy: process.env.DATABASE_URL ? 'database' : 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  pages: {
    signIn: '/sign-in',
    error: '/sign-in'
  },
  
  callbacks: {
    async jwt({ token, user, account }) {
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
    },
    
    async signIn({ user, account, profile }) {
      try {
        // Allow all sign-ins for now
        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      }
    },
    
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    }
  },
  
  events: {
    async signIn({ user, account, profile }) {
      console.log('User signed in:', { user: user.email, provider: account?.provider });
    },
    async signOut({ session, token }) {
      console.log('User signed out');
    }
  },
  
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
