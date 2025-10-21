import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validations/auth';
import { PasswordUtils, SecurityUtils } from '@/lib/security/auth-utils';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { getClientIp } from '@/lib/security/environment';
import { authLogger, generateRequestId } from '@/lib/security/auth-logger';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const startTime = Date.now();
  const clientIp = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || undefined;
  
  console.log(`[REGISTRATION-${requestId}] Starting registration process`);
  authLogger.log('info', 'REGISTRATION_REQUEST', { requestId, ip: clientIp, userAgent });
  
  try {
    console.log(`[REGISTRATION-${requestId}] Client IP: ${clientIp}`);
    authLogger.registrationStarted(requestId, {}, clientIp, userAgent);
    
    // More lenient rate limiting - 20 registration attempts per 15 minutes per IP
    const rateLimitResult = await checkRateLimit(
      clientIp,
      '/api/auth/register',
      { requests: 20, window: 900000 }
    );

    if (!rateLimitResult.success) {
      console.log(`[REGISTRATION-${requestId}] Rate limit exceeded for IP: ${clientIp}`);
      authLogger.rateLimitExceeded(clientIp, '/api/auth/register', 20, 900000);
      return NextResponse.json(
        { 
          success: false,
          error: 'Too many registration attempts from this IP. Please try again in 15 minutes.',
          resetTime: rateLimitResult.resetTime,
          remaining: rateLimitResult.remaining
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    console.log(`[REGISTRATION-${requestId}] Parsing request body...`);
    const body = await request.json();
    console.log(`[REGISTRATION-${requestId}] Request body keys:`, Object.keys(body));
    console.log(`[REGISTRATION-${requestId}] Full payload:`, {
      ...body,
      password: '[HIDDEN]',
      confirmPassword: '[HIDDEN]'
    });
    
    authLogger.registrationStarted(requestId, body, clientIp, userAgent);
    
    // Validate input data with detailed error reporting
    console.log(`[REGISTRATION-${requestId}] Validating data with schema...`);
    let validatedData;
    try {
      validatedData = registerSchema.parse(body);
      console.log(`[REGISTRATION-${requestId}] Data validation successful`);
    } catch (validationError: any) {
      console.log(`[REGISTRATION-${requestId}] Validation failed:`, validationError.errors);
      const duration = Date.now() - startTime;
      authLogger.registrationFailed(requestId, validationError, body, clientIp, duration);
      
      if (validationError instanceof z.ZodError) {
        const firstError = validationError.errors[0];
        return NextResponse.json(
          { 
            success: false, 
            error: firstError.message,
            field: firstError.path.join('.'),
            details: validationError.errors
          },
          { status: 400 }
        );
      }
      throw validationError;
    }

    // Additional security check on email domain (optional)
    const emailDomain = validatedData.email.split('@')[1].toLowerCase();
    const blockedDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
    if (blockedDomains.includes(emailDomain)) {
      console.log(`[REGISTRATION-${requestId}] Blocked email domain: ${emailDomain}`);
      const duration = Date.now() - startTime;
      authLogger.registrationFailed(requestId, new Error('Blocked email domain'), validatedData, clientIp, duration);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please use a valid email address from a supported provider.' 
        },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    console.log(`[REGISTRATION-${requestId}] Checking for existing user...`);
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username },
        ],
      },
      select: {
        id: true,
        email: true,
        username: true
      }
    });
    
    if (existingUser) {
      console.log(`[REGISTRATION-${requestId}] User already exists:`, {
        email: existingUser.email,
        username: existingUser.username
      });
      
      const duration = Date.now() - startTime;
      authLogger.registrationFailed(requestId, new Error('User already exists'), validatedData, clientIp, duration);
      
      if (existingUser.email === validatedData.email) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'An account with this email already exists. Please use a different email or sign in.',
            field: 'email'
          },
          { status: 400 }
        );
      }
      
      if (existingUser.username === validatedData.username) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'This username is already taken. Please choose a different username.',
            field: 'username'
          },
          { status: 400 }
        );
      }
    }

    // Hash the password securely
    console.log(`[REGISTRATION-${requestId}] Hashing password...`);
    const hashedPassword = await PasswordUtils.hashPassword(validatedData.password);
    console.log(`[REGISTRATION-${requestId}] Password hashed successfully`);
    
    // Create new user with comprehensive data
    console.log(`[REGISTRATION-${requestId}] Creating user in database...`);
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        username: validatedData.username,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        password: hashedPassword,
        plan: 'free',
        isActive: true,
        isEmailVerified: false, // Will be verified later
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
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
    
    console.log(`[REGISTRATION-${requestId}] User created successfully:`, {
      id: user.id,
      email: user.email,
      username: user.username
    });
    
    // Reset rate limit for this IP after successful registration
    try {
      // This effectively resets the rate limit counter for successful registration
      await checkRateLimit(clientIp, '/api/auth/register-success', { requests: 1, window: 1 });
    } catch (error) {
      // Ignore rate limit reset errors, not critical
      console.log(`[REGISTRATION-${requestId}] Rate limit reset failed (non-critical):`, error);
    }
    
    const duration = Date.now() - startTime;
    authLogger.registrationSuccess(requestId, user, clientIp, duration);
    
    // Log successful registration (without sensitive data)
    console.log(`[REGISTRATION-${requestId}] ✅ Registration completed successfully for: ${user.email} (${user.username}) from IP: ${clientIp}`);
    
    return NextResponse.json({
      success: true,
      message: 'Account created successfully! You can now sign in.',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        plan: user.plan,
        isEmailVerified: user.isEmailVerified,
      },
      requestId
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[REGISTRATION-${requestId}] ❌ Registration error:`, {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack?.substring(0, 500)
    });
    
    authLogger.registrationFailed(requestId, error, undefined, clientIp, duration);
    
    // Handle validation errors (already handled above, but safety net)
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      console.log(`[REGISTRATION-${requestId}] Schema validation error:`, firstError);
      return NextResponse.json(
        { 
          success: false, 
          error: firstError.message,
          field: firstError.path.join('.'),
        },
        { status: 400 }
      );
    }
    
    // Handle Prisma unique constraint violations
    if (error.code === 'P2002') {
      console.log(`[REGISTRATION-${requestId}] Unique constraint violation:`, error.meta);
      const field = error.meta?.target?.[0];
      
      if (field === 'email') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'An account with this email already exists. Please use a different email or sign in.',
            field: 'email'
          },
          { status: 400 }
        );
      }
      
      if (field === 'username') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'This username is already taken. Please choose a different username.',
            field: 'username'
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'An account with these details already exists.' 
        },
        { status: 400 }
      );
    }
    
    // Handle database connection errors
    if (error.code === 'P1001' || error.code === 'P1017') {
      console.error(`[REGISTRATION-${requestId}] Database connection error:`, error.code);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection failed. Please try again in a moment.' 
        },
        { status: 503 }
      );
    }
    
    // Handle password hashing errors
    if (error.message.includes('Password hashing failed')) {
      console.error(`[REGISTRATION-${requestId}] Password hashing error`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Password processing failed. Please try again.' 
        },
        { status: 500 }
      );
    }
    
    // Generic error response
    return NextResponse.json(
      { 
        success: false, 
        error: 'Registration failed. Please check your details and try again.',
        debug: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          code: error.code,
          requestId
        } : undefined
      },
      { status: 500 }
    );
  }
}
