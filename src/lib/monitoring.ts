/**
 * Production Monitoring and Health Checks
 * Critical for high-traffic environments
 */

import { ProductionCache, CacheKeys, CacheTTL } from './cache';

interface HealthCheck {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  latency?: number;
  message?: string;
  timestamp: number;
}

interface SystemMetrics {
  uptime: number;
  memoryUsage: NodeJS.MemoryUsage;
  cacheStats: any;
  requestCount: number;
  errorCount: number;
  avgResponseTime: number;
  lastHealthCheck: number;
}

declare global {
  var systemMetrics: {
    requestCount: number;
    errorCount: number;
    responseTimes: number[];
    startTime: number;
  } | undefined;
}

export class ProductionMonitoring {
  private static getMetrics() {
    if (!global.systemMetrics) {
      global.systemMetrics = {
        requestCount: 0,
        errorCount: 0,
        responseTimes: [],
        startTime: Date.now()
      };
    }
    return global.systemMetrics;
  }

  static recordRequest(responseTime: number): void {
    const metrics = this.getMetrics();
    metrics.requestCount++;
    metrics.responseTimes.push(responseTime);
    
    // Keep only last 1000 response times
    if (metrics.responseTimes.length > 1000) {
      metrics.responseTimes = metrics.responseTimes.slice(-1000);
    }
  }

  static recordError(): void {
    const metrics = this.getMetrics();
    metrics.errorCount++;
  }

  static async checkDatabaseHealth(): Promise<HealthCheck> {
    const start = Date.now();
    
    try {
      // Try to import and test Prisma connection
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      
      await prisma.$queryRaw`SELECT 1`;
      await prisma.$disconnect();
      
      const latency = Date.now() - start;
      
      return {
        name: 'database',
        status: latency < 100 ? 'healthy' : latency < 500 ? 'warning' : 'error',
        latency,
        message: `Database connection successful (${latency}ms)`,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        name: 'database',
        status: 'error',
        latency: Date.now() - start,
        message: `Database connection failed: ${error}`,
        timestamp: Date.now()
      };
    }
  }

