import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { z } from 'zod';

export function getClientIp(request: NextRequest): string {
  // Check various headers for client IP (in order of preference)
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIp = request.headers.get('x-real-ip');
  const xClientIp = request.headers.get('x-client-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (xForwardedFor) {
    // X-Forwarded-For can contain multiple IPs, get the first one
    return xForwardedFor.split(',')[0].trim();
  }
  
  if (xRealIp) {
    return xRealIp;
  }
  
  if (xClientIp) {
    return xClientIp;
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  // Fallback to a default IP if none found
  return '127.0.0.1';
}

export interface SecurityConfig {
  jwt: {
    secret: string;
    refreshSecret: string;
    accessTokenExpiry: string;
    refreshTokenExpiry: string;
  };
  encryption: {
    key: Buffer;
    algorithm: string;
  };
  session: {
    secret: string;
    maxAge: number;
    secure: boolean;
  };
  rateLimit: {
    window: number;
    maxRequests: number;
    skipSuccessfulRequests: boolean;
  };
  security: {
    forceHttps: boolean;
    hstsMaxAge: number;
    allowedOrigins: string[];
    cookieDomain: string;
  };
}

class EnvironmentValidator {
  private static instance: EnvironmentValidator;
  private config: SecurityConfig | null = null;

  private constructor() {}

  public static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator();
    }
    return EnvironmentValidator.instance;
  }

  public validateAndGetConfig(): SecurityConfig {
    if (this.config) {
      return this.config;
    }

    const errors: string[] = [];
    const env = process.env;
    const isProduction = env.NODE_ENV === 'production';

    // Validar JWT Secrets
    const jwtSecret = env.JWT_SECRET;
    const refreshSecret = env.JWT_REFRESH_SECRET;
    
    if (!jwtSecret) {
      errors.push('JWT_SECRET is required');
    } else if (isProduction && jwtSecret.length < 32) {
      errors.push('JWT_SECRET must be at least 32 characters in production');
    }

    if (!refreshSecret) {
      errors.push('JWT_REFRESH_SECRET is required');
    } else if (isProduction && refreshSecret.length < 32) {
      errors.push('JWT_REFRESH_SECRET must be at least 32 characters in production');
    }

    if (jwtSecret === refreshSecret) {
      errors.push('JWT_SECRET and JWT_REFRESH_SECRET must be different');
    }

    // Validar Encryption Key
    const encryptionKey = env.ENCRYPTION_KEY;
    if (!encryptionKey) {
      errors.push('ENCRYPTION_KEY is required');
    } else if (isProduction && encryptionKey.length < 32) {
      errors.push('ENCRYPTION_KEY must be at least 32 characters in production');
    }

    // Validar Session Secret
    const sessionSecret = env.SESSION_SECRET;
    if (!sessionSecret) {
      errors.push('SESSION_SECRET is required');
    } else if (isProduction && sessionSecret.length < 32) {
      errors.push('SESSION_SECRET must be at least 32 characters in production');
    }

    // Validar Database URL
    const databaseUrl = env.DATABASE_URL;
    if (!databaseUrl) {
      errors.push('DATABASE_URL is required');
    } else if (isProduction && databaseUrl.includes('localhost')) {
      console.warn('⚠️  WARNING: Using localhost database in production');
    }

    // Validar HTTPS em produção
    if (isProduction) {
      const forceHttps = env.FORCE_HTTPS;
      if (forceHttps !== 'true') {
        console.warn('⚠️  WARNING: FORCE_HTTPS should be true in production');
      }

      const siteUrl = env.NEXT_PUBLIC_SITE_URL;
      if (siteUrl && !siteUrl.startsWith('https://')) {
        console.warn('⚠️  WARNING: NEXT_PUBLIC_SITE_URL should use HTTPS in production');
      }
    }

    // Se há erros críticos, falhar
    if (errors.length > 0) {
      console.error('❌ Critical environment validation errors:');
      errors.forEach(error => console.error(`   - ${error}`));
      
      if (isProduction) {
        process.exit(1); // Falhar em produção
      } else {
        console.warn('⚠️  Using default values for development (INSECURE)');
      }
    }

    // Build secure configuration
    this.config = {
      jwt: {
        secret: jwtSecret || this.generateSecureDefault('jwt'),
        refreshSecret: refreshSecret || this.generateSecureDefault('refresh'),
        accessTokenExpiry: '15m',
        refreshTokenExpiry: '7d'
      },
      encryption: {
        key: Buffer.from(encryptionKey || this.generateSecureDefault('encryption'), 'utf8'),
        algorithm: 'aes-256-gcm'
      },
      session: {
        secret: sessionSecret || this.generateSecureDefault('session'),
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        secure: isProduction
      },
      rateLimit: {
        window: parseInt(env.RATE_LIMIT_WINDOW || '900000'), // 15 minutos
        maxRequests: parseInt(env.RATE_LIMIT_MAX_REQUESTS || '100'),
        skipSuccessfulRequests: true
      },
      security: {
        forceHttps: env.FORCE_HTTPS === 'true',
        hstsMaxAge: parseInt(env.HSTS_MAX_AGE || '31536000'), // 1 ano
        allowedOrigins: env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        cookieDomain: env.COOKIE_DOMAIN || (isProduction ? '.yourdomain.com' : 'localhost')
      }
    };

    // Log de inicialização segura
    console.log('🛡️  Security configuration loaded successfully');
    if (!isProduction) {
      console.log('🔧 Development mode - some security features are relaxed');
    }

    return this.config;
  }

  private generateSecureDefault(type: string): string {
    const randomBytes = crypto.randomBytes(32).toString('hex');
    console.warn(`⚠️  Generated secure default for ${type.toUpperCase()} - use .env file in production`);
    return randomBytes;
  }

  public getRequiredEnvironmentVars(): string[] {
    return [
      'JWT_SECRET',
      'JWT_REFRESH_SECRET', 
      'ENCRYPTION_KEY',
      'SESSION_SECRET',
      'DATABASE_URL'
    ];
  }

  public validateProductionReadiness(): { ready: boolean; issues: string[] } {
    const issues: string[] = [];
    const env = process.env;

    // Verificações críticas para produção
    const criticalChecks = [
      { key: 'NODE_ENV', value: 'production', check: (val: string) => val === 'production' },
      { key: 'JWT_SECRET', check: (val: string) => val && val.length >= 32 },
      { key: 'JWT_REFRESH_SECRET', check: (val: string) => val && val.length >= 32 },
      { key: 'ENCRYPTION_KEY', check: (val: string) => val && val.length >= 32 },
      { key: 'DATABASE_URL', check: (val: string) => val && !val.includes('localhost') },
      { key: 'FORCE_HTTPS', value: 'true', check: (val: string) => val === 'true' },
      { key: 'NEXT_PUBLIC_SITE_URL', check: (val: string) => val && val.startsWith('https://') }
    ];

    criticalChecks.forEach(check => {
      const value = env[check.key];
      if (!value || !check.check(value)) {
        if ('value' in check) {
          issues.push(`${check.key} must be set to "${check.value}"`);
        } else {
          issues.push(`${check.key} is missing or invalid`);
        }
      }
    });

    // Verificações recomendadas
    const recommendedChecks = [
      'SENTRY_DSN',
      'REDIS_URL',
      'SENDGRID_API_KEY',
      'STRIPE_SECRET_KEY'
    ];

    recommendedChecks.forEach(key => {
      if (!env[key]) {
        console.warn(`⚠️  Recommended: ${key} is not set`);
      }
    });

    return {
      ready: issues.length === 0,
      issues
    };
  }
}

