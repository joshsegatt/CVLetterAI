/**
 * Startup Environment Validation
 * Automatically validates environment configuration during application startup
 */

import { validateEnvironment } from '@/lib/security/environment';

/**
 * Validates environment configuration on application startup
 * Fails fast in production if critical issues are found
 */
export function validateEnvironmentOnStartup(): void {
  console.log('🔍 Validating environment configuration...');
  
  const validation = validateEnvironment();
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Always log validation results
  console.log(`🔒 Environment security score: ${validation.securityScore}/100`);
  
  if (validation.isValid) {
    console.log('✅ Environment validation passed');
  } else {
    console.error('❌ Environment validation failed');
    
    // Log critical errors
    if (validation.errors.length > 0) {
      console.error('\nCritical errors:');
      validation.errors.forEach(error => console.error(`  ❌ ${error}`));
    }
    
    // In production, fail fast on critical errors
    if (isProduction) {
      console.error('\n🚨 Application cannot start with invalid environment configuration in production');
      process.exit(1);
    }
  }
  
  // Log warnings in development
  if (validation.warnings.length > 0 && !isProduction) {
    console.warn('\nEnvironment warnings:');
    validation.warnings.forEach(warning => console.warn(`  ⚠️  ${warning}`));
  }
  
  // Log recommendations in development
  if (validation.recommendations.length > 0 && !isProduction) {
    console.info('\nSecurity recommendations:');
    validation.recommendations.forEach(rec => console.info(`  💡 ${rec}`));
  }
  
  // Production readiness check
  if (isProduction) {
    const productionChecks = validateProductionReadiness();
    if (!productionChecks.ready) {
      console.error('\n🚨 Production readiness check failed:');
      productionChecks.issues.forEach(issue => console.error(`  ❌ ${issue}`));
      process.exit(1);
    } else {
      console.log('🚀 Application is production-ready');
    }
  }
  
  console.log(''); // Empty line for readability
}

/**
 * Check if environment is ready for production deployment
 */
function validateProductionReadiness(): { ready: boolean; issues: string[] } {
  const issues: string[] = [];
  const env = process.env;
  
  // Critical production requirements
  const criticalChecks = [
    {
      name: 'Node Environment',
      check: () => env.NODE_ENV === 'production',
      message: 'NODE_ENV must be set to "production"'
    },
    {
      name: 'HTTPS URLs',
      check: () => env.NEXTAUTH_URL?.startsWith('https://') || false,
      message: 'NEXTAUTH_URL must use HTTPS in production'
    },
    {
      name: 'Strong Auth Secret',
      check: () => env.NEXTAUTH_SECRET && env.NEXTAUTH_SECRET.length >= 32,
      message: 'NEXTAUTH_SECRET must be at least 32 characters'
    },
    {
      name: 'Production Database',
      check: () => env.DATABASE_URL && !env.DATABASE_URL.includes('sqlite'),
      message: 'Production should use PostgreSQL or MySQL, not SQLite'
    },
    {
      name: 'No Localhost URLs',
      check: () => !env.NEXTAUTH_URL?.includes('localhost'),
      message: 'No localhost URLs allowed in production'
    }
  ];
  
  // Run all critical checks
  criticalChecks.forEach(check => {
    if (!check.check()) {
      issues.push(check.message);
    }
  });
  
  // Stripe production check
  if (env.STRIPE_SECRET_KEY && !env.STRIPE_SECRET_KEY.startsWith('sk_live_')) {
    issues.push('Stripe secret key should be a live key (sk_live_) in production');
  }
  
  return {
    ready: issues.length === 0,
    issues
  };
}

/**
 * Middleware to check environment on each request (development only)
 */
export function createEnvironmentCheckMiddleware() {
  let lastValidation: Date | null = null;
  const validationInterval = 5 * 60 * 1000; // 5 minutes
  
  return (req: any, res: any, next: any) => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') {
      return next();
    }
    
    // Only check periodically
    const now = new Date();
    if (lastValidation && (now.getTime() - lastValidation.getTime()) < validationInterval) {
      return next();
    }
    
    lastValidation = now;
    
    // Run validation
    const validation = validateEnvironment();
    
    // Log any new issues
    if (!validation.isValid) {
      console.warn('⚠️  Environment validation issues detected:');
      validation.errors.forEach(error => console.warn(`  - ${error}`));
    }
    
    next();
  };
}

/**
 * Generate environment setup script
 */
export function generateEnvironmentSetupScript(): string {
  return `#!/bin/bash
# Environment Setup Script
# Generated: ${new Date().toISOString()}

echo "🔧 Setting up environment configuration..."

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    
    # Generate secure secrets
    NEXTAUTH_SECRET=$(openssl rand -hex 32)
    JWT_SECRET=$(openssl rand -hex 32)
    ENCRYPTION_KEY=$(openssl rand -hex 32)
    
    cat > .env.local << EOF
# Environment Configuration
# Generated on $(date)

NODE_ENV=development
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# JWT Configuration  
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$ENCRYPTION_KEY

# Stripe (use test keys in development)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# AI Services
OLLAMA_BASE_URL=http://localhost:11434
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...

# Optional OAuth providers
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# GITHUB_ID=your-github-client-id  
# GITHUB_SECRET=your-github-client-secret
EOF

    echo "✅ .env.local created with secure defaults"
else
    echo "⚠️  .env.local already exists, skipping creation"
fi

# Validate environment
echo "🔍 Validating environment configuration..."
npm run validate-env 2>/dev/null || echo "⚠️  Run 'npm run validate-env' to check configuration"

echo "✅ Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Review and customize .env.local"
echo "2. Add your API keys and secrets"  
echo "3. Run 'npm run dev' to start development"
echo "4. Visit http://localhost:3000/api/security/environment for validation report"
`;
}

/**
 * Package.json script to add environment validation
 */
export function getEnvironmentValidationScript(): string {
  return `
Add this script to your package.json:

{
  "scripts": {
    "validate-env": "node -e \\"const { validateEnvironment } = require('./dist/lib/security/environment'); const result = validateEnvironment(); if (!result.isValid) { console.error('Environment validation failed'); process.exit(1); } console.log('Environment validation passed');\\"",
    "setup-env": "node -e \\"const fs = require('fs'); const { generateEnvironmentSetupScript } = require('./dist/lib/startup/environment'); fs.writeFileSync('setup-env.sh', generateEnvironmentSetupScript()); console.log('Setup script generated: ./setup-env.sh');\\"",
    "security-report": "node -e \\"const { generateSecurityReport } = require('./dist/lib/security/environment'); console.log(generateSecurityReport());\\"" 
  }
}

Usage:
- npm run validate-env    # Validate current environment
- npm run setup-env      # Generate setup script  
- npm run security-report # Generate security report
`;
}

// Auto-run validation on module import in development
if (process.env.NODE_ENV === 'development' && !process.env.SKIP_ENV_VALIDATION) {
  // Run validation but don't fail fast in development
  try {
    validateEnvironmentOnStartup();
  } catch (error) {
    console.warn('⚠️  Environment validation check failed:', error);
  }
}
