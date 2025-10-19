/**
 * Performance Monitoring API
 * Provides real-time performance metrics and analytics for system monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { appCache, aiCache, sessionCache } from '@/lib/performance/cache';
import { dbOptimizer, connectionPool } from '@/lib/performance/database';
import { bundleAnalyzer } from '@/lib/performance/bundleAnalyzer';
import { prisma } from '@/lib/prisma';
import { monitoringService } from '@/lib/monitoring';

// Performance metrics schema
const metricsRequestSchema = z.object({
  timeRange: z.enum(['1h', '24h', '7d', '30d']).optional().default('24h'),
  includeCache: z.boolean().optional().default(true),
  includeDatabase: z.boolean().optional().default(true),
  includeBundleSize: z.boolean().optional().default(false),
});

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const url = new URL(request.url);
    const params = {
      timeRange: url.searchParams.get('timeRange') || '24h',
      includeCache: url.searchParams.get('includeCache') !== 'false',
      includeDatabase: url.searchParams.get('includeDatabase') !== 'false',
      includeBundleSize: url.searchParams.get('includeBundleSize') === 'true',
    };

    const validatedParams = metricsRequestSchema.parse(params);
    
    // Collect performance metrics
    const metrics: any = {
      timestamp: new Date().toISOString(),
      timeRange: validatedParams.timeRange,
      server: await getServerMetrics(),
    };

    // Cache metrics
    if (validatedParams.includeCache) {
      metrics.cache = {
        app: appCache.getStats(),
        ai: aiCache.getStats(),
        session: sessionCache.getStats(),
      };
    }

    // Database metrics
    if (validatedParams.includeDatabase) {
      metrics.database = {
        ...dbOptimizer.getAnalytics(),
        connectionPool: connectionPool.getPoolStatus(),
        health: await getDatabaseHealth(),
      };
    }

    // Bundle analysis (expensive operation)
    if (validatedParams.includeBundleSize) {
      try {
        const bundleAnalysis = await bundleAnalyzer.analyzeBuild();
        metrics.bundle = {
          totalSize: bundleAnalysis.totalSize,
          chunkCount: bundleAnalysis.chunks.length,
          recommendations: bundleAnalysis.recommendations.slice(0, 3), // Top 3
        };
      } catch (error) {
        metrics.bundle = { error: 'Bundle analysis not available' };
      }
    }

    // System resource metrics
    metrics.system = await getSystemMetrics();

    // API performance metrics
    metrics.api = await getApiMetrics(validatedParams.timeRange);

    return NextResponse.json({
      success: true,
      data: metrics,
    });

  } catch (error) {
    console.error('Performance metrics API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to collect performance metrics',
      details: process.env.NODE_ENV === 'development' 
        ? error instanceof Error ? error.message : 'Unknown error'
        : undefined,
    }, { status: 500 });
  }
}

/**
 * Get server performance metrics
 */
async function getServerMetrics() {
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();
  
  return {
    memory: {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      external: Math.round(memoryUsage.external / 1024 / 1024), // MB
      rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
    },
    uptime: {
      seconds: Math.round(uptime),
      human: formatUptime(uptime),
    },
    nodeVersion: process.version,
    platform: process.platform,
    pid: process.pid,
  };
}

/**
 * Get database health status
 */
async function getDatabaseHealth() {
  try {
    const startTime = performance.now();
    
    // Simple health check
    await prisma.$queryRaw`SELECT 1`;
    
    const responseTime = performance.now() - startTime;
    
    return {
      status: responseTime < 100 ? 'healthy' : responseTime < 500 ? 'degraded' : 'slow',
      responseTime: Math.round(responseTime),
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      lastChecked: new Date().toISOString(),
    };
  }
}

/**
 * Get system resource metrics
 */
async function getSystemMetrics() {
  try {
    // Get recent system metrics from database
    const recentMetrics = await prisma.systemMetric.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const cpuMetrics = recentMetrics.filter((m: any) => m.metric === 'cpu_usage');
    const memoryMetrics = recentMetrics.filter((m: any) => m.metric === 'memory_usage');
    
    return {
      cpu: {
        current: cpuMetrics[0]?.value || 0,
        average: cpuMetrics.length > 0 
          ? cpuMetrics.reduce((sum: number, m: any) => sum + m.value, 0) / cpuMetrics.length 
          : 0,
        samples: cpuMetrics.length,
      },
      memory: {
        current: memoryMetrics[0]?.value || 0,
        average: memoryMetrics.length > 0
          ? memoryMetrics.reduce((sum: number, m: any) => sum + m.value, 0) / memoryMetrics.length
          : 0,
        samples: memoryMetrics.length,
      },
    };
  } catch (error) {
    console.error('Failed to get system metrics:', error);
    return {
      cpu: { current: 0, average: 0, samples: 0 },
      memory: { current: 0, average: 0, samples: 0 },
      error: 'Failed to retrieve system metrics',
    };
  }
}

