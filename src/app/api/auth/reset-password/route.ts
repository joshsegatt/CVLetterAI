import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PasswordUtils } from '@/lib/security/auth-utils';
import { resetPasswordSchema } from '@/lib/validations/auth';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { getClientIp } from '@/lib/security/environment';

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    
    // Rate limiting - 5 attempts per 15 minutes per IP
    const rateLimitResult = await checkRateLimit(
      clientIp,
      '/api/auth/reset-password',
      { requests: 5, window: 900000 }
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Too many password reset attempts. Please try again later.',
          resetTime: rateLimitResult.resetTime 
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validationResult = resetPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    const { token, password } = validationResult.data;

    // Find and validate reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!resetToken || !resetToken.user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date() > resetToken.expiresAt) {
      // Clean up expired token
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id }
      });
      
      return NextResponse.json(
        { error: 'Reset token has expired. Please request a new password reset.' },
        { status: 400 }
      );
    }

    // Check if user is active
    if (!resetToken.user.isActive) {
      return NextResponse.json(
        { error: 'Account is not active' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await PasswordUtils.hashPassword(password);

    // Update user password and delete reset token in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.user.id },
        data: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id }
      }),
      // Clean up any other reset tokens for this user
      prisma.passwordResetToken.deleteMany({
        where: { userId: resetToken.user.id }
      })
    ]);

    return NextResponse.json({
      message: 'Password has been reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
