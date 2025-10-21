import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const logoutId = Date.now();
  console.log(`[LOGOUT-${logoutId}] Processing logout request`);
  
  try {
    // Get session if available
    const session = await getServerSession();
    
    if (session?.user) {
      console.log(`[LOGOUT-${logoutId}] Logging out user: ${session.user.email}`);
      
      // Update last logout time (optional - we could add this field to schema later)
      try {
        await prisma.user.update({
          where: { id: (session.user as any).id },
          data: { updatedAt: new Date() },
        });
        console.log(`[LOGOUT-${logoutId}] User logout timestamp updated`);
      } catch (dbError) {
        console.log(`[LOGOUT-${logoutId}] Database update failed (non-critical):`, dbError);
      }
    } else {
      console.log(`[LOGOUT-${logoutId}] No active session found`);
    }
    
    console.log(`[LOGOUT-${logoutId}] ✅ Logout processed successfully`);
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
      logoutId
    });
    
  } catch (error: any) {
    console.error(`[LOGOUT-${logoutId}] ❌ Logout error:`, error);
    
    return NextResponse.json({
      success: false,
      error: 'Logout failed',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}