/**
 * Get API performance metrics
 */
async function getApiMetrics(timeRange: string) {
  try {
    const hoursBack = timeRangeToHours(timeRange);
    const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
    
    // Get AI usage metrics
    const aiUsage = await prisma.aiUsage.findMany({
      where: {
        createdAt: { gte: since },
      },
      select: {
        model: true,
        tokensInput: true,
        tokensOutput: true,
        responseTime: true,
        success: true,
        endpoint: true,
      },
    });

    // Calculate API metrics
    const totalRequests = aiUsage.length;
    const successfulRequests = aiUsage.filter((u: any) => u.success).length;
    const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0;
    
    const responseTimes = aiUsage
      .filter((u: any) => u.responseTime)
      .map((u: any) => u.responseTime!);
    
    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum: number, time: number) => sum + time, 0) / responseTimes.length
      : 0;

    // Token usage
    const totalTokensIn = aiUsage.reduce((sum: number, u: any) => sum + u.tokensInput, 0);
    const totalTokensOut = aiUsage.reduce((sum: number, u: any) => sum + u.tokensOutput, 0);

    // Endpoint breakdown
    const endpointStats = aiUsage.reduce((acc: any, usage: any) => {
      if (!acc[usage.endpoint]) {
        acc[usage.endpoint] = { count: 0, successCount: 0 };
      }
      acc[usage.endpoint].count++;
      if (usage.success) acc[usage.endpoint].successCount++;
      return acc;
    }, {} as Record<string, { count: number; successCount: number }>);

    return {
      requests: {
        total: totalRequests,
        successful: successfulRequests,
        successRate: Math.round(successRate * 100) / 100,
      },
      performance: {
        avgResponseTime: Math.round(avgResponseTime),
        p95ResponseTime: calculatePercentile(responseTimes, 95),
        p99ResponseTime: calculatePercentile(responseTimes, 99),
      },
      tokens: {
        input: totalTokensIn,
        output: totalTokensOut,
        total: totalTokensIn + totalTokensOut,
      },
      endpoints: endpointStats,
    };
  } catch (error) {
    console.error('Failed to get API metrics:', error);
    return {
      requests: { total: 0, successful: 0, successRate: 0 },
      performance: { avgResponseTime: 0, p95ResponseTime: 0, p99ResponseTime: 0 },
      tokens: { input: 0, output: 0, total: 0 },
      endpoints: {},
      error: 'Failed to retrieve API metrics',
    };
  }
}

/**
 * Helper functions
 */
function timeRangeToHours(timeRange: string): number {
  switch (timeRange) {
    case '1h': return 1;
    case '24h': return 24;
    case '7d': return 24 * 7;
    case '30d': return 24 * 30;
    default: return 24;
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0;
  
  const sorted = values.sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return Math.round(sorted[Math.max(0, index)]);
}

/**
 * POST endpoint for recording custom performance metrics
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const metricSchema = z.object({
      metric: z.string(),
      value: z.number(),
      unit: z.string().optional(),
      metadata: z.record(z.any()).optional(),
    });
    
    const validatedMetric = metricSchema.parse(body);
    
    // Store metric in database
    await prisma.systemMetric.create({
      data: {
        metric: validatedMetric.metric,
        value: validatedMetric.value,
        unit: validatedMetric.unit,
        metadata: validatedMetric.metadata,
      },
    });
    
    // Also send to monitoring service if available
    try {
      await monitoringService.recordMetric(
        validatedMetric.metric,
        validatedMetric.value,
        validatedMetric.metadata
      );
    } catch (error) {
      console.warn('Failed to send metric to monitoring service:', error);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Metric recorded successfully',
    });
    
  } catch (error) {
    console.error('Performance metrics recording error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to record metric',
      details: process.env.NODE_ENV === 'development'
        ? error instanceof Error ? error.message : 'Unknown error'
        : undefined,
    }, { status: 400 });
  }
}
