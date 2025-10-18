/**
 * Advanced Observability & APM (Application Performance Monitoring)
 * Sistema completo de observabilidade para produção enterprise
 */

interface Span {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  startTime: number;
  duration?: number;
  tags: Record<string, any>;
  logs: Array<{
    timestamp: number;
    fields: Record<string, any>;
  }>;
  status: 'ok' | 'error' | 'timeout';
}

interface Metric {
  name: string;
  value: number;
  timestamp: number;
  tags: Record<string, string>;
  type: 'counter' | 'gauge' | 'histogram' | 'timer';
}

interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  description: string;
  timestamp: number;
  resolved: boolean;
  tags: Record<string, string>;
}

class DistributedTracing {
  private spans: Map<string, Span> = new Map();
  private activeSpans: Map<string, string> = new Map(); // threadId -> spanId

  startSpan(
    operationName: string,
    parentSpanId?: string,
    tags: Record<string, any> = {}
  ): string {
    const spanId = this.generateId();
    const traceId = parentSpanId ? 
      this.spans.get(parentSpanId)?.traceId || this.generateId() : 
      this.generateId();

    const span: Span = {
      traceId,
      spanId,
      parentSpanId,
      operationName,
      startTime: Date.now(),
      tags,
      logs: [],
      status: 'ok'
    };

    this.spans.set(spanId, span);
    this.activeSpans.set('main', spanId); // Simplified thread tracking
    
    return spanId;
  }

  finishSpan(spanId: string, status: Span['status'] = 'ok'): void {
    const span = this.spans.get(spanId);
    if (!span) return;

    span.duration = Date.now() - span.startTime;
    span.status = status;

    // Send to tracing backend (Jaeger, Zipkin, etc.)
    this.sendSpanToBackend(span);
  }

  addSpanLog(spanId: string, fields: Record<string, any>): void {
    const span = this.spans.get(spanId);
    if (!span) return;

    span.logs.push({
      timestamp: Date.now(),
      fields
    });
  }

  addSpanTag(spanId: string, key: string, value: any): void {
    const span = this.spans.get(spanId);
    if (!span) return;

    span.tags[key] = value;
  }

  getActiveSpan(): string | undefined {
    return this.activeSpans.get('main');
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private async sendSpanToBackend(span: Span): Promise<void> {
    try {
      // In production, send to Jaeger/Zipkin/DataDog
      console.log('📊 Trace Span:', {
        trace: span.traceId,
        span: span.spanId,
        operation: span.operationName,
        duration: span.duration,
        status: span.status
      });

      // Mock API call
      // await fetch('/api/observability/traces', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(span)
      // });
    } catch (error) {
      console.error('Failed to send trace span:', error);
    }
  }
}

class MetricsCollector {
  private metrics: Metric[] = [];
  private counters: Map<string, number> = new Map();
  private gauges: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();

  // Counter metrics (always increasing)
  incrementCounter(name: string, value = 1, tags: Record<string, string> = {}): void {
    const current = this.counters.get(name) || 0;
    this.counters.set(name, current + value);

    this.recordMetric({
      name,
      value: current + value,
      timestamp: Date.now(),
      tags,
      type: 'counter'
    });
  }

  // Gauge metrics (can go up/down)
  setGauge(name: string, value: number, tags: Record<string, string> = {}): void {
    this.gauges.set(name, value);

    this.recordMetric({
      name,
      value,
      timestamp: Date.now(),
      tags,
      type: 'gauge'
    });
  }

  // Histogram metrics (for distributions)
  recordHistogram(name: string, value: number, tags: Record<string, string> = {}): void {
    const values = this.histograms.get(name) || [];
    values.push(value);
    this.histograms.set(name, values);

    this.recordMetric({
      name,
      value,
      timestamp: Date.now(),
      tags,
      type: 'histogram'
    });
  }

