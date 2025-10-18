/**
 * Health Check API Endpoint
 * Critical for production monitoring and load balancers
 */

import { NextRequest, NextResponse } from 'next/server';
import { ProductionMonitoring } from '../../../lib/monitoring';
import { ProductionCache } from '../../../lib/cache';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const detailed = searchParams.get('detailed') === 'true';
    
    if (detailed) {
      // Detailed health check (for admin/monitoring)
      const healthCheck = await ProductionMonitoring.performHealthCheck();
      
      return NextResponse.json({
        status: 'success',
        health: healthCheck,
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      });
    } else {
      // Quick health check (for load balancers)
      const memUsage = process.memoryUsage();
      const isHealthy = memUsage.rss < 1024 * 1024 * 1024; // < 1GB
      
      if (isHealthy) {
        return NextResponse.json({
          status: 'healthy',
          uptime: process.uptime(),
          timestamp: new Date().toISOString()
        });
      } else {
        return NextResponse.json({
          status: 'unhealthy',
          reason: 'High memory usage',
          timestamp: new Date().toISOString()
        }, { status: 503 });
      }
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Cache status endpoint
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    switch (action) {
      case 'clear':
        ProductionCache.clear();
        return NextResponse.json({
          status: 'success',
          message: 'Cache cleared',
          timestamp: new Date().toISOString()
        });
        
      case 'cleanup':
        const cleaned = ProductionCache.cleanup();
        return NextResponse.json({
          status: 'success',
          message: `Cleaned ${cleaned} expired items`,
          timestamp: new Date().toISOString()
        });
        
      case 'stats':
        const stats = ProductionCache.getStats();
        const hitRate = ProductionCache.getHitRate();
        return NextResponse.json({
          status: 'success',
          cache: {
            ...stats,
            hitRate: Math.round(hitRate * 100) / 100
          },
          timestamp: new Date().toISOString()
        });
        
      default:
        return NextResponse.json({
          status: 'error',
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: 'Cache operation failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}