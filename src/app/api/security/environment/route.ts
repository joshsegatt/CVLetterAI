/**
 * Environment Validation API
 * Provides environment security validation and reporting for system administrators
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateEnvironment, generateSecurityReport } from '@/lib/security/environment';
import { z } from 'zod';

// Request validation schema
const validationRequestSchema = z.object({
  includeReport: z.boolean().optional().default(false),
  includeRecommendations: z.boolean().optional().default(true),
});

export async function GET(request: NextRequest) {
  try {
    // Security check - only allow in development or with admin token
    const isProduction = process.env.NODE_ENV === 'production';
    const adminToken = request.headers.get('x-admin-token');
    
    if (isProduction && adminToken !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin token required in production'
      }, { status: 401 });
    }

    // Parse query parameters
    const url = new URL(request.url);
    const params = {
      includeReport: url.searchParams.get('includeReport') === 'true',
      includeRecommendations: url.searchParams.get('includeRecommendations') !== 'false',
    };

    const validatedParams = validationRequestSchema.parse(params);
    
    // Perform environment validation
    const validation = validateEnvironment();
    
    // Build response
    const response: any = {
      success: true,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      validation: {
        isValid: validation.isValid,
        securityScore: validation.securityScore,
        errorCount: validation.errors.length,
        warningCount: validation.warnings.length,
        recommendationCount: validation.recommendations.length,
      }
    };

    // Include detailed issues if requested
    if (!validation.isValid || validation.warnings.length > 0) {
      response.issues = {};
      
      if (validation.errors.length > 0) {
        response.issues.errors = validation.errors;
      }
      
      if (validation.warnings.length > 0) {
        response.issues.warnings = validation.warnings;
      }
      
      if (validatedParams.includeRecommendations && validation.recommendations.length > 0) {
        response.issues.recommendations = validation.recommendations;
      }
    }

    // Include full security report if requested
    if (validatedParams.includeReport) {
      response.report = generateSecurityReport();
    }

    // Add security status
    response.securityStatus = {
      level: validation.securityScore >= 90 ? 'excellent' :
             validation.securityScore >= 75 ? 'good' :
             validation.securityScore >= 60 ? 'acceptable' :
             validation.securityScore >= 40 ? 'poor' : 'critical',
      
      readyForProduction: validation.isValid && validation.securityScore >= 75,
      
      nextSteps: validation.isValid 
        ? validation.recommendations.slice(0, 3)
        : validation.errors.slice(0, 3).map(error => `Fix: ${error}`)
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Environment validation API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Environment validation failed',
      details: process.env.NODE_ENV === 'development' 
        ? error instanceof Error ? error.message : 'Unknown error'
        : undefined,
    }, { status: 500 });
  }
}

/**
 * POST endpoint for validating specific environment configurations
 */
export async function POST(request: NextRequest) {
  try {
    // Security check - only allow in development or with admin token
    const isProduction = process.env.NODE_ENV === 'production';
    const adminToken = request.headers.get('x-admin-token');
    
    if (isProduction && adminToken !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin token required in production'
      }, { status: 401 });
    }

    const body = await request.json();
    
    // Schema for custom environment validation
    const customValidationSchema = z.object({
      variables: z.record(z.string()),
      checkProduction: z.boolean().optional().default(false),
      generateReport: z.boolean().optional().default(false),
    });
    
    const validatedBody = customValidationSchema.parse(body);
    
    // Validate provided environment variables
    const results = validateCustomEnvironmentVariables(
      validatedBody.variables,
      validatedBody.checkProduction
    );
    
    const response: any = {
      success: true,
      timestamp: new Date().toISOString(),
      validation: results,
    };
    
    if (validatedBody.generateReport) {
      response.report = generateCustomEnvironmentReport(
        validatedBody.variables,
        results
      );
    }
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('Custom environment validation error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Custom validation failed',
      details: process.env.NODE_ENV === 'development'
        ? error instanceof Error ? error.message : 'Unknown error'
        : undefined,
    }, { status: 400 });
  }
}

/**
 * Validate custom environment variables
 */
function validateCustomEnvironmentVariables(
  variables: Record<string, string>,
  isProduction: boolean = false
) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];
  
  const sensitivePatterns = [
    /password/i, /secret/i, /key/i, /token/i, /auth/i, /api_key/i, /private/i
  ];
  
  for (const [key, value] of Object.entries(variables)) {
    // Check for empty values
    if (!value || value.trim() === '') {
      errors.push(`${key} is empty or not set`);
      continue;
    }
    
    // Check for placeholder values
    if (value.includes('changeme') || value.includes('example') || value === 'your-key-here') {
      errors.push(`${key} contains placeholder value`);
      continue;
    }
    
    // Check sensitive variables
    const isSensitive = sensitivePatterns.some(pattern => pattern.test(key));
    
    if (isSensitive) {
      if (value.length < 16) {
        warnings.push(`${key} appears too short for a secure secret`);
      }
      
      if (isProduction) {
        if (key.includes('SECRET') && value.length < 32) {
          errors.push(`${key} must be at least 32 characters in production`);
        }
        
        if (key.includes('STRIPE') && !value.startsWith('sk_live_')) {
          warnings.push(`${key} should use production keys (sk_live_) in production`);
        }
      }
    }
    
    // URL validation
    if (key.includes('URL') || key.includes('ENDPOINT')) {
      try {
        const url = new URL(value);
        
        if (isProduction && url.protocol !== 'https:') {
          errors.push(`${key} should use HTTPS in production`);
        }
        
        if (isProduction && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) {
          errors.push(`${key} should not use localhost in production`);
        }
      } catch {
        errors.push(`${key} is not a valid URL`);
      }
    }
    
    // Database URL specific checks
    if (key === 'DATABASE_URL') {
      if (isProduction && value.includes('sqlite')) {
        errors.push('SQLite is not suitable for production environments');
      }
      
      if (!value.includes('ssl') && isProduction) {
        recommendations.push('Consider enabling SSL for database connections');
      }
    }
  }
  
  const securityScore = Math.max(0, 100 - (errors.length * 20) - (warnings.length * 10));
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    recommendations,
    securityScore,
    variablesChecked: Object.keys(variables).length,
  };
}

/**
 * Generate custom environment report
 */
function generateCustomEnvironmentReport(
  variables: Record<string, string>,
  validation: any
): string {
  return `
# Custom Environment Validation Report
Generated: ${new Date().toISOString()}

## Variables Checked: ${validation.variablesChecked}
## Security Score: ${validation.securityScore}/100
## Status: ${validation.isValid ? '✅ VALID' : '❌ INVALID'}

### Variables Analyzed
${Object.keys(variables).map(key => `- ${key}`).join('\n')}

${validation.errors.length > 0 ? `
### ❌ Critical Issues
${validation.errors.map((error: string) => `- ${error}`).join('\n')}
` : ''}

${validation.warnings.length > 0 ? `
### ⚠️ Warnings
${validation.warnings.map((warning: string) => `- ${warning}`).join('\n')}
` : ''}

${validation.recommendations.length > 0 ? `
### 💡 Recommendations
${validation.recommendations.map((rec: string) => `- ${rec}`).join('\n')}
` : ''}

### Security Guidelines
1. Use strong, unique secrets (32+ characters)
2. Never hardcode secrets in code
3. Use HTTPS URLs in production
4. Rotate secrets regularly
5. Use production keys only in production
6. Enable SSL for database connections
7. Monitor for exposed secrets
`;
}
