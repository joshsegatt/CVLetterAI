import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validations/auth';
import { PasswordUtils, TokenUtils } from '@/lib/security/auth-utils';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    // Validate input data
    const validatedData = loginSchema.parse(body);
    
    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.emailOrUsername.toLowerCase() },
          { username: validatedData.emailOrUsername },
        ],
        isActive: true, // Only allow active users to login
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        name: true,
        password: true,
        plan: true,
        planExpiresAt: true,
        isEmailVerified: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
    
    if (!user || !user.password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email/username or password. Please check your credentials and try again.' 
        },
        { status: 401 }
      );
    }
    
    // Verify password
    const isPasswordValid = await PasswordUtils.verifyPassword(
      validatedData.password, 
      user.password
    );
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email/username or password. Please check your credentials and try again.' 
        },
        { status: 401 }
      );
    }
    
    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    
    // Generate tokens
    const accessToken = TokenUtils.generateAccessToken({
      userId: user.id,
      email: user.email,
    });
    
    const refreshToken = TokenUtils.generateRefreshToken({
      userId: user.id,
    });
    
    // Prepare user data (exclude password)
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      plan: user.plan,
      planExpiresAt: user.planExpiresAt,
      isEmailVerified: user.isEmailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
    
    // Set secure HTTP-only cookies for tokens
    const response = NextResponse.json({
      success: true,
      message: 'Login successful! Welcome back.',
      user: userData,
      accessToken, // Also include in response for client-side usage
    });
    
    // Set cookies with appropriate security settings
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };
    
    // Access token cookie (24 hours)
    response.cookies.set('cvletterai-access-token', accessToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60, // 24 hours
    });
    
    // Refresh token cookie (7 days) - only if "Remember me" is checked
    if (validatedData.rememberMe) {
      response.cookies.set('cvletterai-refresh-token', refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }
    
    // Log successful login
    console.log(`[AUTH] User signed in: ${user.email} (${user.username})`);
    
    return response;
    
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    
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
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Something went wrong during login. Please try again.' 
      },
      { status: 500 }
    );
  }
}

// Handle user logout
export async function DELETE(request: NextRequest) {
  try {
    // Clear authentication cookies
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully.',
    });
    
    // Clear cookies
    response.cookies.delete('cvletterai-access-token');
    response.cookies.delete('cvletterai-refresh-token');
    
    return response;
    
  } catch (error) {
    console.error('[AUTH] Logout error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Something went wrong during logout.' 
      },
      { status: 500 }
    );
  }
}