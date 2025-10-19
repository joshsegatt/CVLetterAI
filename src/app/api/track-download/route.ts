import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Get user from token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { type } = await request.json(); // 'cv' or 'letter'

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: token.id as string },
      select: {
        id: true,
        plan: true,
        downloadsUsed: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has reached limit
    const FREE_DOWNLOAD_LIMIT = 3;
    
    if (user.plan === 'free' && user.downloadsUsed >= FREE_DOWNLOAD_LIMIT) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Download limit reached',
          requiresUpgrade: true,
          used: user.downloadsUsed,
          limit: FREE_DOWNLOAD_LIMIT
        },
        { status: 403 }
      );
    }

    // Increment download count for free users
    if (user.plan === 'free') {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          downloadsUsed: {
            increment: 1
          }
        },
      });
    }

    // Track download in usage analytics
    await prisma.aiUsage.create({
      data: {
        userId: user.id,
        model: 'download',
        tokensInput: 0,
        tokensOutput: 0,
        endpoint: `download-${type}`,
        success: true,
        responseTime: 0,
      },
    });

    return NextResponse.json({
      success: true,
      downloadsUsed: user.plan === 'free' ? user.downloadsUsed + 1 : 0,
      limit: user.plan === 'free' ? FREE_DOWNLOAD_LIMIT : -1,
      plan: user.plan
    });

  } catch (error) {
    console.error('Download tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
