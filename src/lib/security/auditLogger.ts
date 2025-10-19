import fs from 'fs';
import path from 'path';

export type AuditEventType = 
  | 'USER_LOGIN'
  | 'USER_LOGOUT'  
  | 'USER_REGISTRATION'
  | 'PASSWORD_CHANGE'
  | 'DATA_ACCESS'
  | 'DATA_MODIFICATION'
  | 'DATA_DELETION'
  | 'PAYMENT_TRANSACTION'
  | 'SECURITY_VIOLATION'
  | 'ADMIN_ACTION'
  | 'API_KEY_USAGE'
  | 'FILE_UPLOAD'
  | 'EXPORT_DATA'
  | 'SYSTEM_ERROR';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: AuditEventType;
  userId?: string;
  userEmail?: string;
  ipAddress: string;
  userAgent: string;
  resourceId?: string;
  resourceType?: string;
  action: string;
  details: Record<string, any>;
  riskLevel: RiskLevel;
  success: boolean;
  sessionId?: string;
  correlationId?: string;
  compliance: {
    gdpr: boolean;
    pci: boolean;
    sox: boolean;
  };
}

export interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  failedLogins: number;
  suspiciousActivities: number;
  dataAccesses: number;
  topRiskyUsers: { userId: string; riskScore: number }[];
  timelineEvents: { hour: number; count: number }[];
}

class SecurityAuditLogger {
  private static instance: SecurityAuditLogger;
  private logBuffer: AuditLogEntry[] = [];
  private readonly maxBufferSize = 1000;
  private readonly flushInterval = 30000; // 30 segundos
  private logFilePath: string;
  
  private constructor() {
    // Configurar caminho do log baseado no ambiente
    const logDir = process.env.AUDIT_LOG_PATH || './logs/security';
    this.ensureLogDirectory(logDir);
    
    const today = new Date().toISOString().split('T')[0];
    this.logFilePath = path.join(logDir, `security-audit-${today}.json`);
    
    // Configurar flush automático
    setInterval(() => this.flushLogs(), this.flushInterval);
    
    // Configurar cleanup de logs antigos
    setInterval(() => this.cleanupOldLogs(), 24 * 60 * 60 * 1000); // Daily
  }

  public static getInstance(): SecurityAuditLogger {
    if (!SecurityAuditLogger.instance) {
      SecurityAuditLogger.instance = new SecurityAuditLogger();
    }
    return SecurityAuditLogger.instance;
  }

  public async logEvent(event: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    const auditEntry: AuditLogEntry = {
      id: this.generateEventId(),
      timestamp: new Date().toISOString(),
      ...event
    };

    // Log crítico imediatamente no console
    if (event.riskLevel === 'CRITICAL') {
      console.error(`🚨 CRITICAL SECURITY EVENT:`, auditEntry);
      
      // Em produção: enviar alerta imediato
      await this.sendCriticalAlert(auditEntry);
    }

    // Adicionar ao buffer
    this.logBuffer.push(auditEntry);

    // Flush se buffer estiver cheio
    if (this.logBuffer.length >= this.maxBufferSize) {
      await this.flushLogs();
    }

    // Log estruturado para análise
    this.logStructured(auditEntry);
  }

  private async flushLogs(): Promise<void> {
    if (this.logBuffer.length === 0) return;

    try {
      const logsToFlush = [...this.logBuffer];
      this.logBuffer = [];

      // Escrever no arquivo (append mode)
      const logLines = logsToFlush.map(log => JSON.stringify(log)).join('\n') + '\n';
      
      await fs.promises.appendFile(this.logFilePath, logLines, 'utf8');
      
      // Em produção: enviar para sistema centralizado (ELK, Splunk, etc.)
      await this.sendToExternalLogger(logsToFlush);
      
    } catch (error) {
      console.error('Failed to flush audit logs:', error);
      // Re-adicionar ao buffer em caso de erro
      this.logBuffer.unshift(...this.logBuffer);
    }
  }

