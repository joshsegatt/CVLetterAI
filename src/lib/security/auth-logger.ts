/**
 * Enhanced Authentication Logger
 * Centralized logging system for authentication events with detailed tracking
 */

type LogLevel = 'info' | 'warn' | 'error' | 'success' | 'debug';

interface AuthLogEntry {
  timestamp: string;
  level: LogLevel;
  event: string;
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  requestId?: string;
  duration?: number;
  payload?: any;
  error?: any;
  metadata?: any;
}

class AuthLogger {
  private static instance: AuthLogger;
  private logs: AuthLogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  private constructor() {}

  static getInstance(): AuthLogger {
    if (!AuthLogger.instance) {
      AuthLogger.instance = new AuthLogger();
    }
    return AuthLogger.instance;
  }

  private formatLog(entry: AuthLogEntry): string {
    const timestamp = entry.timestamp;
    const level = entry.level.toUpperCase().padEnd(7);
    const event = entry.event.padEnd(25);
    const requestId = entry.requestId ? `[${entry.requestId}]` : '';
    const user = entry.email || entry.userId || 'anonymous';
    const duration = entry.duration ? ` (${entry.duration}ms)` : '';
    
    return `${timestamp} ${level} ${event} ${requestId} ${user}${duration}`;
  }

  log(level: LogLevel, event: string, data: Partial<AuthLogEntry> = {}) {
    const entry: AuthLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      event,
      ...data
    };

    // Add to memory store
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output with formatting
    const formattedLog = this.formatLog(entry);
    
    switch (level) {
      case 'error':
        console.error('🔴', formattedLog);
        if (entry.error) {
          console.error('   Error details:', entry.error);
        }
        if (entry.payload) {
          console.error('   Payload:', this.sanitizePayload(entry.payload));
        }
        break;
      case 'warn':
        console.warn('🟡', formattedLog);
        break;
      case 'success':
        console.log('🟢', formattedLog);
        break;
      case 'info':
        console.log('🔵', formattedLog);
        break;
      case 'debug':
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍', formattedLog);
          if (entry.metadata) {
            console.log('   Debug data:', entry.metadata);
          }
        }
        break;
      default:
        console.log('⚪', formattedLog);
    }
  }

  private sanitizePayload(payload: any): any {
    if (!payload || typeof payload !== 'object') {
      return payload;
    }

    const sanitized = { ...payload };
    const sensitiveFields = ['password', 'confirmPassword', 'token', 'secret'];
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[HIDDEN]';
      }
    }
    
    return sanitized;
  }

  // Specific authentication event loggers
  registrationStarted(requestId: string, payload: any, ip?: string, userAgent?: string) {
    this.log('info', 'REGISTRATION_STARTED', {
      requestId,
      ip,
      userAgent,
      payload: this.sanitizePayload(payload)
    });
  }

  registrationSuccess(requestId: string, user: any, ip?: string, duration?: number) {
    this.log('success', 'REGISTRATION_SUCCESS', {
      requestId,
      userId: user.id,
      email: user.email,
      ip,
      duration,
      metadata: { plan: user.plan }
    });
  }

  registrationFailed(requestId: string, error: any, payload?: any, ip?: string, duration?: number) {
    this.log('error', 'REGISTRATION_FAILED', {
      requestId,
      ip,
      duration,
      error: {
        message: error.message,
        code: error.code,
        type: error.constructor.name
      },
      payload: this.sanitizePayload(payload)
    });
  }

  loginStarted(requestId: string, emailOrUsername: string, ip?: string, userAgent?: string) {
    this.log('info', 'LOGIN_STARTED', {
      requestId,
      ip,
      userAgent,
      metadata: { emailOrUsername }
    });
  }

  loginSuccess(requestId: string, user: any, ip?: string, duration?: number) {
    this.log('success', 'LOGIN_SUCCESS', {
      requestId,
      userId: user.id,
      email: user.email,
      ip,
      duration,
      metadata: { plan: user.plan }
    });
  }

  loginFailed(requestId: string, emailOrUsername: string, reason: string, ip?: string, duration?: number) {
    this.log('warn', 'LOGIN_FAILED', {
      requestId,
      ip,
      duration,
      metadata: { emailOrUsername, reason }
    });
  }

  logoutStarted(requestId: string, userId?: string, ip?: string) {
    this.log('info', 'LOGOUT_STARTED', {
      requestId,
      userId,
      ip
    });
  }

  logoutSuccess(requestId: string, userId?: string, ip?: string) {
    this.log('success', 'LOGOUT_SUCCESS', {
      requestId,
      userId,
      ip
    });
  }

  rateLimitExceeded(ip: string, endpoint: string, limit: number, window: number) {
    this.log('warn', 'RATE_LIMIT_EXCEEDED', {
      ip,
      metadata: { endpoint, limit, window }
    });
  }

  securityThreat(type: string, ip: string, details: any) {
    this.log('error', 'SECURITY_THREAT', {
      ip,
      metadata: { type, details }
    });
  }

  // Get logs for debugging/monitoring
  getRecentLogs(limit: number = 50): AuthLogEntry[] {
    return this.logs.slice(-limit);
  }

  getLogsByLevel(level: LogLevel, limit: number = 50): AuthLogEntry[] {
    return this.logs
      .filter(log => log.level === level)
      .slice(-limit);
  }

  getLogsByEvent(event: string, limit: number = 50): AuthLogEntry[] {
    return this.logs
      .filter(log => log.event === event)
      .slice(-limit);
  }

  // Generate summary report
  generateSummary(hours: number = 24): any {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentLogs = this.logs.filter(log => new Date(log.timestamp) > cutoff);

    const summary = {
      timeframe: `Last ${hours} hours`,
      totalEvents: recentLogs.length,
      eventCounts: {} as Record<string, number>,
      levelCounts: {} as Record<LogLevel, number>,
      uniqueIPs: new Set<string>(),
      errors: recentLogs.filter(log => log.level === 'error').length,
      warnings: recentLogs.filter(log => log.level === 'warn').length,
      successes: recentLogs.filter(log => log.level === 'success').length
    };

    recentLogs.forEach(log => {
      summary.eventCounts[log.event] = (summary.eventCounts[log.event] || 0) + 1;
      summary.levelCounts[log.level] = (summary.levelCounts[log.level] || 0) + 1;
      if (log.ip) summary.uniqueIPs.add(log.ip);
    });

    return {
      ...summary,
      uniqueIPCount: summary.uniqueIPs.size,
      uniqueIPs: undefined // Remove Set from output
    };
  }
}

// Export singleton instance
export const authLogger = AuthLogger.getInstance();

// Helper function to generate request IDs
export function generateRequestId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Middleware helper for request logging
export function logRequest(requestId: string, method: string, path: string, ip?: string, userAgent?: string) {
  authLogger.log('debug', 'REQUEST_RECEIVED', {
    requestId,
    metadata: { method, path },
    ip,
    userAgent
  });
}

export default authLogger;