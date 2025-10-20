import { NextRequest } from 'next/server';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export async function validateRequest(request: NextRequest): Promise<ValidationResult> {
  const errors: string[] = [];
  const path = request.nextUrl.pathname;
  const method = request.method;
  const userAgent = request.headers.get('user-agent') || '';
  
  try {
    // 1. Validar User-Agent (detectar bots maliciosos)
    if (!userAgent || userAgent.length < 10) {
      errors.push('Invalid or missing User-Agent');
    }
    
    // 2. Validar Content-Type para POST/PUT requests
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const contentType = request.headers.get('content-type');
      if (!contentType) {
        errors.push('Missing Content-Type header');
      } else if (path.startsWith('/api/') && !contentType.includes('application/json')) {
        // API endpoints devem usar JSON
        if (!path.includes('webhook') && !path.includes('upload')) {
          errors.push('Invalid Content-Type for API endpoint');
        }
      }
    }
    
    // 3. Validar tamanho da requisição
    const contentLength = request.headers.get('content-length');
    if (contentLength) {
      const size = parseInt(contentLength, 10);
      const maxSize = path.includes('upload') ? 10 * 1024 * 1024 : 1024 * 1024; // 10MB para uploads, 1MB para outros
      
      if (size > maxSize) {
        errors.push(`Request too large: ${size} bytes (max: ${maxSize})`);
      }
    }
    
    // 4. Validar Path Traversal
    if (path.includes('../') || path.includes('..\\')) {
      errors.push('Path traversal attempt detected');
    }
    
    // 5. Validar caracteres suspeitos na URL
    const suspiciousChars = /<|>|script|javascript:|data:|vbscript:/i;
    if (suspiciousChars.test(path) || suspiciousChars.test(request.nextUrl.search)) {
      errors.push('Suspicious characters in URL');
    }
    
    // 6. Validar headers suspeitos
    const suspiciousHeaders = [
      'x-forwarded-host',
      'x-original-url',
      'x-rewrite-url'
    ];
    
    for (const header of suspiciousHeaders) {
      if (request.headers.has(header)) {
        errors.push(`Suspicious header detected: ${header}`);
      }
    }
    
    // 7. Validar origem para requests importantes
    if (path.startsWith('/api/auth/') || path.startsWith('/api/payments/')) {
      const origin = request.headers.get('origin');
      const host = request.headers.get('host');
      
      if (origin && host && !isValidOrigin(origin, host)) {
        errors.push('Invalid origin for sensitive endpoint');
      }
    }
    
    // 8. Validar body para JSON endpoints
    if (method !== 'GET' && path.startsWith('/api/') && !path.includes('webhook')) {
      try {
        const body = await (request.clone() as any).text();
        if (body && request.headers.get('content-type')?.includes('application/json')) {
          JSON.parse(body);
          
          // Validar tamanho do JSON
          if (body.length > 100000) { // 100KB max JSON
            errors.push('JSON body too large');
          }
          
          // Detectar JSON bombs (objetos muito aninhados)
          if (getJSONDepth(body) > 20) {
            errors.push('JSON too deeply nested');
          }
        }
      } catch (e) {
        errors.push('Invalid JSON in request body');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
    
  } catch (error) {
    console.error('Validation error:', error);
    return {
      valid: false,
      errors: ['Validation failed due to internal error']
    };
  }
}

function isValidOrigin(origin: string, host: string): boolean {
  try {
    const originUrl = new URL(origin);
    const allowedHosts = [
      host,
      'localhost:3000',
      'localhost',
      '127.0.0.1',
      '192.168.0.163'
    ];
    
    return allowedHosts.includes(originUrl.host);
  } catch {
    return false;
  }
}

function getJSONDepth(jsonString: string): number {
  let depth = 0;
  let maxDepth = 0;
  
  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString[i];
    if (char === '{' || char === '[') {
      depth++;
      maxDepth = Math.max(maxDepth, depth);
    } else if (char === '}' || char === ']') {
      depth--;
    }
  }
  
  return maxDepth;
}