  private ensureLogDirectory(dirPath: string): void {
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to create log directory:', error);
    }
  }

  private generateEventId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private logStructured(entry: AuditLogEntry): void {
    // Log estruturado para diferentes níveis
    const logData = {
      audit_event: entry.eventType,
      user_id: entry.userId,
      ip: entry.ipAddress,
      risk: entry.riskLevel,
      success: entry.success,
      timestamp: entry.timestamp
    };

    switch (entry.riskLevel) {
      case 'CRITICAL':
        console.error('AUDIT_CRITICAL:', logData);
        break;
      case 'HIGH':
        console.warn('AUDIT_HIGH:', logData);
        break;
      case 'MEDIUM':
        console.info('AUDIT_MEDIUM:', logData);
        break;
      case 'LOW':
        console.log('AUDIT_LOW:', logData);
        break;
    }
  }

  private async sendCriticalAlert(event: AuditLogEntry): Promise<void> {
    const webhookUrl = process.env.SECURITY_LOG_WEBHOOK;
    if (!webhookUrl) return;

    try {
      const alertMessage = {
        text: `🚨 CRITICAL SECURITY EVENT DETECTED`,
        attachments: [{
          color: 'danger',
          title: `${event.eventType} - ${event.action}`,
          fields: [
            { title: 'User', value: event.userEmail || event.userId || 'Unknown', short: true },
            { title: 'IP Address', value: event.ipAddress, short: true },
            { title: 'Time', value: event.timestamp, short: true },
            { title: 'Success', value: event.success ? 'Yes' : 'No', short: true },
            { title: 'Details', value: JSON.stringify(event.details, null, 2), short: false }
          ]
        }]
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertMessage)
      });
    } catch (error) {
      console.error('Failed to send critical alert:', error);
    }
  }

  private async sendToExternalLogger(logs: AuditLogEntry[]): Promise<void> {
    // Integração com sistemas externos (exemplo: ELK Stack)
    const elkUrl = process.env.ELK_ENDPOINT;
    const sentryDsn = process.env.SENTRY_DSN;

    if (elkUrl) {
      try {
        await fetch(`${elkUrl}/security-audit/_bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-ndjson' },
          body: logs.map(log => 
            `{"index":{"_index":"security-audit","_type":"_doc"}}\n${JSON.stringify(log)}`
          ).join('\n') + '\n'
        });
      } catch (error) {
        console.error('Failed to send logs to ELK:', error);
      }
    }

    // Enviar eventos críticos para Sentry
    if (sentryDsn) {
      const criticalLogs = logs.filter(log => log.riskLevel === 'CRITICAL');
      // Implementação do Sentry seria aqui
    }
  }

  private async cleanupOldLogs(): Promise<void> {
    const retentionDays = parseInt(process.env.AUDIT_LOG_RETENTION_DAYS || '2555'); // 7 anos default
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    try {
      const logDir = path.dirname(this.logFilePath);
      const files = await fs.promises.readdir(logDir);
      
      for (const file of files) {
        if (!file.startsWith('security-audit-')) continue;
        
        const filePath = path.join(logDir, file);
        const stats = await fs.promises.stat(filePath);
        
        if (stats.mtime < cutoffDate) {
          await fs.promises.unlink(filePath);
          console.log(`Cleaned up old audit log: ${file}`);
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old logs:', error);
    }
  }

  public async getSecurityMetrics(timeframe: 'hour' | 'day' | 'week' = 'day'): Promise<SecurityMetrics> {
    const now = new Date();
    const cutoff = new Date();
    
    switch (timeframe) {
      case 'hour':
        cutoff.setHours(cutoff.getHours() - 1);
        break;
      case 'day':
        cutoff.setDate(cutoff.getDate() - 1);
        break;
      case 'week':
        cutoff.setDate(cutoff.getDate() - 7);
        break;
    }

    // Em uma implementação real, isso viria do banco de dados
    // Por agora, usar dados do buffer atual
    const recentLogs = this.logBuffer.filter(log => 
      new Date(log.timestamp) >= cutoff
    );

    const metrics: SecurityMetrics = {
      totalEvents: recentLogs.length,
      criticalEvents: recentLogs.filter(log => log.riskLevel === 'CRITICAL').length,
      failedLogins: recentLogs.filter(log => 
        log.eventType === 'USER_LOGIN' && !log.success
      ).length,
      suspiciousActivities: recentLogs.filter(log => 
        ['SECURITY_VIOLATION', 'DATA_ACCESS'].includes(log.eventType)
      ).length,
      dataAccesses: recentLogs.filter(log => 
        log.eventType === 'DATA_ACCESS'
      ).length,
      topRiskyUsers: this.calculateRiskyUsers(recentLogs),
      timelineEvents: this.generateTimeline(recentLogs, timeframe)
    };

    return metrics;
  }

  private calculateRiskyUsers(logs: AuditLogEntry[]): { userId: string; riskScore: number }[] {
    const userRisks = new Map<string, number>();

    logs.forEach(log => {
      if (!log.userId) return;

      let score = 0;
      switch (log.riskLevel) {
        case 'CRITICAL': score = 10; break;
        case 'HIGH': score = 5; break;
        case 'MEDIUM': score = 2; break;
        case 'LOW': score = 1; break;
      }

      if (!log.success) score *= 2; // Penalizar falhas

      userRisks.set(log.userId, (userRisks.get(log.userId) || 0) + score);
    });

    return Array.from(userRisks.entries())
      .map(([userId, riskScore]) => ({ userId, riskScore }))
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 10);
  }

  private generateTimeline(logs: AuditLogEntry[], timeframe: string): { hour: number; count: number }[] {
    const timeline = new Map<number, number>();
    const hours = timeframe === 'hour' ? 1 : timeframe === 'day' ? 24 : 168;

    // Inicializar todas as horas
    for (let i = 0; i < hours; i++) {
      timeline.set(i, 0);
    }

    logs.forEach(log => {
      const timestamp = new Date(log.timestamp);
      const hour = timestamp.getHours() + (timestamp.getDate() - new Date().getDate()) * 24;
      timeline.set(hour, (timeline.get(hour) || 0) + 1);
    });

    return Array.from(timeline.entries()).map(([hour, count]) => ({ hour, count }));
  }
}

// Helper functions para logging específico
export class SecurityEventLogger {
  private static auditLogger = SecurityAuditLogger.getInstance();

  static async logUserLogin(userId: string, email: string, ipAddress: string, userAgent: string, success: boolean, details: any = {}) {
    await this.auditLogger.logEvent({
      eventType: 'USER_LOGIN',
      userId,
      userEmail: email,
      ipAddress,
      userAgent,
      action: 'login_attempt',
      details: { ...details, loginMethod: details.method || 'password' },
      riskLevel: success ? 'LOW' : 'MEDIUM',
      success,
      compliance: { gdpr: true, pci: false, sox: false }
    });
  }

  static async logDataAccess(userId: string, resourceType: string, resourceId: string, ipAddress: string, userAgent: string, details: any = {}) {
    await this.auditLogger.logEvent({
      eventType: 'DATA_ACCESS',
      userId,
      ipAddress,
      userAgent,
      resourceId,
      resourceType,
      action: 'data_read',
      details,
      riskLevel: 'LOW',
      success: true,
      compliance: { gdpr: true, pci: resourceType.includes('payment'), sox: true }
    });
  }

  static async logSecurityViolation(ipAddress: string, userAgent: string, violationType: string, details: any = {}) {
    await this.auditLogger.logEvent({
      eventType: 'SECURITY_VIOLATION',
      ipAddress,
      userAgent,
      action: violationType,
      details,
      riskLevel: 'CRITICAL',
      success: false,
      compliance: { gdpr: false, pci: true, sox: true }
    });
  }

  static async logPaymentTransaction(userId: string, transactionId: string, ipAddress: string, userAgent: string, success: boolean, details: any = {}) {
    await this.auditLogger.logEvent({
      eventType: 'PAYMENT_TRANSACTION',
      userId,
      ipAddress,
      userAgent,
      resourceId: transactionId,
      resourceType: 'payment',
      action: 'process_payment',
      details,
      riskLevel: success ? 'MEDIUM' : 'HIGH',
      success,
      compliance: { gdpr: true, pci: true, sox: true }
    });
  }
}

// Export singleton
export const securityAuditLogger = SecurityAuditLogger.getInstance();
export { SecurityAuditLogger };
