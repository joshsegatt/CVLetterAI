/**
 * Auth Configuration Debug
 * Helps diagnose authentication issues
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const env = {
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
  };

  const authStatus = {
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    config: env,
    googleConfigured: env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET,
    nextAuthConfigured: env.NEXTAUTH_SECRET,
  };

  return NextResponse.json({
    status: 'Auth Debug Info',
    ...authStatus,
    recommendations: {
      googleAuth: env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET 
        ? 'Google OAuth is configured' 
        : 'Google OAuth credentials missing - check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET',
      nextAuth: env.NEXTAUTH_SECRET 
        ? 'NextAuth secret is configured' 
        : 'NEXTAUTH_SECRET is missing - this is required for NextAuth',
      url: env.NEXTAUTH_URL !== 'Not set' 
        ? 'NEXTAUTH_URL is configured' 
        : 'NEXTAUTH_URL should be set for production'
    }
  });
}
