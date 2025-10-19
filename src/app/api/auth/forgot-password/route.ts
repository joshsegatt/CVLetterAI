import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SecurityUtils } from '@/lib/security/auth-utils';
import { forgotPasswordSchema } from '@/lib/validations/auth';
import { checkRateLimit, RATE_LIMITS } from '@/lib/security/rateLimit';
import { getClientIp } from '@/lib/security/environment';

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    
    // Rate limiting - 3 attempts per 5 minutes per IP
    const rateLimitResult = await checkRateLimit(
      clientIp,
      '/api/auth/forgot-password',
      { requests: 3, window: 300000 }
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
    const validationResult = forgotPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true, firstName: true, isActive: true }
    });

    // Always return success to prevent email enumeration
    // But only send email if user exists and is active
    if (user && user.isActive) {
      // Generate secure reset token
      const resetToken = SecurityUtils.generateSecureToken(32);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store reset token in database
      await prisma.passwordResetToken.create({
        data: {
          token: resetToken,
          userId: user.id,
          expiresAt,
        }
      });

      // In a real application, you would send an email here
      // For now, we'll log the reset URL for development
      const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      console.log(`🔗 Password reset URL for ${email}: ${resetUrl}`);
      
      // TODO: Implement email sending
      // await sendPasswordResetEmail(user.email, user.firstName, resetUrl);
    }

    // Always return success response
    return NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
