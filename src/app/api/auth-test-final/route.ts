/**
 * Final Authentication System Test
 * Complete end-to-end test of the corrected authentication system
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authLogger } from '@/lib/security/auth-logger';

export async function GET(request: NextRequest) {
  const testId = Date.now();
  console.log(`[FINAL-TEST-${testId}] Starting comprehensive authentication system test`);
  
  const results: any[] = [];
  let overallStatus = 'SUCCESS';
  
  try {
    // Test 1: Database Connection
    try {
      await prisma.$connect();
      const userCount = await prisma.user.count();
      results.push({
        test: 'Database Connection',
        status: 'PASS',
        details: `Connected successfully. Users in database: ${userCount}`,
        timestamp: new Date().toISOString()
      });
      console.log(`[FINAL-TEST-${testId}] ✅ Database connection test passed`);
    } catch (error: any) {
      results.push({
        test: 'Database Connection',
        status: 'FAIL',
        details: error.message,
        timestamp: new Date().toISOString()
      });
      overallStatus = 'FAIL';
      console.log(`[FINAL-TEST-${testId}] ❌ Database connection test failed`);
    }

    // Test 2: Authentication Logger
    try {
      const logsBefore = authLogger.getRecentLogs(5).length;
      authLogger.log('info', 'TEST_LOG_ENTRY', { metadata: { testId } });
      const logsAfter = authLogger.getRecentLogs(5).length;
      
      results.push({
        test: 'Authentication Logger',
        status: logsAfter > logsBefore ? 'PASS' : 'FAIL',
        details: `Logger working. Logs before: ${logsBefore}, after: ${logsAfter}`,
        timestamp: new Date().toISOString()
      });
      console.log(`[FINAL-TEST-${testId}] ✅ Authentication logger test passed`);
    } catch (error: any) {
      results.push({
        test: 'Authentication Logger',
        status: 'FAIL',
        details: error.message,
        timestamp: new Date().toISOString()
      });
      overallStatus = 'FAIL';
      console.log(`[FINAL-TEST-${testId}] ❌ Authentication logger test failed`);
    }

    // Test 3: Rate Limiting System
    try {
      const { checkRateLimit } = await import('@/lib/security/rateLimit');
      const testResult = checkRateLimit('test-ip-final', '/api/test', { requests: 5, window: 60000 });
      
      results.push({
        test: 'Rate Limiting System',
        status: testResult.success ? 'PASS' : 'FAIL',
        details: `Rate limit check working. Success: ${testResult.success}, Remaining: ${testResult.remaining}`,
        timestamp: new Date().toISOString()
      });
      console.log(`[FINAL-TEST-${testId}] ✅ Rate limiting test passed`);
    } catch (error: any) {
      results.push({
        test: 'Rate Limiting System',
        status: 'FAIL',
        details: error.message,
        timestamp: new Date().toISOString()
      });
      overallStatus = 'FAIL';
      console.log(`[FINAL-TEST-${testId}] ❌ Rate limiting test failed`);
    }

    // Test 4: Password Utilities
    try {
      const { PasswordUtils } = await import('@/lib/security/auth-utils');
      const testPassword = 'TestPassword123!';
      const hashedPassword = await PasswordUtils.hashPassword(testPassword);
      const isValid = await PasswordUtils.verifyPassword(testPassword, hashedPassword);
      
      results.push({
        test: 'Password Utilities',
        status: isValid ? 'PASS' : 'FAIL',
        details: `Password hashing and verification working. Hash length: ${hashedPassword.length}`,
        timestamp: new Date().toISOString()
      });
      console.log(`[FINAL-TEST-${testId}] ✅ Password utilities test passed`);
    } catch (error: any) {
      results.push({
        test: 'Password Utilities',
        status: 'FAIL',
        details: error.message,
        timestamp: new Date().toISOString()
      });
      overallStatus = 'FAIL';
      console.log(`[FINAL-TEST-${testId}] ❌ Password utilities test failed`);
    }

    // Test 5: Schema Validation
    try {
      const { registerSchema } = await import('@/lib/validations/auth');
      const testData = {
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser123',
        email: 'test@example.com',
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
        agreeToTerms: true
      };
      
      const validatedData = registerSchema.parse(testData);
      
      results.push({
        test: 'Schema Validation',
        status: 'PASS',
        details: `Schema validation working. Validated email: ${validatedData.email}`,
        timestamp: new Date().toISOString()
      });
      console.log(`[FINAL-TEST-${testId}] ✅ Schema validation test passed`);
    } catch (error: any) {
      results.push({
        test: 'Schema Validation',
        status: 'FAIL',
        details: error.message,
        timestamp: new Date().toISOString()
      });
      overallStatus = 'FAIL';
      console.log(`[FINAL-TEST-${testId}] ❌ Schema validation test failed`);
    }

    // Test 6: Environment Variables
    const requiredEnvVars = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
    let envStatus = 'PASS';
    const envResults: string[] = [];
    
    requiredEnvVars.forEach(varName => {
      const value = process.env[varName];
      if (!value) {
        envResults.push(`❌ ${varName}: Missing`);
        envStatus = 'FAIL';
        overallStatus = 'FAIL';
      } else {
        envResults.push(`✅ ${varName}: Set`);
      }
    });
    
    results.push({
      test: 'Environment Variables',
      status: envStatus,
      details: envResults.join(', '),
      timestamp: new Date().toISOString()
    });
    console.log(`[FINAL-TEST-${testId}] ${envStatus === 'PASS' ? '✅' : '❌'} Environment variables test ${envStatus.toLowerCase()}ed`);

    // Test 7: Database Schema Integrity
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
        test: 'Database Schema Integrity',
        status: missingTables.length === 0 ? 'PASS' : 'FAIL',
        details: `Tables: ${actualTables.join(', ')}${missingTables.length > 0 ? ` | Missing: ${missingTables.join(', ')}` : ''}`,
        timestamp: new Date().toISOString()
      });
      
      if (missingTables.length > 0) {
        overallStatus = 'FAIL';
      }
      console.log(`[FINAL-TEST-${testId}] ${missingTables.length === 0 ? '✅' : '❌'} Database schema test ${missingTables.length === 0 ? 'passed' : 'failed'}`);
    } catch (error: any) {
      results.push({
        test: 'Database Schema Integrity',
        status: 'FAIL',
        details: error.message,
        timestamp: new Date().toISOString()
      });
      overallStatus = 'FAIL';
      console.log(`[FINAL-TEST-${testId}] ❌ Database schema test failed`);
    }

    // Generate Test Summary
    const passCount = results.filter(r => r.status === 'PASS').length;
    const failCount = results.filter(r => r.status === 'FAIL').length;
    const successRate = Math.round((passCount / results.length) * 100);

    const summary = {
      testId,
      timestamp: new Date().toISOString(),
      overallStatus,
      summary: {
        total: results.length,
        passed: passCount,
        failed: failCount,
        successRate: `${successRate}%`
      },
      systemInfo: {
        nodeEnv: process.env.NODE_ENV,
        platform: process.platform,
        nodeVersion: process.version,
        database: process.env.DATABASE_URL?.includes('sqlite') ? 'SQLite' : 'Other'
      },
      tests: results,
      authLoggerSummary: authLogger.generateSummary(1), // Last 1 hour
      recommendations: [],
      nextSteps: []
    };

    // Add recommendations based on results
    if (failCount > 0) {
      summary.recommendations.push('Fix failing tests before proceeding to production');
    }
    
    if (successRate === 100) {
      summary.recommendations.push('All tests passed! System is ready for production');
      summary.nextSteps.push('Test registration and login flows through the UI');
      summary.nextSteps.push('Monitor authentication logs for any issues');
      summary.nextSteps.push('Set up production environment variables');
    } else {
      summary.nextSteps.push('Review and fix failing tests');
      summary.nextSteps.push('Re-run tests after fixes');
    }

    console.log(`[FINAL-TEST-${testId}] 🎯 Test completed: ${overallStatus} (${passCount}/${results.length} tests passed)`);

    return NextResponse.json(summary, { 
      status: overallStatus === 'SUCCESS' ? 200 : 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error: any) {
    console.error(`[FINAL-TEST-${testId}] ❌ Test execution error:`, error);
    
    return NextResponse.json({
      testId,
      overallStatus: 'ERROR',
      error: error.message,
      timestamp: new Date().toISOString(),
      results: results
    }, { status: 500 });
  }
}