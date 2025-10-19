import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validations/auth';
import { PasswordUtils, SecurityUtils } from '@/lib/security/auth-utils';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { getClientIp } from '@/lib/security/environment';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    
    // Rate limiting - 3 registration attempts per 15 minutes per IP
    const rateLimitResult = await checkRateLimit(
      clientIp,
      '/api/auth/register',
      { requests: 3, window: 900000 }
    );

    if (!rateLimitResult.success) {
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
    const body = await request.json();
    
    // Validate input data
    const validatedData = registerSchema.parse(body);
    
    // Additional security check on email domain (optional)
    const emailDomain = validatedData.email.split('@')[1].toLowerCase();
    const blockedDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
    if (blockedDomains.includes(emailDomain)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please use a valid email address.' 
        },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username || undefined },
        ],
      },
    });
    
    if (existingUser) {
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
    const hashedPassword = await PasswordUtils.hashPassword(validatedData.password);
    
    // Generate username if not provided
    let username = validatedData.username;
    if (!username) {
      const suggestions = SecurityUtils.generateUsernameSuggestions(
        validatedData.firstName, 
        validatedData.lastName, 
        validatedData.email
      );
      
      // Try to find an available username
      for (const suggestion of suggestions) {
        const existingUsername = await prisma.user.findUnique({
          where: { username: suggestion },
        });
        
        if (!existingUsername) {
          username = suggestion;
          break;
        }
      }
      
      // If no suggestion works, generate a random one
      if (!username) {
        username = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      }
    }
    
    // Create new user
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
    
  } catch (error) {
    console.error('[AUTH] Registration error:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
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
      return NextResponse.json(
        { 
          success: false, 
          error: 'An account with this email or username already exists.' 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Something went wrong during registration. Please try again.' 
      },
      { status: 500 }
    );
  }
}
