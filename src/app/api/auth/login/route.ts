import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit } from '@/lib/security/rate-limit';
import { getClientIP } from '@/lib/environment';

// Validation schema
const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
  callbackUrl: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIP(req);
    
    // Apply rate limiting (5 attempts per 15 minutes)
    const rateLimitResult = await rateLimit(
      `login:${clientIp}`,
      5, // 5 attempts
      15 * 60 // 15 minutes
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many login attempts. Please try again later.',
          retryAfter: rateLimitResult.retryAfter,
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await req.json();
    const validatedData = loginSchema.parse(body);

    // Since NextAuth.js handles the actual authentication in the authorize callback,
    // this endpoint is primarily for rate limiting and validation
    // The actual sign-in should be handled by NextAuth's signIn function on the client

    return NextResponse.json({
      success: true,
      message: 'Validation passed. Use NextAuth signIn method to complete authentication.',
      remainingAttempts: rateLimitResult.remaining,
    });

  } catch (error) {
    console.error('Login API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method to check login rate limits
export async function GET(req: NextRequest) {
  try {
    const clientIp = getClientIP(req);
    
    // Check current rate limit status
    const rateLimitResult = await rateLimit(
      `login:${clientIp}`,
      5, // 5 attempts
      15 * 60, // 15 minutes
      true // Check only, don't increment
    );

    return NextResponse.json({
      remaining: rateLimitResult.remaining,
      resetTime: rateLimitResult.resetTime,
      isBlocked: !rateLimitResult.success,
    });

  } catch (error) {
    console.error('Login rate limit check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
