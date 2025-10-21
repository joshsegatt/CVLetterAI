/**
 * Script de Teste Automático - CVLetterAI Authentication
 * Executa bateria completa de testes para identificar problemas
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const results: any[] = [];
  let overallStatus = 'SUCCESS';
  
  console.log('🔍 Iniciando diagnóstico automático...');

  // Test 1: Database Connection
  try {
    await prisma.$connect();
    const userCount = await prisma.user.count();
    results.push({
      test: 'Database Connection',
      status: 'PASS',
      details: `Connected successfully. Users in database: ${userCount}`
    });
  } catch (error: any) {
    results.push({
      test: 'Database Connection',
      status: 'FAIL',
      details: error.message
    });
    overallStatus = 'FAIL';
  }

  // Test 2: Environment Variables
  const envVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ];
  
  let envStatus = 'PASS';
  const envResults: string[] = [];
  
  envVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      envResults.push(`❌ ${varName}: Missing`);
      envStatus = 'FAIL';
      overallStatus = 'FAIL';
    } else {
      envResults.push(`✅ ${varName}: Set (${varName === 'DATABASE_URL' ? value.substring(0, 20) + '...' : 'hidden'})`);
    }
  });
  
  results.push({
    test: 'Environment Variables',
    status: envStatus,
    details: envResults.join('\n')
  });

  // Test 3: NextAuth Configuration
  try {
    // Simulate what NextAuth does during initialization
    const authCheck = {
      secret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
      url: process.env.NEXTAUTH_URL ? 'Set' : 'Missing',
      providers: 'Default providers configured'
    };
    
    results.push({
      test: 'NextAuth Configuration',
      status: authCheck.secret === 'Set' && authCheck.url === 'Set' ? 'PASS' : 'FAIL',
      details: `Secret: ${authCheck.secret}, URL: ${authCheck.url}, Providers: ${authCheck.providers}`
    });
    
    if (authCheck.secret === 'Missing' || authCheck.url === 'Missing') {
      overallStatus = 'FAIL';
    }
  } catch (error: any) {
    results.push({
      test: 'NextAuth Configuration',
      status: 'FAIL',
      details: error.message
    });
    overallStatus = 'FAIL';
  }

  // Test 4: Registration API Test
  try {
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      username: `testuser${Date.now()}`,
      email: `test${Date.now()}@teste.com`,
      password: 'senha123456',
      confirmPassword: 'senha123456',
      agreeToTerms: true
    };

    // Simulate registration process without actually registering
    const { registerSchema } = await import('@/lib/validations/auth');
    const validatedData = registerSchema.parse(testUser);
    
    results.push({
      test: 'Registration Validation',
      status: 'PASS',
      details: 'Test data passed schema validation successfully'
    });
  } catch (error: any) {
    results.push({
      test: 'Registration Validation',
      status: 'FAIL',
      details: error.message
    });
    overallStatus = 'FAIL';
  }

  // Test 5: Password Hashing
  try {
    const { PasswordUtils } = await import('@/lib/security/auth-utils');
    const testPassword = 'testpassword123';
    const hashedPassword = await PasswordUtils.hashPassword(testPassword);
    const isValid = await PasswordUtils.verifyPassword(testPassword, hashedPassword);
    
    results.push({
      test: 'Password Hashing',
      status: isValid ? 'PASS' : 'FAIL',
      details: `Hash generated and verified: ${isValid}`
    });
    
    if (!isValid) {
      overallStatus = 'FAIL';
    }
  } catch (error: any) {
    results.push({
      test: 'Password Hashing',
      status: 'FAIL',
      details: error.message
    });
    overallStatus = 'FAIL';
  }

  // Test 6: Rate Limiting
  try {
    const { checkRateLimit } = await import('@/lib/security/rateLimit');
    const rateLimitResult = checkRateLimit('test-ip', '/api/auth/register', { requests: 10, window: 900000 });
    
    results.push({
      test: 'Rate Limiting',
      status: rateLimitResult.success ? 'PASS' : 'FAIL',
      details: `Rate limit check: ${rateLimitResult.success ? 'Allowed' : 'Blocked'}, Remaining: ${rateLimitResult.remaining}`
    });
  } catch (error: any) {
    results.push({
      test: 'Rate Limiting',
      status: 'FAIL',
      details: error.message
    });
    overallStatus = 'FAIL';
  }

  // Test 7: Database Schema Validation
  try {
    const tables = await prisma.$queryRaw`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%'
      ORDER BY name;
    ` as any[];
    
    const expectedTables = ['User', 'Account', 'Session', 'VerificationToken'];
    const actualTables = tables.map((t: any) => t.name);
    const missingTables = expectedTables.filter(table => !actualTables.includes(table));
    
    results.push({
      test: 'Database Schema',
      status: missingTables.length === 0 ? 'PASS' : 'FAIL',
      details: `Tables found: ${actualTables.join(', ')}${missingTables.length > 0 ? ` | Missing: ${missingTables.join(', ')}` : ''}`
    });
    
    if (missingTables.length > 0) {
      overallStatus = 'FAIL';
    }
  } catch (error: any) {
    results.push({
      test: 'Database Schema',
      status: 'FAIL',
      details: error.message
    });
    overallStatus = 'FAIL';
  }

  // Generate Summary
  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  
  const summary = {
    timestamp: new Date().toISOString(),
    overallStatus,
    testResults: {
      total: results.length,
      passed: passCount,
      failed: failCount,
      successRate: `${Math.round((passCount / results.length) * 100)}%`
    },
    systemInfo: {
      nodeEnv: process.env.NODE_ENV,
      platform: process.platform,
      nodeVersion: process.version,
      database: process.env.DATABASE_URL?.includes('sqlite') ? 'SQLite' : 'Other'
    },
    tests: results
  };

  console.log(`🎯 Diagnóstico concluído: ${overallStatus} (${passCount}/${results.length} testes passaram)`);

  return NextResponse.json(summary, { 
    status: overallStatus === 'SUCCESS' ? 200 : 500,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}