  // Timer metrics (measure duration)
  startTimer(name: string, tags: Record<string, string> = {}): () => void {
    const startTime = Date.now();
    
    return () => {
      const duration = Date.now() - startTime;
      this.recordMetric({
        name,
        value: duration,
        timestamp: Date.now(),
        tags,
        type: 'timer'
      });
    };
  }

  private recordMetric(metric: Metric): void {
    this.metrics.push(metric);

    // Send to metrics backend periodically
    if (this.metrics.length >= 100) {
      this.flushMetrics();
    }
  }

  private async flushMetrics(): Promise<void> {
    if (this.metrics.length === 0) return;

    const metricsToSend = [...this.metrics];
    this.metrics = [];

    try {
      // In production, send to Prometheus/DataDog/CloudWatch
      console.log('📈 Metrics Batch:', metricsToSend.length);
      
      // Mock API call
      // await fetch('/api/observability/metrics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(metricsToSend)
      // });
    } catch (error) {
      console.error('Failed to send metrics:', error);
    }
  }

  // Auto-flush metrics every 60 seconds
  startPeriodicFlush(): void {
    setInterval(() => {
      this.flushMetrics();
    }, 60000);
  }
}

class AlertManager {
  private alerts: Alert[] = [];
  private thresholds: Map<string, {
    condition: (value: number) => boolean;
    severity: Alert['severity'];
    message: string;
  }> = new Map();

  // Define alerting thresholds
  defineThreshold(
    metricName: string,
    condition: (value: number) => boolean,
    severity: Alert['severity'],
    message: string
  ): void {
    this.thresholds.set(metricName, { condition, severity, message });
  }

  // Check metric against thresholds
  checkMetric(metricName: string, value: number, tags: Record<string, string> = {}): void {
    const threshold = this.thresholds.get(metricName);
    if (!threshold) return;

    if (threshold.condition(value)) {
      this.triggerAlert({
        id: this.generateAlertId(),
        severity: threshold.severity,
        title: `${metricName} threshold exceeded`,
        description: threshold.message.replace('{value}', value.toString()),
        timestamp: Date.now(),
        resolved: false,
        tags
      });
    }
  }

  private triggerAlert(alert: Alert): void {
    this.alerts.push(alert);
    
    // Send immediate notification for critical alerts
    if (alert.severity === 'critical') {
      this.sendCriticalAlert(alert);
    }

    console.log(`🚨 Alert [${alert.severity.toUpperCase()}]: ${alert.title}`);
  }

  private async sendCriticalAlert(alert: Alert): Promise<void> {
    try {
      // In production, send to PagerDuty/Slack/Email
      // await fetch('/api/observability/alerts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(alert)
      // });
    } catch (error) {
      console.error('Failed to send critical alert:', error);
    }
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
    }
  }

  getActiveAlerts(): Alert[] {
    return this.alerts.filter(a => !a.resolved);
  }
}

class HealthChecker {
  private healthChecks: Map<string, () => Promise<boolean>> = new Map();

  registerHealthCheck(name: string, check: () => Promise<boolean>): void {
    this.healthChecks.set(name, check);
  }

  async runHealthChecks(): Promise<Record<string, {
    status: 'healthy' | 'unhealthy';
    timestamp: number;
    responseTime: number;
  }>> {
    const results: Record<string, any> = {};

    for (const [name, check] of this.healthChecks.entries()) {
      const startTime = Date.now();
      try {
        const isHealthy = await Promise.race([
          check(),
          new Promise<boolean>((_, reject) => 
            setTimeout(() => reject(new Error('Health check timeout')), 5000)
          )
        ]);

        results[name] = {
          status: isHealthy ? 'healthy' : 'unhealthy',
          timestamp: Date.now(),
          responseTime: Date.now() - startTime
        };
      } catch (error) {
        results[name] = {
          status: 'unhealthy',
          timestamp: Date.now(),
          responseTime: Date.now() - startTime,
          error: error?.toString()
        };
      }
    }

    return results;
  }
}