// Funções utilitárias para criptografia
export class SecureDataHandler {
  private static config: SecurityConfig;

  static initialize() {
    const validator = EnvironmentValidator.getInstance();
    SecureDataHandler.config = validator.validateAndGetConfig();
  }

  static encrypt(text: string): string {
    if (!SecureDataHandler.config) {
      SecureDataHandler.initialize();
    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(SecureDataHandler.config.encryption.algorithm, SecureDataHandler.config.encryption.key);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  static decrypt(encryptedText: string): string {
    if (!SecureDataHandler.config) {
      SecureDataHandler.initialize();
    }

    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipher(SecureDataHandler.config.encryption.algorithm, SecureDataHandler.config.encryption.key);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  static hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  static secureCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    
    return result === 0;
  }
}

// Modern environment validation schemas
const requiredEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().min(10, 'DATABASE_URL is required'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
});

const productionEnvSchema = requiredEnvSchema.extend({
  // Production-only requirements
  DATABASE_URL: z.string().refine(
    (url) => !url.includes('sqlite'), 
    'Production should use PostgreSQL/MySQL, not SQLite'
  ),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_live_', 'Production must use live Stripe key').optional(),
  NEXTAUTH_URL: z.string().refine(
    (url) => url.startsWith('https://') && !url.includes('localhost'),
    'Production NEXTAUTH_URL must use HTTPS and not localhost'
  ),
});

/**
 * Enhanced environment security with comprehensive validation
 */
export class EnhancedEnvironmentSecurity {
  /**
   * Validate environment with modern schema validation
   */
  static validateModernEnvironment() {
    const env = process.env;
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    
    try {
      // Choose schema based on environment
      const schema = env.NODE_ENV === 'production' ? productionEnvSchema : requiredEnvSchema;
      const result = schema.safeParse(env);
      
      if (!result.success) {
        errors.push(...result.error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ));
      }
      
      // Additional security checks
      this.performAdvancedSecurityChecks(env, errors, warnings, recommendations);
      
      const securityScore = this.calculateAdvancedSecurityScore(env, errors.length, warnings.length);
      
      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        recommendations,
        securityScore
      };
    } catch (error) {
      errors.push(`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { isValid: false, errors, warnings, recommendations, securityScore: 0 };
    }
  }
  
  /**
   * Advanced security checks
   */
  private static performAdvancedSecurityChecks(
    env: NodeJS.ProcessEnv,
    errors: string[],
    warnings: string[],
    recommendations: string[]
  ) {
    // Check for weak secrets
    const secrets = ['NEXTAUTH_SECRET', 'JWT_SECRET', 'ENCRYPTION_KEY'];
    secrets.forEach(secretName => {
      const secret = env[secretName];
      if (secret && secret.length < 32) {
        warnings.push(`${secretName} should be at least 32 characters for security`);
      }
    });
    
    // Production-specific checks
    if (env.NODE_ENV === 'production') {
      if (!env.SENTRY_DSN && !env.MONITORING_ENDPOINT) {
        recommendations.push('Add error monitoring (Sentry) for production');
      }
      
      if (!env.REDIS_URL) {
        recommendations.push('Consider Redis for production caching and sessions');
      }
      
      // Security headers
      if (!env.CSP_REPORT_URI) {
        recommendations.push('Add CSP_REPORT_URI for Content Security Policy monitoring');
      }
    }
  }
  
  /**
   * Calculate advanced security score
   */
  private static calculateAdvancedSecurityScore(
    env: NodeJS.ProcessEnv,
    errorCount: number,
    warningCount: number
  ): number {
    let score = 100;
    
    // Deduct for issues
    score -= errorCount * 25;
    score -= warningCount * 10;
    
    // Bonus points for security features
    const bonusFeatures = [
      env.SENTRY_DSN && 5,
      env.REDIS_URL && 5,
      env.CSP_REPORT_URI && 5,
      (env.NEXTAUTH_SECRET && env.NEXTAUTH_SECRET.length >= 64) && 5,
      env.NODE_ENV === 'production' && !env.DATABASE_URL?.includes('sqlite') && 10
    ].filter(Boolean) as number[];
    
    score += bonusFeatures.reduce((sum, points) => sum + points, 0);
    
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Generate comprehensive security report
   */
  static generateSecurityReport(): string {
    const validation = this.validateModernEnvironment();
    
    return `
# Environment Security Report
Generated: ${new Date().toISOString()}

## Security Score: ${validation.securityScore}/100

## Status: ${validation.isValid ? '✅ VALID' : '❌ INVALID'}

${validation.errors.length > 0 ? `
### ❌ Critical Errors
${validation.errors.map(error => `- ${error}`).join('\n')}
` : ''}

${validation.warnings.length > 0 ? `
### ⚠️ Warnings
${validation.warnings.map(warning => `- ${warning}`).join('\n')}
` : ''}

${validation.recommendations.length > 0 ? `
### 💡 Recommendations
${validation.recommendations.map(rec => `- ${rec}`).join('\n')}
` : ''}

## Security Checklist for Production

### ✅ Required
- [ ] Strong NEXTAUTH_SECRET (32+ characters)
- [ ] Production database (not SQLite)
- [ ] HTTPS URLs only
- [ ] Environment variables properly set

### 🔒 Recommended
- [ ] Error monitoring (Sentry)
- [ ] Redis for caching
- [ ] CSP monitoring
- [ ] Regular secret rotation
- [ ] Monitoring and alerting

### 🛡️ Best Practices
- [ ] Secrets stored securely (not in code)
- [ ] Regular security audits
- [ ] Access logging enabled
- [ ] Rate limiting configured
- [ ] Backup and recovery tested
`;
  }
}

// Export both legacy and modern systems
export const environmentValidator = EnvironmentValidator.getInstance();
export const getSecurityConfig = () => environmentValidator.validateAndGetConfig();
export const validateEnvironment = () => EnhancedEnvironmentSecurity.validateModernEnvironment();
export const generateSecurityReport = () => EnhancedEnvironmentSecurity.generateSecurityReport();
