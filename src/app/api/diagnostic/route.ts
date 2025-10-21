/**
 * Sistema de Diagnóstico Avançado - CVLetterAI
 * Auditoria completa do sistema de autenticação
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PasswordUtils } from '@/lib/security/auth-utils';
import { registerSchema, loginSchema } from '@/lib/validations/auth';

interface DiagnosticResult {
  component: string;
  status: 'OK' | 'ERROR' | 'WARNING';
  message: string;
  details?: any;
  timestamp: string;
}

export async function GET(request: NextRequest) {
  const results: DiagnosticResult[] = [];
  const startTime = Date.now();

  // 1. Database Connection Test
  try {
    await prisma.$connect();
    const userCount = await prisma.user.count();
    results.push({
      component: 'Database Connection',
      status: 'OK',
      message: `Connected successfully. Users in database: ${userCount}`,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    results.push({
      component: 'Database Connection',
      status: 'ERROR',
      message: `Database connection failed: ${error.message}`,
      details: error,
      timestamp: new Date().toISOString()
    });
  }

  // 2. Schema Validation Test
  try {
    const testData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      username: 'testuser',
      password: 'TestPass123!',
      confirmPassword: 'TestPass123!',
      agreeToTerms: true
    };
    
    const validatedData = registerSchema.parse(testData);
    results.push({
      component: 'Schema Validation',
      status: 'OK',
      message: 'Registration schema validation working correctly',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    results.push({
      component: 'Schema Validation',
      status: 'ERROR',
      message: `Schema validation failed: ${error.message}`,
      details: error.errors || error,
      timestamp: new Date().toISOString()
    });
  }

  // 3. Password Hashing Test
  try {
    const testPassword = 'TestPass123!';
    const hashedPassword = await PasswordUtils.hashPassword(testPassword);
    const isValid = await PasswordUtils.verifyPassword(testPassword, hashedPassword);
    
    if (isValid) {
      results.push({
        component: 'Password Hashing',
        status: 'OK',
        message: 'Password hashing and verification working correctly',
        timestamp: new Date().toISOString()
      });
    } else {
      results.push({
        component: 'Password Hashing',
        status: 'ERROR',
        message: 'Password verification failed',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error: any) {
    results.push({
      component: 'Password Hashing',
      status: 'ERROR',
      message: `Password hashing failed: ${error.message}`,
      details: error,
      timestamp: new Date().toISOString()
    });
  }

  // 4. Environment Variables Test
  const envVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ];

  envVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value) {
      results.push({
        component: `Environment Variable: ${envVar}`,
        status: 'OK',
        message: `Set correctly (${value.substring(0, 20)}...)`,
        timestamp: new Date().toISOString()
      });
    } else {
      results.push({
        component: `Environment Variable: ${envVar}`,
        status: 'ERROR',
        message: 'Not set or empty',
        timestamp: new Date().toISOString()
      });
    }
  });

  // 5. Database Schema Integrity Test
  try {
    // Test each table exists and has correct structure
    const tables = [
      'User', 'Account', 'Session', 'VerificationToken', 
      'PasswordResetToken', 'CvDraft', 'LetterDraft'
    ];
    
    for (const table of tables) {
      try {
        const query = `SELECT name FROM sqlite_master WHERE type='table' AND name='${table}';`;
        const result = await prisma.$queryRawUnsafe(query);
        if (Array.isArray(result) && result.length > 0) {
          results.push({
            component: `Database Table: ${table}`,
            status: 'OK',
            message: 'Table exists and accessible',
            timestamp: new Date().toISOString()
          });
        } else {
          results.push({
            component: `Database Table: ${table}`,
            status: 'ERROR',
            message: 'Table does not exist',
            timestamp: new Date().toISOString()
          });
        }
      } catch (error: any) {
        results.push({
          component: `Database Table: ${table}`,
          status: 'ERROR',
          message: `Table access failed: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      }
    }
  } catch (error: any) {
    results.push({
      component: 'Database Schema',
      status: 'ERROR',
      message: `Schema integrity check failed: ${error.message}`,
      details: error,
      timestamp: new Date().toISOString()
    });
  }

  // 6. User Creation Test (Dry Run)
  try {
    const testEmail = `test-${Date.now()}@diagnostic.local`;
    const testUser = {
      email: testEmail,
      username: `testuser${Date.now()}`,
      firstName: 'Diagnostic',
      lastName: 'Test',
      name: 'Diagnostic Test',
      password: await PasswordUtils.hashPassword('TestPass123!'),
      plan: 'free',
      isActive: true,
      isEmailVerified: false,
      lastLoginAt: new Date(),
    };

    // Create and immediately delete test user
    const createdUser = await prisma.user.create({
      data: testUser,
      select: { id: true, email: true }
    });
    
    await prisma.user.delete({
      where: { id: createdUser.id }
    });

    results.push({
      component: 'User Creation',
      status: 'OK',
      message: 'User creation and deletion working correctly',
      details: { testUserId: createdUser.id },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    results.push({
      component: 'User Creation',
      status: 'ERROR',
      message: `User creation failed: ${error.message}`,
      details: error,
      timestamp: new Date().toISOString()
    });
  }

  // 7. NextAuth Configuration Test
  try {
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    const nextAuthSecret = process.env.NEXTAUTH_SECRET;
    
    if (nextAuthUrl && nextAuthSecret) {
      results.push({
        component: 'NextAuth Configuration',
        status: 'OK',
        message: 'NextAuth environment variables properly configured',
        timestamp: new Date().toISOString()
      });
    } else {
      results.push({
        component: 'NextAuth Configuration',
        status: 'WARNING',
        message: 'Some NextAuth variables may be missing',
        details: {
          hasUrl: !!nextAuthUrl,
          hasSecret: !!nextAuthSecret
        },
        timestamp: new Date().toISOString()
      });
    }
  } catch (error: any) {
    results.push({
      component: 'NextAuth Configuration',
      status: 'ERROR',
      message: `NextAuth configuration check failed: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }

  const endTime = Date.now();
  const totalTime = endTime - startTime;

  // Summary
  const summary = {
    totalChecks: results.length,
    okCount: results.filter(r => r.status === 'OK').length,
    errorCount: results.filter(r => r.status === 'ERROR').length,
    warningCount: results.filter(r => r.status === 'WARNING').length,
    executionTime: `${totalTime}ms`,
    overallStatus: results.every(r => r.status === 'OK') ? 'HEALTHY' : 
                   results.some(r => r.status === 'ERROR') ? 'CRITICAL' : 'DEGRADED'
  };

  return NextResponse.json({
    status: 'success',
    summary,
    results,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}

// Test específico de registro
export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();

    if (action === 'test-registration') {
      // Test complete registration flow
      const testEmail = `test-${Date.now()}@diagnostic.local`;
      const testData = {
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        username: `testuser${Date.now()}`,
        password: 'TestPass123!',
        confirmPassword: 'TestPass123!',
        agreeToTerms: true
      };

      // Validate
      const validatedData = registerSchema.parse(testData);
      
      // Hash password
      const hashedPassword = await PasswordUtils.hashPassword(validatedData.password);
      
      // Create user
      const user = await prisma.user.create({
        data: {
          email: validatedData.email,
          username: validatedData.username,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          name: `${validatedData.firstName} ${validatedData.lastName}`,
          password: hashedPassword,
          plan: 'free',
          isActive: true,
          isEmailVerified: false,
          lastLoginAt: new Date(),
        },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          plan: true,
          createdAt: true,
        },
      });

      // Clean up test user
      await prisma.user.delete({
        where: { id: user.id }
      });

      return NextResponse.json({
        status: 'success',
        message: 'Registration flow test completed successfully',
        testUser: user,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      status: 'error',
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      details: error,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}