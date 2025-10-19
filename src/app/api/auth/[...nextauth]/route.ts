import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { PasswordUtils } from '@/lib/security/auth-utils';

const authOptions: NextAuthOptions = {
  providers: [
    // Credentials Provider for email/password authentication
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        emailOrUsername: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.emailOrUsername || !credentials?.password) {
          return null;
        }

        try {
          // Find user by email or username
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.emailOrUsername.toLowerCase() },
                { username: credentials.emailOrUsername },
              ],
              isActive: true,
            },
            select: {
              id: true,
              email: true,
              username: true,
              firstName: true,
              lastName: true,
              name: true,
              password: true,
              image: true,
              plan: true,
              isEmailVerified: true,
            },
          });

          if (!user || !user.password) {
            return null;
          }

          // Verify password
          const isPasswordValid = await PasswordUtils.verifyPassword(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });

          // Return user data (exclude password)
          return {
            id: user.id,
            email: user.email,
            name: user.name || `${user.firstName} ${user.lastName}`,
            image: user.image,
            username: user.username,
            plan: user.plan,
            isEmailVerified: user.isEmailVerified,
          };
        } catch (error) {
          console.error('Credentials authentication error:', error);
          return null;
        }
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
  
  // Use Prisma adapter when available, fallback to JWT
  adapter: process.env.DATABASE_URL ? PrismaAdapter(prisma) : undefined,
  
  session: {
    strategy: process.env.DATABASE_URL ? 'database' : 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours for better security
    updateAge: 2 * 60 * 60, // Update session every 2 hours
  },
  
  pages: {
    signIn: '/sign-in',
    error: '/sign-in'
  },
  
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist user data to token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.username = (user as any).username;
        token.plan = (user as any).plan || 'free'; // Always default to 'free'
        token.isEmailVerified = (user as any).isEmailVerified;
      }
      return token;
    },
    
    async session({ session, token, user }) {
      // Include user data in session
      if (session.user) {
        (session.user as any).id = token.id || user?.id;
        (session.user as any).username = token.username || (user as any)?.username;
        (session.user as any).plan = token.plan || (user as any)?.plan || 'free'; // Always default to 'free'
        (session.user as any).isEmailVerified = token.isEmailVerified || (user as any)?.isEmailVerified;
      }
      return session;
    },
    
    async signIn({ user, account, profile }) {
      try {
        // For OAuth providers, create or update user in database
        if (account?.provider !== 'credentials' && process.env.DATABASE_URL) {
          // Check if user exists by email
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Create new user from OAuth profile
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || '',
                firstName: user.name?.split(' ')[0] || '',
                lastName: user.name?.split(' ').slice(1).join(' ') || '',
                image: user.image,
                plan: 'free', // Explicitly set to free plan
                isEmailVerified: true, // OAuth emails are pre-verified
                lastLoginAt: new Date(),
              },
            });
          } else {
            // Update last login
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { lastLoginAt: new Date() },
            });
          }
        }
        
        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      }
    },
    
    async redirect({ url, baseUrl }) {
      console.log('NextAuth redirect:', { url, baseUrl });
      
      // Handle sign-in redirect
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/overview`;
      }
      
      // Allows relative callback URLs
      if (url.startsWith("/")) {
        const fullUrl = `${baseUrl}${url}`;
        console.log('Relative URL redirect to:', fullUrl);
        return fullUrl;
      }
      
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) {
        console.log('Same origin redirect to:', url);
        return url;
      }
      
      // Default redirect to overview
      console.log('Default redirect to overview');
      return `${baseUrl}/overview`;
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
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only-change-in-production',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