  static async checkAIServiceHealth(): Promise<HealthCheck> {
    const start = Date.now();
    
    try {
      // Test Ollama connection
      const response = await fetch('http://localhost:11434/api/tags', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (response.ok) {
        const latency = Date.now() - start;
        return {
          name: 'ai_service',
          status: latency < 2000 ? 'healthy' : 'warning',
          latency,
          message: `AI service (Ollama) is responsive (${latency}ms)`,
          timestamp: Date.now()
        };
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      return {
        name: 'ai_service',
        status: 'error',
        latency: Date.now() - start,
        message: `AI service unavailable: ${error}`,
        timestamp: Date.now()
      };
    }
  }

  static checkMemoryHealth(): HealthCheck {
    const memUsage = process.memoryUsage();
    const totalMB = Math.round(memUsage.rss / 1024 / 1024);
    const heapMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    
    let status: 'healthy' | 'warning' | 'error' = 'healthy';
    let message = `Memory usage: ${totalMB}MB total, ${heapMB}MB heap`;
    
    if (totalMB > 1024) { // 1GB
      status = 'error';
      message += ' - HIGH MEMORY USAGE';
    } else if (totalMB > 512) { // 512MB
      status = 'warning';
      message += ' - Elevated memory usage';
    }
    
    return {
      name: 'memory',
      status,
      message,
      timestamp: Date.now()
    };
  }

  static checkCacheHealth(): HealthCheck {
    const cacheStats = ProductionCache.getStats();
    const hitRate = ProductionCache.getHitRate();
    
    let status: 'healthy' | 'warning' | 'error' = 'healthy';
    let message = `Cache: ${cacheStats?.size || 0} items, ${Math.round(hitRate * 100)}% hit rate`;
    
    if (hitRate < 0.5) {
      status = 'warning';
      message += ' - Low hit rate';
    }
    
    if ((cacheStats?.size || 0) > 10000) {
      status = 'warning';
      message += ' - Large cache size';
    }
    
    return {
      name: 'cache',
      status,
      message,
      timestamp: Date.now()
    };
  }

  static async performHealthCheck(): Promise<{
    overall: 'healthy' | 'warning' | 'error';
    checks: HealthCheck[];
    metrics: SystemMetrics;
  }> {
    const checks: HealthCheck[] = [];
    
    // Run all health checks
    checks.push(await this.checkDatabaseHealth());
    checks.push(await this.checkAIServiceHealth());
    checks.push(this.checkMemoryHealth());
    checks.push(this.checkCacheHealth());
    
    // Determine overall status
    const hasError = checks.some(check => check.status === 'error');
    const hasWarning = checks.some(check => check.status === 'warning');
    
    const overall = hasError ? 'error' : hasWarning ? 'warning' : 'healthy';
    
    // Gather system metrics
    const metrics = this.getSystemMetrics();
    
    return {
      overall,
      checks,
      metrics
    };
  }

  static getSystemMetrics(): SystemMetrics {
    const metrics = this.getMetrics();
    const cacheStats = ProductionCache.getStats();
    
    const avgResponseTime = metrics.responseTimes.length > 0
      ? metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length
      : 0;
    
    return {
      uptime: Date.now() - metrics.startTime,
      memoryUsage: process.memoryUsage(),
      cacheStats,
      requestCount: metrics.requestCount,
      errorCount: metrics.errorCount,
      avgResponseTime: Math.round(avgResponseTime),
      lastHealthCheck: Date.now()
    };
  }

  static async logMetrics(): Promise<void> {
    try {
      const healthCheck = await this.performHealthCheck();
      
      console.log('🔍 System Health Check:', {
        timestamp: new Date().toISOString(),
        overall: healthCheck.overall,
        uptime: Math.round(healthCheck.metrics.uptime / 1000) + 's',
        requests: healthCheck.metrics.requestCount,
        errors: healthCheck.metrics.errorCount,
        avgResponseTime: healthCheck.metrics.avgResponseTime + 'ms',
        memory: Math.round(healthCheck.metrics.memoryUsage.rss / 1024 / 1024) + 'MB',
        cacheHitRate: Math.round(ProductionCache.getHitRate() * 100) + '%'
      });
      
      // Log any issues
      const issues = healthCheck.checks.filter(check => check.status !== 'healthy');
      if (issues.length > 0) {
        console.warn('⚠️ Health Issues Detected:', issues);
      }
      
    } catch (error) {
      console.error('❌ Health check failed:', error);
    }
  }

  static startPeriodicHealthChecks(intervalMinutes: number = 5): void {
    // Initial health check
    this.logMetrics();
    
    // Set up periodic checks
    setInterval(() => {
      this.logMetrics();
    }, intervalMinutes * 60 * 1000);
    
    console.log(`✅ Health monitoring started (every ${intervalMinutes} minutes)`);
  }

  static createRequestMiddleware() {
    return (req: any, res: any, next: any) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const responseTime = Date.now() - start;
        this.recordRequest(responseTime);
        
        if (res.statusCode >= 400) {
          this.recordError();
        }
      });
      
      next();
    };
  }
}

// Error boundary for production
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context: string
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      ProductionMonitoring.recordError();
      
      console.error(`❌ Error in ${context}:`, error);
      
      // Log to external service in production
      if (process.env.NODE_ENV === 'production') {
        // Could integrate with Sentry, DataDog, etc.
        console.error('Production error logged:', {
          context,
          error: error?.toString(),
          stack: (error as Error)?.stack,
          timestamp: new Date().toISOString()
        });
      }
      
      throw error;
    }
  };
}

// Performance monitoring decorator
export function measurePerformance(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  
  descriptor.value = async function (...args: any[]) {
    const start = Date.now();
    try {
      const result = await method.apply(this, args);
      ProductionMonitoring.recordRequest(Date.now() - start);
      return result;
    } catch (error) {
      ProductionMonitoring.recordError();
      throw error;
    }
  };
  
  return descriptor;
}

// Modern monitoring service interface for compatibility
export const monitoringService = {
  recordMetric: async (name: string, value: number, metadata?: Record<string, any>) => {
    console.log(`📊 Metric: ${name} = ${value}`, metadata);
  },
  
  recordError: async (error: Error, context?: Record<string, any>) => {
    ProductionMonitoring.recordError();
    console.error('🚨 Application Error:', { message: error.message, context });
  },
  
  recordTiming: async (operation: string, duration: number, success: boolean = true) => {
    ProductionMonitoring.recordRequest(duration);
    if (!success) {
      ProductionMonitoring.recordError();
    }
  }
};
