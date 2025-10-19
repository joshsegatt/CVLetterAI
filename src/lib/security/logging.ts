export type SecurityEventType = 
  | 'ATTACK_DETECTED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INVALID_REQUEST'
  | 'SUSPICIOUS_REQUEST'
  | 'MIDDLEWARE_ERROR'
  | 'AUTH_FAILURE'
  | 'UNAUTHORIZED_ACCESS'
  | 'DATA_BREACH_ATTEMPT';

export interface SecurityEvent {
  timestamp: string;
  type: SecurityEventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip: string;
  userAgent?: string;
  path?: string;
  data?: any;
  blocked: boolean;
}

// Em produção, usar um sistema de logging robusto como Winston + ELK Stack
const securityLogs: SecurityEvent[] = [];

export async function logSecurityEvent(
  type: SecurityEventType,
  data: {
    ip: string;
    path?: string;
    userAgent?: string;
    [key: string]: any;
  }
): Promise<void> {
  try {
    const event: SecurityEvent = {
      timestamp: new Date().toISOString(),
      type,
      severity: getSeverityForEventType(type),
      ip: data.ip,
      userAgent: data.userAgent,
      path: data.path,
      data: { ...data },
      blocked: shouldBlockEvent(type)
    };

    // Log to console (em produção usar logger apropriado)
    console.warn(`[SECURITY] ${type}:`, event);

    // Store in memory (em produção usar banco de dados ou serviço de logging)
    securityLogs.push(event);
    
    // Manter apenas os últimos 1000 logs em memória
    if (securityLogs.length > 1000) {
      securityLogs.shift();
    }

    // Para eventos críticos, alertar imediatamente
    if (event.severity === 'critical') {
      alertCriticalSecurity(event);
    }

    // Para alta frequência de ataques do mesmo IP, considerar bloqueio automático
    if (shouldAutoBlock(data.ip)) {
      autoBlockIP(data.ip);
    }

  } catch (error) {
    console.error('Error logging security event:', error);
  }
}

function getSeverityForEventType(type: SecurityEventType): 'low' | 'medium' | 'high' | 'critical' {
  switch (type) {
    case 'ATTACK_DETECTED':
      return 'critical';
    case 'DATA_BREACH_ATTEMPT':
      return 'critical';
    case 'UNAUTHORIZED_ACCESS':
      return 'high';
    case 'AUTH_FAILURE':
      return 'medium';
    case 'RATE_LIMIT_EXCEEDED':
      return 'medium';
    case 'SUSPICIOUS_REQUEST':
      return 'medium';
    case 'INVALID_REQUEST':
      return 'low';
    case 'MIDDLEWARE_ERROR':
      return 'low';
    default:
      return 'medium';
  }
}

function shouldBlockEvent(type: SecurityEventType): boolean {
  return ['ATTACK_DETECTED', 'DATA_BREACH_ATTEMPT'].includes(type);
}

function alertCriticalSecurity(event: SecurityEvent): void {
  // Em produção: enviar para Slack, email, PagerDuty, etc.
  console.error(`🚨 CRITICAL SECURITY EVENT: ${event.type} from ${event.ip}`);
  
  // Exemplo de integração com webhook de alerta
  try {
    // await fetch('https://hooks.slack.com/services/YOUR/WEBHOOK/URL', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     text: `🚨 SECURITY ALERT: ${event.type}`,
    //     attachments: [{
    //       color: 'danger',
    //       fields: [
    //         { title: 'IP', value: event.ip, short: true },
    //         { title: 'Path', value: event.path || 'N/A', short: true },
    //         { title: 'Time', value: event.timestamp, short: true }
    //       ]
    //     }]
    //   })
    // });
  } catch (error) {
    console.error('Failed to send security alert:', error);
  }
}

const ipBlockList = new Set<string>();
const ipAttackCount = new Map<string, number>();

function shouldAutoBlock(ip: string): boolean {
  const count = ipAttackCount.get(ip) || 0;
  ipAttackCount.set(ip, count + 1);
  
  // Auto-block após 5 eventos de segurança críticos
  return count >= 5;
}

function autoBlockIP(ip: string): void {
  ipBlockList.add(ip);
  console.error(`🚫 AUTO-BLOCKED IP: ${ip} due to repeated security violations`);
  
  // Em produção: atualizar firewall, WAF, ou serviço de bloqueio
  // await updateFirewallRules(ip);
}

export function isIPBlocked(ip: string): boolean {
  return ipBlockList.has(ip);
}

export function getSecurityLogs(limit: number = 100): SecurityEvent[] {
  return securityLogs.slice(-limit).reverse(); // Mais recentes primeiro
}

export function getSecurityStats() {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;
  
  const recentLogs = securityLogs.filter(log => 
    new Date(log.timestamp).getTime() > now - oneDay
  );
  
  const hourlyLogs = securityLogs.filter(log =>
    new Date(log.timestamp).getTime() > now - oneHour
  );

  const statsByType = recentLogs.reduce((acc, log) => {
    acc[log.type] = (acc[log.type] || 0) + 1;
    return acc;
  }, {} as Record<SecurityEventType, number>);

  const statsBySeverity = recentLogs.reduce((acc, log) => {
    acc[log.severity] = (acc[log.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topAttackingIPs = Array.from(
    recentLogs.reduce((acc, log) => {
      acc.set(log.ip, (acc.get(log.ip) || 0) + 1);
      return acc;
    }, new Map<string, number>())
  )
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10);

  return {
    totalEvents24h: recentLogs.length,
    totalEventsHour: hourlyLogs.length,
    blockedIPs: ipBlockList.size,
    eventsByType: statsByType,
    eventsBySeverity: statsBySeverity,
    topAttackingIPs,
    criticalEvents: recentLogs.filter(log => log.severity === 'critical').length
  };
}
