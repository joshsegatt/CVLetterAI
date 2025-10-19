import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getClientIP } from '@/lib/environment';

// Error log validation schema
const errorLogSchema = z.object({
  errorId: z.string().min(1),
  message: z.string().min(1),
  stack: z.string().optional(),
  componentStack: z.string().optional(),
  url: z.string().url(),
  userAgent: z.string().min(1),
  timestamp: z.string().datetime(),
  buildVersion: z.string().optional(),
  userId: z.string().optional(),
  additionalContext: z.record(z.unknown()).optional()
});

interface ErrorLog {
  id: string;
  timestamp: Date;
  level: 'error' | 'warn' | 'info';
  message: string;
  stack?: string;
  context: {
    errorId: string;
    url: string;
    userAgent: string;
    clientIP: string;
    buildVersion?: string;
    userId?: string;
    componentStack?: string;
    additionalContext?: Record<string, unknown>;
  };
}

// In-memory error store (in production, use a database or external service)
const errorLogs: ErrorLog[] = [];
const MAX_LOGS = 1000; // Keep only recent logs in memory

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const body = await request.json();
    
    // Validate the error log data
    const validatedData = errorLogSchema.parse(body);
    
    // Create error log entry
    const errorLog: ErrorLog = {
      id: validatedData.errorId,
      timestamp: new Date(validatedData.timestamp),
      level: 'error',
      message: validatedData.message,
      stack: validatedData.stack,
      context: {
        errorId: validatedData.errorId,
        url: validatedData.url,
        userAgent: validatedData.userAgent,
        clientIP,
        buildVersion: validatedData.buildVersion,
        userId: validatedData.userId,
        componentStack: validatedData.componentStack,
        additionalContext: validatedData.additionalContext
      }
    };

    // Store the error log
    errorLogs.push(errorLog);
    
    // Keep only recent logs to prevent memory issues
    if (errorLogs.length > MAX_LOGS) {
      errorLogs.splice(0, errorLogs.length - MAX_LOGS);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Client Error Logged [${errorLog.id}]`);
      console.error('Message:', errorLog.message);
      console.error('URL:', errorLog.context.url);
      console.error('User Agent:', errorLog.context.userAgent);
      console.error('Client IP:', errorLog.context.clientIP);
      if (errorLog.stack) {
        console.error('Stack:', errorLog.stack);
      }
      if (errorLog.context.componentStack) {
        console.error('Component Stack:', errorLog.context.componentStack);
      }
      console.groupEnd();
    }

    // In production, you would send this to your monitoring service
    // Examples: Sentry, LogRocket, DataDog, etc.
    if (process.env.NODE_ENV === 'production') {
      await sendToMonitoringService(errorLog);
    }

    return NextResponse.json(
      { 
        success: true,
        errorId: errorLog.id,
        message: 'Error logged successfully'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Failed to log client error:', error);
    
    // Don't return detailed error info to client for security
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to log error'
      },
      { status: 500 }
    );
  }
}

/**
 * Get error logs (for development/debugging only)
 */
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Error logs not available in production' },
      { status: 404 }
    );
  }

  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const level = url.searchParams.get('level') as 'error' | 'warn' | 'info' | null;
  
  let filteredLogs = errorLogs;
  
  // Filter by level if specified
  if (level) {
    filteredLogs = errorLogs.filter(log => log.level === level);
  }
  
  // Sort by timestamp (newest first) and limit results
  const recentLogs = filteredLogs
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);

  return NextResponse.json({
    logs: recentLogs,
    total: filteredLogs.length,
    limit,
    level: level || 'all'
  });
}

/**
 * Send error to external monitoring service
 */
async function sendToMonitoringService(errorLog: ErrorLog): Promise<void> {
  try {
    // Example: Send to Sentry, LogRocket, or other monitoring service
    // Replace with your actual monitoring service integration
    
    if (process.env.MONITORING_WEBHOOK_URL) {
      await fetch(process.env.MONITORING_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MONITORING_API_KEY || ''}`
        },
        body: JSON.stringify({
          timestamp: errorLog.timestamp.toISOString(),
          level: errorLog.level,
          message: errorLog.message,
          stack: errorLog.stack,
          context: errorLog.context,
          service: 'cvletterai-frontend',
          environment: process.env.NODE_ENV
        })
      });
    }
  } catch (error) {
    console.error('Failed to send error to monitoring service:', error);
    // Don't throw - we don't want monitoring failures to break error logging
  }
}

/**
 * Clean up old error logs (can be called periodically)
 */
export function cleanupOldLogs(): number {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const initialLength = errorLogs.length;
  
  // Remove logs older than one week
  for (let i = errorLogs.length - 1; i >= 0; i--) {
    if (errorLogs[i].timestamp < oneWeekAgo) {
      errorLogs.splice(i, 1);
    }
  }
  
  return initialLength - errorLogs.length;
}
