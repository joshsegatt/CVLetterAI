/**
 * Performance Monitoring & Analytics
 * Implementa métricas Core Web Vitals e monitoramento de performance
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userAgent: string;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Coletar Core Web Vitals
  collectWebVitals() {
    if (typeof window === 'undefined') return;

    // CLS (Cumulative Layout Shift)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as any;
        if (entry.entryType === 'layout-shift' && !layoutShiftEntry.hadRecentInput) {
          this.recordMetric('CLS', layoutShiftEntry.value);
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });

    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.recordMetric('LCP', lastEntry.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidEntry = entry as any;
        this.recordMetric('FID', fidEntry.processingStart - fidEntry.startTime);
      }
    }).observe({ type: 'first-input', buffered: true });
  }

  // Monitorar recursos críticos
  monitorResourceTiming() {
    if (typeof window === 'undefined') return;

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;
        
        // Identificar recursos lentos (>1s)
        if (resource.duration > 1000) {
          this.recordMetric('SLOW_RESOURCE', resource.duration, resource.name);
        }

        // Monitorar falhas de carregamento
        if (resource.transferSize === 0 && resource.decodedBodySize === 0) {
          this.recordMetric('FAILED_RESOURCE', 0, resource.name);
        }
      }
    }).observe({ type: 'resource', buffered: true });
  }

  // Monitorar Memory Usage
  monitorMemoryUsage() {
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    const memory = (performance as any).memory;
    setInterval(() => {
      this.recordMetric('MEMORY_USED', memory.usedJSHeapSize);
      this.recordMetric('MEMORY_TOTAL', memory.totalJSHeapSize);
    }, 30000); // A cada 30s
  }

  // Detectar Long Tasks (>50ms)
  detectLongTasks() {
    if (typeof window === 'undefined') return;

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric('LONG_TASK', entry.duration);
      }
    }).observe({ type: 'longtask', buffered: true });
  }

  private recordMetric(name: string, value: number, url?: string) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: url || window.location.href,
      userAgent: navigator.userAgent
    };

    this.metrics.push(metric);

    // Enviar métricas críticas imediatamente
    if (this.isCriticalMetric(name, value)) {
      this.sendMetrics([metric]);
    }
  }

  private isCriticalMetric(name: string, value: number): boolean {
    const thresholds = {
      CLS: 0.1,
      LCP: 2500,
      FID: 100,
      LONG_TASK: 100,
      SLOW_RESOURCE: 2000
    };

    return value > (thresholds[name as keyof typeof thresholds] || Infinity);
  }

  private async sendMetrics(metrics: PerformanceMetric[]) {
    try {
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics })
      });
    } catch (error) {
      console.error('Failed to send performance metrics:', error);
    }
  }

  // Flush metrics periodicamente
  startPeriodicFlush() {
    setInterval(() => {
      if (this.metrics.length > 0) {
        this.sendMetrics([...this.metrics]);
        this.metrics = [];
      }
    }, 60000); // A cada 1 minuto
  }

  // Otimização automática baseada em métricas
  suggestOptimizations(): string[] {
    const suggestions: string[] = [];
    
    const avgLCP = this.getAverageMetric('LCP');
    if (avgLCP > 2500) {
      suggestions.push('Consider optimizing images and critical resources');
    }

    const avgCLS = this.getAverageMetric('CLS');
    if (avgCLS > 0.1) {
      suggestions.push('Reduce layout shifts by predefining image dimensions');
    }

    const longTasks = this.metrics.filter(m => m.name === 'LONG_TASK').length;
    if (longTasks > 5) {
      suggestions.push('Break up long-running JavaScript tasks');
    }

    return suggestions;
  }

  private getAverageMetric(name: string): number {
    const values = this.metrics.filter(m => m.name === name).map(m => m.value);
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }
}

// Hook React para usar o monitor
export function usePerformanceMonitoring() {
  const monitor = PerformanceMonitor.getInstance();

  const startMonitoring = () => {
    monitor.collectWebVitals();
    monitor.monitorResourceTiming();
    monitor.monitorMemoryUsage();
    monitor.detectLongTasks();
    monitor.startPeriodicFlush();
  };

  const getOptimizationSuggestions = () => {
    return monitor.suggestOptimizations();
  };

  return {
    startMonitoring,
    getOptimizationSuggestions
  };
}

export { PerformanceMonitor };