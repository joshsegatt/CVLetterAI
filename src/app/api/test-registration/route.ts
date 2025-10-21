/**
 * API de Teste de Registro - Debug Completo
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validations/auth';
import { PasswordUtils } from '@/lib/security/auth-utils';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { getClientIp } from '@/lib/security/environment';

export async function POST(request: NextRequest) {
  const testId = Date.now();
  console.log(`[TEST-${testId}] Starting registration test`);
  
  try {
    const body = await request.json();
    console.log(`[TEST-${testId}] Request body:`, Object.keys(body));
    
    // Test 1: Rate Limiting
    const clientIp = getClientIp(request);
    console.log(`[TEST-${testId}] Client IP: ${clientIp}`);
    
    const rateLimitResult = await checkRateLimit(
      clientIp,
      '/api/auth/register',
      { requests: 15, window: 900000 }
    );
    
    if (!rateLimitResult.success) {
      console.log(`[TEST-${testId}] Rate limit exceeded`);
      return NextResponse.json({
        test: 'FAILED',
        step: 'Rate Limiting',
        error: 'Rate limit exceeded',
        details: rateLimitResult
      }, { status: 429 });
    }
    console.log(`[TEST-${testId}] Rate limiting: PASSED`);

    // Test 2: Schema Validation
    let validatedData;
    try {
      validatedData = registerSchema.parse(body);
      console.log(`[TEST-${testId}] Schema validation: PASSED`);
    } catch (error: any) {
      console.log(`[TEST-${testId}] Schema validation: FAILED`, error.errors);
      return NextResponse.json({
        test: 'FAILED',
        step: 'Schema Validation',
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 });
    }

    // Test 3: Database Connection
    try {
      await prisma.$connect();
      console.log(`[TEST-${testId}] Database connection: PASSED`);
    } catch (error: any) {
      console.log(`[TEST-${testId}] Database connection: FAILED`, error.message);
      return NextResponse.json({
        test: 'FAILED',
        step: 'Database Connection',
        error: error.message
      }, { status: 500 });
    }

    // Test 4: Check Existing User
    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: validatedData.email },
            { username: validatedData.username },
          ],
        },
      });
      
      if (existingUser) {
        console.log(`[TEST-${testId}] User already exists: ${existingUser.email}`);
        return NextResponse.json({
          test: 'FAILED',
          step: 'User Existence Check',
          error: 'User already exists',
          details: { email: existingUser.email, username: existingUser.username }
        }, { status: 400 });
      }
      console.log(`[TEST-${testId}] User existence check: PASSED`);
    } catch (error: any) {
      console.log(`[TEST-${testId}] User existence check: FAILED`, error.message);
      return NextResponse.json({
        test: 'FAILED',
        step: 'User Existence Check',
        error: error.message
      }, { status: 500 });
    }

    // Test 5: Password Hashing
    let hashedPassword;
    try {
      hashedPassword = await PasswordUtils.hashPassword(validatedData.password);
      console.log(`[TEST-${testId}] Password hashing: PASSED`);
    } catch (error: any) {
      console.log(`[TEST-${testId}] Password hashing: FAILED`, error.message);
      return NextResponse.json({
        test: 'FAILED',
        step: 'Password Hashing',
        error: error.message
      }, { status: 500 });
    }

    // Test 6: User Creation
    let newUser;
    try {
      newUser = await prisma.user.create({
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
          firstName: true,
          lastName: true,
          name: true,
          plan: true,
          createdAt: true,
        },
      });
      console.log(`[TEST-${testId}] User creation: PASSED - ID: ${newUser.id}`);
    } catch (error: any) {
      console.log(`[TEST-${testId}] User creation: FAILED`, error.message);
      return NextResponse.json({
        test: 'FAILED',
        step: 'User Creation',
        error: error.message,
        code: error.code,
        details: error
      }, { status: 500 });
    }

    // Test 7: Password Verification
    try {
      const isPasswordValid = await PasswordUtils.verifyPassword(
        validatedData.password,
        hashedPassword
      );
      
      if (!isPasswordValid) {
        console.log(`[TEST-${testId}] Password verification: FAILED`);
        return NextResponse.json({
          test: 'FAILED',
          step: 'Password Verification',
          error: 'Password verification failed'
        }, { status: 500 });
      }
      console.log(`[TEST-${testId}] Password verification: PASSED`);
    } catch (error: any) {
      console.log(`[TEST-${testId}] Password verification: FAILED`, error.message);
      return NextResponse.json({
        test: 'FAILED',
        step: 'Password Verification',
        error: error.message
      }, { status: 500 });
    }

    console.log(`[TEST-${testId}] ALL TESTS PASSED - Registration successful`);

    return NextResponse.json({
      test: 'SUCCESS',
      message: 'Registration test completed successfully',
      user: newUser,
      steps: [
        'Rate Limiting: PASSED',
        'Schema Validation: PASSED',
        'Database Connection: PASSED',
        'User Existence Check: PASSED',
        'Password Hashing: PASSED',
        'User Creation: PASSED',
        'Password Verification: PASSED'
      ],
      testId,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error(`[TEST-${testId}] Unexpected error:`, error);
    return NextResponse.json({
      test: 'FAILED',
      step: 'Unexpected Error',
      error: error.message,
      stack: error.stack?.substring(0, 500),
      testId,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}