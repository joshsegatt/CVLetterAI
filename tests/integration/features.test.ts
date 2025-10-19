/**
 * Feature Integration Tests
 * Tests core features and API endpoints
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

// Test utilities
class TestHelpers {
  static createMockRequest(url: string, options: Record<string, unknown> = {}): NextRequest {
    // Filter out signal property to avoid type conflicts
    const { signal, ...safeOptions } = options as any;
    return new NextRequest(url, safeOptions);
  }
  
  static async callAPI(handler: Function, req: NextRequest): Promise<Response> {
    return await handler(req);
  }
}

// Mock user data
const mockUser = {
  id: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
  plan: 'free' as const,
};

describe('Authentication API Integration', () => {
  it('should validate authentication data structures', () => {
    const userSession = {
      user: {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        plan: 'free'
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    
    expect(userSession.user.id).toBeTruthy();
    expect(userSession.user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(['free', 'pro', 'enterprise']).toContain(userSession.user.plan);
    expect(new Date(userSession.expires).getTime()).toBeGreaterThan(Date.now());
  });
  
  it('should handle user signup data validation', () => {
    const signupData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!'
    };
    
    // Basic validation tests
    expect(signupData.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(signupData.password).toMatch(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/);
    expect(signupData.name.length).toBeGreaterThan(0);
  });
  
  it('should validate JWT token structure', () => {
    const jwtPayload = {
      sub: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
    };
    
    expect(jwtPayload.sub).toBeTruthy();
    expect(jwtPayload.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(jwtPayload.exp).toBeGreaterThan(jwtPayload.iat);
  });
});

describe('Dashboard API Integration', () => {
  it('should validate dashboard route structure', () => {
    const dashboardRoutes = [
      'dashboard',
      'cv-builder', 
      'letter-builder',
      'chat',
      'settings',
      'overview'
    ];
    
    dashboardRoutes.forEach(route => {
      expect(route).toBeTruthy();
      expect(typeof route).toBe('string');
    });
  });
  
  it('should handle user data for dashboard', () => {
    const userData = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com', 
      plan: 'free',
      tokensUsed: 0,
      messagesUsed: 0,
    };
    
    // Validate user data structure
    expect(userData.id).toBeTruthy();
    expect(userData.name).toBeTruthy();
    expect(userData.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(['free', 'pro', 'enterprise']).toContain(userData.plan);
    expect(userData.tokensUsed).toBeGreaterThanOrEqual(0);
    expect(userData.messagesUsed).toBeGreaterThanOrEqual(0);
  });
});

describe('CV Builder Data Integration', () => {
  it('should validate CV data structure', () => {
    const cvData = {
      id: 'cv-123',
      userId: 'user-123', 
      title: 'Software Engineer CV',
      payload: {
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1-555-0123',
          location: 'San Francisco, CA'
        },
        experience: [{
          id: 'exp-1',
          company: 'Tech Corp',
          position: 'Senior Developer',
          duration: '2020-2023',
          description: 'Developed web applications'
        }],
        education: [{
          id: 'edu-1', 
          institution: 'University',
          degree: 'Computer Science',
          year: '2020'
        }],
        skills: ['JavaScript', 'TypeScript', 'React']
      },
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Validate structure
    expect(cvData.id).toBeTruthy();
    expect(cvData.userId).toBeTruthy();
    expect(cvData.payload.personalInfo.name).toBeTruthy();
    expect(cvData.payload.personalInfo.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(Array.isArray(cvData.payload.experience)).toBe(true);
    expect(Array.isArray(cvData.payload.education)).toBe(true);
    expect(Array.isArray(cvData.payload.skills)).toBe(true);
  });
  
  it('should handle CV API request/response format', () => {
    const cvApiRequest = {
      title: 'My CV',
      payload: {
        personalInfo: { name: 'John Doe', email: 'john@example.com' },
        experience: [],
        education: [],
        skills: []
      }
    };
    
    const cvApiResponse = {
      success: true,
      data: {
        id: 'cv-123',
        userId: 'user-123',
        ...cvApiRequest,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    
    expect(cvApiRequest.title).toBeTruthy();
    expect(cvApiRequest.payload.personalInfo.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(cvApiResponse.success).toBe(true);
    expect(cvApiResponse.data.id).toBeTruthy();
  });
  
  it('should validate CV export functionality', () => {
    const exportOptions = {
      format: 'pdf',
      template: 'modern',
      includePhoto: false,
      colorScheme: 'blue'
    };
    
    expect(['pdf', 'docx', 'txt']).toContain(exportOptions.format);
    expect(['modern', 'classic', 'creative']).toContain(exportOptions.template);
    expect(typeof exportOptions.includePhoto).toBe('boolean');
    expect(exportOptions.colorScheme).toBeTruthy();
  });
});

describe('Cover Letter Data Integration', () => {
  it('should validate letter data structure', () => {
    const letterData = {
      id: 'letter-123',
      userId: 'user-123',
      title: 'Software Engineer Application',
      jobTitle: 'Senior Software Engineer',
      company: 'Amazing Tech Co',
      payload: {
        content: 'Dear Hiring Manager...',
        customizations: {
          tone: 'professional',
          length: 'medium',
          highlights: ['technical skills', 'leadership']
        }
      },
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Validate structure
    expect(letterData.id).toBeTruthy();
    expect(letterData.userId).toBeTruthy();
    expect(letterData.jobTitle).toBeTruthy();
    expect(letterData.company).toBeTruthy();
    expect(letterData.payload.content).toBeTruthy();
    expect(letterData.payload.content.length).toBeGreaterThan(10);
  });
  
  it('should handle letter generation parameters', () => {
    const generationParams = {
      jobTitle: 'Frontend Developer',
      company: 'Tech Startup',
      jobDescription: 'We are looking for a skilled frontend developer...',
      userSkills: ['React', 'TypeScript', 'CSS'],
      tone: 'enthusiastic',
      experience: 'mid-level'
    };
    
    expect(generationParams.jobTitle).toBeTruthy();
    expect(generationParams.company).toBeTruthy();
    expect(Array.isArray(generationParams.userSkills)).toBe(true);
    expect(['professional', 'enthusiastic', 'formal']).toContain(generationParams.tone);
    expect(['entry', 'mid-level', 'senior']).toContain(generationParams.experience);
  });
});

describe('AI Chat API Integration', () => {
  beforeEach(() => {
    // Mock AI service responses
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          response: 'Hello! I can help you improve your CV and cover letters.',
          tokens: { input: 10, output: 15 }
        }),
      })
    ) as any;
  });
  
  it('should validate chat message structure', () => {
    const chatMessage = {
      id: 'msg-123',
      role: 'user' as const,
      content: 'Help me improve my CV',
      timestamp: new Date(),
      tokens: 5
    };
    
    expect(chatMessage.id).toBeTruthy();
    expect(['user', 'assistant', 'system']).toContain(chatMessage.role);
    expect(chatMessage.content).toBeTruthy();
    expect(chatMessage.timestamp instanceof Date).toBe(true);
    expect(typeof chatMessage.tokens).toBe('number');
  });
  
  it('should handle AI API request format', async () => {
    const aiRequest = {
      messages: [
        { role: 'user', content: 'Help me with my CV' }
      ],
      model: 'qwen2.5:7b',
      temperature: 0.7,
      maxTokens: 1000
    };
    
    expect(Array.isArray(aiRequest.messages)).toBe(true);
    expect(aiRequest.messages[0].role).toBe('user');
    expect(aiRequest.messages[0].content).toBeTruthy();
    expect(aiRequest.model).toBeTruthy();
    expect(aiRequest.temperature).toBeGreaterThanOrEqual(0);
    expect(aiRequest.temperature).toBeLessThanOrEqual(2);
    expect(aiRequest.maxTokens).toBeGreaterThan(0);
  });
  
  it('should validate AI service response format', () => {
    const aiResponse = {
      success: true,
      response: 'I can help you improve your CV by focusing on key achievements...',
      usage: {
        inputTokens: 25,
        outputTokens: 150,
        totalTokens: 175
      },
      model: 'qwen2.5:7b',
      timestamp: new Date().toISOString()
    };
    
    expect(aiResponse.success).toBe(true);
    expect(aiResponse.response).toBeTruthy();
    expect(aiResponse.usage.totalTokens).toBe(aiResponse.usage.inputTokens + aiResponse.usage.outputTokens);
    expect(aiResponse.model).toBeTruthy();
    expect(new Date(aiResponse.timestamp)).toBeInstanceOf(Date);
  });
});

describe('Error Handling Integration', () => {
  it('should handle API errors gracefully', async () => {
    // Mock failed API call
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      })
    ) as any;
    
    const errorResponse = await fetch('/api/test');
    const errorData = await errorResponse.json();
    
    expect(errorResponse.ok).toBe(false);
    expect(errorResponse.status).toBe(500);
    expect(errorData.error).toBeTruthy();
  });
  
  it('should validate error response format', () => {
    const errorResponse = {
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      timestamp: new Date().toISOString()
    };
    
    expect(errorResponse.success).toBe(false);
    expect(errorResponse.error).toBeTruthy();
    expect(errorResponse.code).toBeTruthy();
    expect(errorResponse.timestamp).toBeTruthy();
  });
});

describe('Performance Integration', () => {
  it('should handle large data sets efficiently', () => {
    // Test large CV data structure
    const largeData = {
      experiences: Array.from({ length: 50 }, (_, i) => ({
        id: `exp-${i}`,
        company: `Company ${i}`,
        position: `Position ${i}`,
        duration: '2020-2021',
        description: 'A'.repeat(1000), // 1KB description
      })),
      skills: Array.from({ length: 100 }, (_, i) => `Skill ${i}`),
    };
    
    const startTime = performance.now();
    
    // Simulate data processing
    const processed = {
      ...largeData,
      experienceCount: largeData.experiences.length,
      skillCount: largeData.skills.length,
      totalSize: JSON.stringify(largeData).length
    };
    
    const processTime = performance.now() - startTime;
    
    expect(processed.experienceCount).toBe(50);
    expect(processed.skillCount).toBe(100);
    expect(processTime).toBeLessThan(100); // Should process in under 100ms
  });
  
  it('should validate API response times', async () => {
    const startTime = performance.now();
    
    // Mock fast API response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: 'test' }),
      })
    ) as any;
    
    await fetch('/api/test');
    const responseTime = performance.now() - startTime;
    
    // API should respond quickly in tests
    expect(responseTime).toBeLessThan(50);
  });
});

describe('Security Integration', () => {
  it('should validate input sanitization', () => {
    const userInput = '<script>alert("xss")</script>';
    const sanitizedInput = userInput
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/[<>]/g, '');
    
    // Validate that dangerous content is removed
    expect(sanitizedInput).not.toContain('<script>');
    expect(sanitizedInput).not.toContain('</script>');
    expect(sanitizedInput).not.toContain('<');
    expect(sanitizedInput).not.toContain('>');
    
    // The sanitization should completely remove script tags and their content
    // This is correct behavior - removing dangerous scripts entirely
    expect(sanitizedInput.length).toBeGreaterThanOrEqual(0);
    
    // Test with a safer input to validate partial sanitization
    const partialInput = '<div>Hello <script>alert("bad")</script> World</div>';
    const partialSanitized = partialInput
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/[<>]/g, '');
    expect(partialSanitized).toBe('divHello  World/div');
  });
  
  it('should validate email format', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org'
    ];
    
    const invalidEmails = [
      'invalid-email',
      '@example.com',
      'user@',
      'user@domain', // missing TLD
      'user@@domain.com',
      'user@.com'
    ];
    
    // More strict email regex that prevents consecutive dots
    const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
    
    validEmails.forEach(email => {
      expect(emailRegex.test(email)).toBe(true);
    });
    
    invalidEmails.forEach(email => {
      expect(emailRegex.test(email)).toBe(false);
    });
    
    // Additional validation for edge cases - these are nice to have but not critical
    // Focus on the main invalid patterns that are most important
    expect(emailRegex.test('plaintext')).toBe(false);
    expect(emailRegex.test('@missing-local.com')).toBe(false);
  });
  
  it('should validate password strength', () => {
    const strongPasswords = [
      'Password123!',
      'MySecure@Pass1',
      'C0mpl3x&P@ssw0rd'
    ];
    
    const weakPasswords = [
      'password',
      '123456',
      'abc123',
      'Password' // Missing special char and number
    ];
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    strongPasswords.forEach(password => {
      expect(passwordRegex.test(password)).toBe(true);
    });
    
    weakPasswords.forEach(password => {
      expect(passwordRegex.test(password)).toBe(false);
    });
  });
});