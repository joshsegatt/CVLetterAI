import { NextRequest } from 'next/server';

export interface AttackPattern {
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

// Base de dados de assinaturas de ataques
const ATTACK_SIGNATURES = {
  // SQL Injection
  sqlInjection: [
    /union\s+select/i,
    /'\s+or\s+'1'\s*=\s*'1/i,
    /'\s+or\s+1\s*=\s*1/i,
    /'\s*;\s*drop\s+table/i,
    /'\s*;\s*delete\s+from/i,
    /'\s*;\s*insert\s+into/i,
    /'\s*;\s*update\s+\w+\s+set/i,
    /exec\s*\(\s*char/i,
    /char\s*\(\s*0x/i
  ],
  
  // XSS (Cross-Site Scripting)
  xss: [
    /<script[\s\S]*?>/i,
    /javascript\s*:/i,
    /vbscript\s*:/i,
    /data\s*:\s*text\/html/i,
    /on\w+\s*=\s*['"]/i,
    /<iframe[\s\S]*?>/i,
    /<object[\s\S]*?>/i,
    /<embed[\s\S]*?>/i,
    /eval\s*\(/i,
    /document\.cookie/i
  ],
  
  // Command Injection
  commandInjection: [
    /;\s*(ls|dir|cat|type|rm|del|mv|cp|copy)/i,
    /\|\s*(ls|dir|cat|type|rm|del|mv|cp|copy)/i,
    /&&\s*(ls|dir|cat|type|rm|del|mv|cp|copy)/i,
    /`[^`]*`/,
    /\$\([^)]*\)/,
    /\${[^}]*}/
  ],
  
  // Directory Traversal
  directoryTraversal: [
    /\.\.[\/\\]/,
    /%2e%2e[%2f%5c]/i,
    /\.\.%2f/i,
    /\.\.%5c/i,
    /\.\.\\/,
    /\.\.\/.*\/etc\/passwd/i,
    /\.\.\/.*\/windows\/system32/i
  ],
  
  // LDAP Injection
  ldapInjection: [
    /\(\|\(/,
    /\)\(\|/,
    /\*\)\(\|/,
    /\(\&\(/,
    /\)\)\(\&/
  ],
  
  // XML Injection
  xmlInjection: [
    /<\?xml/i,
    /<!DOCTYPE/i,
    /<!ENTITY/i,
    /<!\[CDATA\[/i
  ],
  
  // Path Manipulation
  pathManipulation: [
    /WEB-INF/i,
    /META-INF/i,
    /etc\/passwd/i,
    /boot\.ini/i,
    /windows\/system32/i
  ]
};

const MALICIOUS_USER_AGENTS = [
  'sqlmap',
  'nikto',
  'nessus',
  'burpsuite', 
  'nmap',
  'masscan',
  'zap',
  'w3af',
  'skipfish',
  'gobuster',
  'dirb',
  'dirbuster',
  'hydra',
  'medusa',
  'brutus'
];

const SCAN_PATTERNS = [
  // Common vulnerability scanner paths
  /wp-admin/i,
  /wp-login/i,
  /phpmyadmin/i,
  /admin/i,
  /login\.php/i,
  /config\.php/i,
  /database/i,
  /backup/i,
  /\.git/i,
  /\.svn/i,
  /\.env/i,
  /web\.config/i,
  /robots\.txt/i,
  /sitemap\.xml/i
];

export async function detectAttacks(
  request: NextRequest, 
  clientIP: string, 
  userAgent: string
): Promise<AttackPattern | null> {
  
  const path = request.nextUrl.pathname;
  const searchParams = request.nextUrl.search;
  const method = request.method;
  
  try {
    // 1. Verificar User-Agent malicioso
    const lowerUserAgent = userAgent.toLowerCase();
    for (const maliciousAgent of MALICIOUS_USER_AGENTS) {
      if (lowerUserAgent.includes(maliciousAgent)) {
        return {
          name: 'MALICIOUS_USER_AGENT',
          severity: 'high',
          description: `Malicious user agent detected: ${maliciousAgent}`
        };
      }
    }
    
    // 2. Detectar padrões de scan
    for (const scanPattern of SCAN_PATTERNS) {
      if (scanPattern.test(path)) {
        return {
          name: 'VULNERABILITY_SCAN',
          severity: 'medium',
          description: `Vulnerability scan pattern detected in path: ${path}`
        };
      }
    }
    
    // 3. Verificar assinaturas de ataques na URL
    const fullUrl = path + searchParams;
    
    // SQL Injection
    for (const pattern of ATTACK_SIGNATURES.sqlInjection) {
      if (pattern.test(fullUrl)) {
        return {
          name: 'SQL_INJECTION',
          severity: 'critical',
          description: 'SQL injection pattern detected in URL'
        };
      }
    }
    
    // XSS
    for (const pattern of ATTACK_SIGNATURES.xss) {
      if (pattern.test(fullUrl)) {
        return {
          name: 'XSS_ATTACK',
          severity: 'high',
          description: 'Cross-site scripting pattern detected in URL'
        };
      }
    }
    
    // Command Injection
    for (const pattern of ATTACK_SIGNATURES.commandInjection) {
      if (pattern.test(fullUrl)) {
        return {
          name: 'COMMAND_INJECTION',
          severity: 'critical',
          description: 'Command injection pattern detected in URL'
        };
      }
    }
    
    // Directory Traversal
    for (const pattern of ATTACK_SIGNATURES.directoryTraversal) {
      if (pattern.test(fullUrl)) {
        return {
          name: 'DIRECTORY_TRAVERSAL',
          severity: 'high',
          description: 'Directory traversal pattern detected in URL'
        };
      }
    }
    
    // 4. Verificar headers suspeitos
    const suspiciousHeaders = ['x-forwarded-host', 'x-original-url', 'x-rewrite-url'];
    for (const header of suspiciousHeaders) {
      if (request.headers.has(header)) {
        return {
          name: 'HEADER_INJECTION',
          severity: 'medium',
          description: `Suspicious header detected: ${header}`
        };
      }
    }
    
    // 5. Verificar body da requisição para POST/PUT
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        const body = await request.clone().text();
        if (body) {
          // SQL Injection no body
          for (const pattern of ATTACK_SIGNATURES.sqlInjection) {
            if (pattern.test(body)) {
              return {
                name: 'SQL_INJECTION_BODY',
                severity: 'critical',
                description: 'SQL injection pattern detected in request body'
              };
            }
          }
          
          // XSS no body
          for (const pattern of ATTACK_SIGNATURES.xss) {
            if (pattern.test(body)) {
              return {
                name: 'XSS_ATTACK_BODY',
                severity: 'high',
                description: 'XSS pattern detected in request body'
              };
            }
          }
          
          // XML Injection
          for (const pattern of ATTACK_SIGNATURES.xmlInjection) {
            if (pattern.test(body)) {
              return {
                name: 'XML_INJECTION',
                severity: 'high',
                description: 'XML injection pattern detected in request body'
              };
            }
          }
        }
      } catch (error) {
        // Body não disponível ou erro ao ler - não é necessariamente suspeito
        console.warn('Could not read request body for attack detection:', error);
      }
    }
    
    // 6. Detectar múltiplas requisições suspeitas do mesmo IP
    if (isHighFrequencyAttack(clientIP, path)) {
      return {
        name: 'HIGH_FREQUENCY_ATTACK',
        severity: 'medium',
        description: 'High frequency suspicious requests from same IP'
      };
    }
    
    return null; // Nenhum ataque detectado
    
  } catch (error) {
    console.error('Attack detection error:', error);
    return null; // Em caso de erro, assumir que não é ataque para não quebrar o serviço
  }
}

// Cache simples para detectar ataques de alta frequência
const attackFrequencyCache = new Map<string, number[]>();

function isHighFrequencyAttack(ip: string, path: string): boolean {
  const now = Date.now();
  const key = `${ip}:suspicious`;
  const window = 60000; // 1 minuto
  const threshold = 10; // 10 requests suspeitas por minuto
  
  if (!attackFrequencyCache.has(key)) {
    attackFrequencyCache.set(key, []);
  }
  
  const timestamps = attackFrequencyCache.get(key)!;
  
  // Remove timestamps antigos
  const cutoff = now - window;
  const filtered = timestamps.filter(t => t > cutoff);
  
  // Considera suspeito se for para paths comumente atacados
  const suspiciousPaths = ['/admin', '/login', '/wp-admin', '/.env', '/config'];
  if (suspiciousPaths.some(p => path.includes(p))) {
    filtered.push(now);
    attackFrequencyCache.set(key, filtered);
    return filtered.length > threshold;
  }
  
  return false;
}
