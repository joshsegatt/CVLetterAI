/**
 * Database Performance Optimization
 * Comprehensive query optimization and connection pooling for enterprise-grade performance
 */

import { PrismaClient } from '@prisma/client';

interface QueryAnalytics {
  query: string;
  duration: number;
  timestamp: number;
  rowsAffected?: number;
  resultSize?: number;
}

interface ConnectionMetrics {
  activeConnections: number;
  totalQueries: number;
  avgQueryTime: number;
  slowQueries: number;
  errorCount: number;
}

/**
 * Performance monitoring utilities
 */
class PerformanceMonitor {
  private static timers = new Map<string, number>();
  
  static start(label: string): void {
    this.timers.set(label, performance.now());
  }
  
  static end(label: string): number {
    const startTime = this.timers.get(label);
    if (!startTime) return 0;
    
    const duration = performance.now() - startTime;
    this.timers.delete(label);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${label}: ${Math.round(duration * 100) / 100}ms`);
    }
    
    return duration;
  }
  
  static async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label);
    try {
      const result = await fn();
      return result;
    } finally {
      this.end(label);
    }
  }
}

export class DatabaseOptimizer {
  private queryMetrics: QueryAnalytics[] = [];
  private slowQueryThreshold = 1000; // 1 second
  private maxQueryHistory = 1000;
  private connectionMetrics: ConnectionMetrics = {
    activeConnections: 0,
    totalQueries: 0,
    avgQueryTime: 0,
    slowQueries: 0,
    errorCount: 0
  };

  /**
   * Wrap Prisma client with performance monitoring
   */
  wrapPrismaClient(prisma: PrismaClient): PrismaClient {
    return prisma.$extends({
      query: {
        $allOperations: async ({ operation, model, args, query }: any) => {
          const startTime = performance.now();
          const queryLabel = `${model || 'unknown'}.${operation || 'unknown'}`;
          
          try {
            this.connectionMetrics.activeConnections++;
            
            // Execute the query
            const result = await query(args);
            
            const duration = performance.now() - startTime;
            
            // Record metrics
            this.recordQuery({
              query: queryLabel,
              duration,
              timestamp: Date.now(),
              resultSize: this.estimateResultSize(result)
            });
            
            // Log slow queries in development
            if (duration > this.slowQueryThreshold) {
              this.connectionMetrics.slowQueries++;
              if (process.env.NODE_ENV === 'development') {
                console.warn(`🐌 Slow query detected: ${queryLabel} (${duration.toFixed(2)}ms)`);
                console.warn('Query args:', JSON.stringify(args, null, 2));
              }
            }
            
            return result;
          } catch (error) {
            this.connectionMetrics.errorCount++;
            const duration = performance.now() - startTime;
            
            // Log error with timing
            console.error(`❌ Database query failed: ${queryLabel} (${duration.toFixed(2)}ms)`, error);
            throw error;
          } finally {
            this.connectionMetrics.activeConnections--;
          }
        }
      }
    }) as PrismaClient;
  }

  /**
   * Record query performance data
   */
  private recordQuery(analytics: QueryAnalytics): void {
    this.queryMetrics.push(analytics);
    
    // Maintain history limit
    if (this.queryMetrics.length > this.maxQueryHistory) {
      this.queryMetrics.shift();
    }
    
    // Update connection metrics
    this.connectionMetrics.totalQueries++;
    const totalTime = this.queryMetrics.reduce((sum, q) => sum + q.duration, 0);
    this.connectionMetrics.avgQueryTime = totalTime / this.queryMetrics.length;
  }

  /**
   * Estimate result size for performance tracking
   */
  private estimateResultSize(result: any): number {
    try {
      return JSON.stringify(result).length;
    } catch {
      return 0;
    }
  }

  /**
   * Get performance analytics
   */
  getAnalytics(): {
    recentQueries: QueryAnalytics[];
    slowestQueries: QueryAnalytics[];
    connectionMetrics: ConnectionMetrics;
    recommendations: string[];
  } {
    const recentQueries = this.queryMetrics.slice(-10);
    const slowestQueries = [...this.queryMetrics]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);
    
    const recommendations = this.generateRecommendations();
    
    return {
      recentQueries,
      slowestQueries,
      connectionMetrics: { ...this.connectionMetrics },
      recommendations
    };
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const { avgQueryTime, slowQueries, totalQueries } = this.connectionMetrics;
    
    if (avgQueryTime > 500) {
      recommendations.push('Consider adding database indexes for frequently queried fields');
    }
    
    if (slowQueries / totalQueries > 0.1) {
      recommendations.push('High percentage of slow queries detected - review query optimization');
    }
    
    if (this.connectionMetrics.errorCount > 0) {
      recommendations.push('Database errors detected - check connection stability and query validity');
    }
    
    const frequentQueries = this.getFrequentQueryPatterns();
    if (frequentQueries.length > 0) {
      recommendations.push(`Consider caching results for: ${frequentQueries.join(', ')}`);
    }
    
    return recommendations;
  }

  /**
   * Identify frequent query patterns for caching opportunities
   */
  private getFrequentQueryPatterns(): string[] {
    const queryCount = new Map<string, number>();
    
    this.queryMetrics.forEach(metric => {
      const count = queryCount.get(metric.query) || 0;
      queryCount.set(metric.query, count + 1);
    });
    
    return Array.from(queryCount.entries())
      .filter(([_, count]) => count >= 5)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([query]) => query);
  }

  /**
   * Clear analytics data
   */
  clearAnalytics(): void {
    this.queryMetrics = [];
    this.connectionMetrics = {
      activeConnections: 0,
      totalQueries: 0,
      avgQueryTime: 0,
      slowQueries: 0,
      errorCount: 0
    };
  }
}

/**
 * Query optimization utilities
 */
export class QueryOptimizer {
  /**
   * Optimize user queries with proper includes and selections
   */
  static optimizeUserQuery(include?: any): any {
    return {
      // Only include necessary relations
      cvDrafts: include?.cvDrafts ? {
        select: {
          id: true,
          title: true,
          updatedAt: true,
          payload: false // Exclude large payload unless needed
        }
      } : false,
      
      letterDrafts: include?.letterDrafts ? {
        select: {
          id: true,
          title: true,
          updatedAt: true,
          payload: false // Exclude large payload unless needed
        }
      } : false,
      
      // Avoid including large fields unless specifically needed
      ...include
    };
  }

  /**
   * Optimize CV draft queries
   */
  static optimizeCVQuery(include?: any): any {
    return {
      user: include?.user ? {
        select: {
          id: true,
          name: true,
          email: true,
          // Exclude sensitive data
          password: false,
          metadata: false
        }
      } : false,
      
      // Only include content when explicitly needed
      ...include
    };
  }

  /**
   * Create efficient pagination options
   */
  static createPagination(page: number = 1, limit: number = 10) {
    const offset = Math.max(0, (page - 1) * limit);
    const take = Math.min(100, Math.max(1, limit)); // Limit max results
    
    return {
      skip: offset,
      take,
      // Always include cursor-based pagination for better performance
      cursor: undefined // Will be set by the calling code
    };
  }

  /**
   * Create optimized ordering
   */
  static createOrdering(
    sortField: string = 'updatedAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Record<string, 'asc' | 'desc'> {
    return {
      [sortField]: sortOrder
    };
  }
}

/**
 * Connection pool manager for optimal database connections
 */
export class ConnectionPoolManager {
  private static instance: ConnectionPoolManager;
  private connectionCount = 0;
  private readonly maxConnections = 10;
  
  static getInstance(): ConnectionPoolManager {
    if (!ConnectionPoolManager.instance) {
      ConnectionPoolManager.instance = new ConnectionPoolManager();
    }
    return ConnectionPoolManager.instance;
  }

  /**
   * Execute with connection management
   */
  async executeWithPool<T>(operation: () => Promise<T>): Promise<T> {
    if (this.connectionCount >= this.maxConnections) {
      throw new Error('Connection pool exhausted. Please retry later.');
    }

    this.connectionCount++;
    
    try {
      return await PerformanceMonitor.measureAsync('db_operation', operation);
    } finally {
      this.connectionCount--;
    }
  }

  /**
   * Get pool status
   */
  getPoolStatus() {
    return {
      activeConnections: this.connectionCount,
      maxConnections: this.maxConnections,
      utilizationPercent: (this.connectionCount / this.maxConnections) * 100
    };
  }
}

/**
 * Database health checker
 */
export class DatabaseHealthChecker {
  static async checkHealth(prisma: PrismaClient): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    latency: number;
    error?: string;
  }> {
    try {
      const startTime = performance.now();
      
      // Simple health check query
      await prisma.$queryRaw`SELECT 1`;
      
      const latency = performance.now() - startTime;
      
      if (latency > 5000) {
        return { status: 'degraded', latency };
      }
      
      if (latency > 1000) {
        return { status: 'degraded', latency };
      }
      
      return { status: 'healthy', latency };
    } catch (error) {
      return {
        status: 'unhealthy',
        latency: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instances
export const dbOptimizer = new DatabaseOptimizer();
export const connectionPool = ConnectionPoolManager.getInstance();
