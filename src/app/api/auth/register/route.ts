import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validations/auth';
import { PasswordUtils, SecurityUtils } from '@/lib/security/auth-utils';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { getClientIp } from '@/lib/security/environment';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  console.log('[DEBUG] Registration request started');
  
  try {
    const clientIp = getClientIp(request);
    console.log('[DEBUG] Client IP:', clientIp);
    
    // Rate limiting - 15 registration attempts per 15 minutes per IP (more lenient)
    const rateLimitResult = await checkRateLimit(
      clientIp,
      '/api/auth/register',
      { requests: 15, window: 900000 }
    );

    if (!rateLimitResult.success) {
      console.log('[DEBUG] Rate limit exceeded for IP:', clientIp);
      return NextResponse.json(
        { 
          success: false,
          error: 'Too many registration attempts. Please try again later.',
          resetTime: rateLimitResult.resetTime 
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    console.log('[DEBUG] Parsing request body...');
    const body = await request.json();
    console.log('[DEBUG] Request body received:', Object.keys(body));
    
    // Validate input data
    console.log('[DEBUG] Validating data with schema...');
    const validatedData = registerSchema.parse(body) as any;
    console.log('[DEBUG] Data validation successful');
    
    // Additional security check on email domain (optional)
    const emailDomain = validatedData.email.split('@')[1].toLowerCase();
    const blockedDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
    if (blockedDomains.includes(emailDomain)) {
      console.log('[DEBUG] Blocked email domain:', emailDomain);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please use a valid email address.' 
        },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    console.log('[DEBUG] Checking for existing user...');
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username || undefined },
        ],
      },
    });
    
    if (existingUser) {
      console.log('[DEBUG] User already exists:', existingUser.email);
      if (existingUser.email === validatedData.email) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'An account with this email already exists. Please use a different email or sign in.' 
          },
          { status: 400 }
        );
      }
      
      if (existingUser.username === validatedData.username) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'This username is already taken. Please choose a different username.' 
          },
          { status: 400 }
        );
      }
    }
    
    // Hash the password securely
    console.log('[DEBUG] Hashing password...');
    const hashedPassword = await PasswordUtils.hashPassword(validatedData.password);
    console.log('[DEBUG] Password hashed successfully');
    
    // Use provided username
    const username = validatedData.username;
    
    // Create new user
    console.log('[DEBUG] Creating user in database...');
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        username: username,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        password: hashedPassword,
        plan: 'free',
        isActive: true,
        isEmailVerified: false, // Will be verified later
        lastLoginAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        name: true,
        plan: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });
    
    console.log('[DEBUG] User created successfully:', user.id);
    
    // Log successful registration (without sensitive data)
    console.log(`[AUTH] New user registered: ${user.email} (${user.username}) from IP: ${clientIp}`);
    
    return NextResponse.json({
      success: true,
      message: 'Account created successfully! You can now sign in.',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        plan: user.plan,
      },
    });
    
  } catch (error: any) {
    console.error('[AUTH] Registration error:', error);
    console.error('[AUTH] Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack?.substring(0, 500)
    });
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      console.log('[DEBUG] Validation error:', firstError);
      return NextResponse.json(
        { 
          success: false, 
          error: firstError.message,
          field: firstError.path.join('.'),
        },
        { status: 400 }
      );
    }
    
    // Handle Prisma errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      console.log('[DEBUG] Unique constraint error');
      return NextResponse.json(
        { 
          success: false, 
          error: 'An account with this email or username already exists.' 
        },
        { status: 400 }
      );
    }
    
    // Handle database connection errors
    if (error.code === 'P1001' || error.code === 'P1017') {
      console.error('[DEBUG] Database connection error:', error.code);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection failed. Please try again in a moment.' 
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Something went wrong during registration. Please try again.',
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
