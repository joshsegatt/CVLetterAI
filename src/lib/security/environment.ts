import crypto from 'crypto';

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

    // Construir configuração segura
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

// Export singleton
export const environmentValidator = EnvironmentValidator.getInstance();
export const getSecurityConfig = () => environmentValidator.validateAndGetConfig();