import { NextRequest, NextResponse } from 'next/server';

// Global stores para rate limiting e logs de segurança
declare global {
  var rateLimitStore: Map<string, { count: number; resetTime: number }> | undefined;
  var securityLogs: any[] | undefined;
  var ipBlockList: Set<string> | undefined;
}

// Rate limits por tipo de requisição (Banking-level)
const RATE_LIMITS = {
  api: { requests: 100, window: 900000 }, // 100 req/15min para APIs
  auth: { requests: 5, window: 300000 }, // 5 tentativas/5min para auth
  global: { requests: 1000, window: 3600000 }, // 1000 req/hora global
  ai: { requests: 100, window: 300000 } // 100 req/5min para AI chat (free tier)
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';
  const path = request.nextUrl.pathname;

  try {
    // 1. Verificar IP bloqueado
    if (isIPBlocked(ip)) {
      logSecurityEvent('BLOCKED_IP_ACCESS', { ip, path, userAgent });
      return new NextResponse('Forbidden', { status: 403 });
    }

    // 2. Detectar ataques conhecidos
    const attackDetected = detectBasicAttacks(request, userAgent);
    if (attackDetected) {
      logSecurityEvent('ATTACK_DETECTED', { ip, path, userAgent, attack: attackDetected });
      return new NextResponse('Forbidden', { status: 403 });
    }

    // 3. Validação básica da requisição
    const validationErrors = validateBasicRequest(request);
    if (validationErrors.length > 0) {
      logSecurityEvent('INVALID_REQUEST', { ip, path, errors: validationErrors });
      return new NextResponse('Bad Request', { status: 400 });
    }

    // 4. Verificar acesso baseado em planos (Pro/Enterprise)
    // Allow unauthenticated access to chat page for demo
    if (!path.startsWith('/chat')) {
      try {
        const { checkPlanAccess } = await import('./services/auth/planAccess');
        const planAccessResult = checkPlanAccess(request);
        if (planAccessResult) {
          logSecurityEvent('PLAN_ACCESS_DENIED', { ip, path, userAgent });
          return planAccessResult;
        }
      } catch (error) {
        // Se não conseguir carregar o sistema de planos, continua normalmente
        console.log('Plan access system not available:', error);
      }
    }

    // 5. Rate Limiting por tipo de endpoint
    let rateLimit = RATE_LIMITS.global;
    
    if (path.startsWith('/api/auth/')) {
      rateLimit = RATE_LIMITS.auth;
    } else if (path.startsWith('/api/ai/') || path.startsWith('/chat')) {
      rateLimit = RATE_LIMITS.ai;
    } else if (path.startsWith('/api/')) {
      rateLimit = RATE_LIMITS.api;
    }

    const rateLimitResult = checkRateLimit(ip, path, rateLimit);
    if (!rateLimitResult.success) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { ip, path, limit: rateLimit });
      return new NextResponse('Too Many Requests', { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil(rateLimitResult.resetTime / 1000).toString(),
          'X-RateLimit-Limit': rateLimit.requests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
        }
      });
    }

    // 6. Headers de segurança adicionais baseados no path
    addSecurityHeaders(response, path);

    // 7. Log de requisições suspeitas
    if (isSuspiciousRequest(request, ip)) {
      logSecurityEvent('SUSPICIOUS_REQUEST', { ip, path, userAgent });
    }

    return response;

  } catch (error) {
    console.error('Middleware security error:', error);
    logSecurityEvent('MIDDLEWARE_ERROR', { ip, path, error: error?.toString() });
    return NextResponse.next(); // Continua em caso de erro para não quebrar o site
  }
}

// Security helper functions
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIP) return realIP;
  if (cfIP) return cfIP;
  
  return 'unknown';
}

function checkRateLimit(ip: string, path: string, limit: { requests: number; window: number }) {
  if (!global.rateLimitStore) {
    global.rateLimitStore = new Map();
  }
  
  const key = `ratelimit:${ip}:${path.split('/')[1] || 'root'}`;
  const now = Date.now();
  const store = global.rateLimitStore;
  const record = store.get(key) || { count: 0, resetTime: now + limit.window };
  
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + limit.window;
  } else {
    record.count++;
  }
  
  store.set(key, record);
  
  return {
    success: record.count <= limit.requests,
    resetTime: record.resetTime,
    remaining: Math.max(0, limit.requests - record.count)
  };
}