// Business Logic Observability Decorator
function Observe(operationName?: string, tags?: Record<string, any>) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const opName = operationName || `${target.constructor.name}.${propertyName}`;

    descriptor.value = async function (...args: any[]) {
      const spanId = observability.tracing.startSpan(opName, undefined, {
        ...tags,
        method: propertyName,
        class: target.constructor.name
      });

      const timer = observability.metrics.startTimer('operation_duration', {
        operation: opName
      });

      try {
        observability.tracing.addSpanLog(spanId, {
          event: 'method_start',
          args: args.length
        });

        const result = await originalMethod.apply(this, args);
        
        observability.tracing.addSpanLog(spanId, {
          event: 'method_success'
        });

        observability.metrics.incrementCounter('operation_success', 1, {
          operation: opName
        });

        observability.tracing.finishSpan(spanId, 'ok');
        timer();

        return result;
      } catch (error) {
        observability.tracing.addSpanLog(spanId, {
          event: 'method_error',
          error: error?.toString()
        });

        observability.metrics.incrementCounter('operation_error', 1, {
          operation: opName,
          error_type: error?.constructor.name || 'Unknown'
        });

        observability.tracing.finishSpan(spanId, 'error');
        timer();

        throw error;
      }
    };

    return descriptor;
  };
}

// Centralized Observability Manager
class ObservabilityManager {
  public tracing = new DistributedTracing();
  public metrics = new MetricsCollector();
  public alerts = new AlertManager();
  public health = new HealthChecker();

  constructor() {
    this.setupDefaultThresholds();
    this.setupDefaultHealthChecks();
    this.metrics.startPeriodicFlush();
  }

  private setupDefaultThresholds(): void {
    // Response time alerts
    this.alerts.defineThreshold(
      'operation_duration',
      (value) => value > 5000, // 5 seconds
      'warning',
      'Operation taking longer than expected: {value}ms'
    );

    this.alerts.defineThreshold(
      'operation_duration',
      (value) => value > 30000, // 30 seconds
      'critical',
      'Operation critically slow: {value}ms'
    );

    // Error rate alerts
    this.alerts.defineThreshold(
      'error_rate',
      (value) => value > 0.05, // 5% error rate
      'warning',
      'Error rate elevated: {value}%'
    );

    this.alerts.defineThreshold(
      'error_rate',
      (value) => value > 0.15, // 15% error rate
      'critical',
      'Error rate critically high: {value}%'
    );
  }

  private setupDefaultHealthChecks(): void {
    // Database health check
    this.health.registerHealthCheck('database', async () => {
      try {
        // Mock database check
        return true;
      } catch {
        return false;
      }
    });

    // AI Service health check
    this.health.registerHealthCheck('ai_service', async () => {
      try {
        // Mock AI service check
        return true;
      } catch {
        return false;
      }
    });

    // Memory health check
    this.health.registerHealthCheck('memory', async () => {
      if (typeof process !== 'undefined') {
        const memUsage = process.memoryUsage();
        const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
        return heapUsedMB < 500; // Alert if using more than 500MB
      }
      return true;
    });
  }

  // Generate observability dashboard data
  async getDashboardData(): Promise<{
    systemHealth: any;
    activeAlerts: Alert[];
    keyMetrics: {
      requestsPerMinute: number;
      averageResponseTime: number;
      errorRate: number;
      activeUsers: number;
    };
  }> {
    const systemHealth = await this.health.runHealthChecks();
    const activeAlerts = this.alerts.getActiveAlerts();

    // Calculate key metrics (simplified)
    const keyMetrics = {
      requestsPerMinute: 150, // Mock data
      averageResponseTime: 250,
      errorRate: 0.02,
      activeUsers: 45
    };

    return {
      systemHealth,
      activeAlerts,
      keyMetrics
    };
  }
}

// Singleton instance
export const observability = new ObservabilityManager();

export {
  Observe,
  type Span,
  type Metric,
  type Alert
};