function logSecurityEvent(type: string, data: any) {
  if (!global.securityLogs) {
    global.securityLogs = [];
  }
  
  const event = {
    timestamp: new Date().toISOString(),
    type,
    ...data
  };
  
  console.warn(`[SECURITY] ${type}:`, event);
  global.securityLogs.push(event);
  
  if (global.securityLogs.length > 1000) {
    global.securityLogs.shift();
  }
}

function isIPBlocked(ip: string): boolean {
  if (!global.ipBlockList) {
    global.ipBlockList = new Set();
  }
  return global.ipBlockList.has(ip);
}

function detectBasicAttacks(request: NextRequest, userAgent: string): string | null {
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const fullUrl = path + search;
  
  // Detectar user agents maliciosos
  const maliciousAgents = ['sqlmap', 'nikto', 'nessus', 'burpsuite', 'nmap'];
  for (const agent of maliciousAgents) {
    if (userAgent.toLowerCase().includes(agent)) {
      return `Malicious user agent: ${agent}`;
    }
  }
  
  // SQL Injection básico
  if (/union\s+select|'\s+or\s+'1'\s*=\s*'1|'\s+or\s+1\s*=\s*1/i.test(fullUrl)) {
    return 'SQL injection attempt';
  }
  
  // XSS básico
  if (/<script|javascript:|vbscript:|onload\s*=/i.test(fullUrl)) {
    return 'XSS attempt';
  }
  
  // Directory traversal
  if (/\.\.[\/\\]|%2e%2e/i.test(fullUrl)) {
    return 'Directory traversal attempt';
  }
  
  // Scan patterns
  if (/wp-admin|phpmyadmin|\.env|config\.php/i.test(path)) {
    return 'Vulnerability scan';
  }
  
  return null;
}

function validateBasicRequest(request: NextRequest): string[] {
  const errors: string[] = [];
  const userAgent = request.headers.get('user-agent') || '';
  
  if (!userAgent || userAgent.length < 5) {
    errors.push('Invalid User-Agent');
  }
  
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
    errors.push('Request too large');
  }
  
  return errors;
}

function addSecurityHeaders(response: NextResponse, path: string) {
  // Headers específicos por tipo de página
  if (path.startsWith('/api/')) {
    response.headers.set('X-API-Version', '1.0');
    response.headers.set('X-Content-Type-Options', 'nosniff');
  }
  
  if (path.includes('auth') || path.includes('login') || path.includes('signup')) {
    response.headers.set('Clear-Site-Data', '"cache", "cookies", "storage"');
  }
  
  if (path.startsWith('/dashboard') || path.includes('settings')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  }

  // Nonce para CSP (Content Security Policy)
  const nonce = generateNonce();
  response.headers.set('X-CSP-Nonce', nonce);
}

function isSuspiciousRequest(request: NextRequest, ip: string): boolean {
  const path = request.nextUrl.pathname;
  const userAgent = request.headers.get('user-agent') || '';
  
  // Detectar padrões suspeitos
  const suspiciousPatterns = [
    /\.\./,  // Directory traversal
    /script/i,  // Script injection attempts
    /union.*select/i,  // SQL injection
    /exec|eval|system/i,  // Command injection
    /<script|javascript:/i,  // XSS attempts
  ];
  
  const suspiciousUserAgents = [
    'sqlmap',
    'nikto',
    'nessus',
    'burpsuite',
    'nmap',
    'masscan'
  ];
  
  // Verificar path
  if (suspiciousPatterns.some(pattern => pattern.test(path))) {
    return true;
  }
  
  // Verificar user agent
  if (suspiciousUserAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    return true;
  }
  
  // Verificar múltiplas tentativas de paths inexistentes
  if (path.includes('wp-admin') || path.includes('.php') || path.includes('phpmyadmin')) {
    return true;
  }
  
  return false;
}

function generateNonce(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64');
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth (NextAuth routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api/auth).*)',
  ],
};