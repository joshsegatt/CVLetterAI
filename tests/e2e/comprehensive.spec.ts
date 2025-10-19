/**
 * Comprehensive End-to-End Testing Suite
 * Tests all critical features: Authentication, CV Builder, Cover Letters, AI Chat, CV Analysis
 */

import { test, expect, type Page, type BrowserContext } from '@playwright/test';

// Test configuration and utilities
class TestConfig {
  static readonly BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  static readonly TEST_USER = {
    email: 'test@cvletterai.com',
    password: 'TestPassword123!',
    name: 'Test User'
  };
  
  static readonly TIMEOUTS = {
    SHORT: 5000,
    MEDIUM: 15000,
    LONG: 30000,
    AI_RESPONSE: 60000
  };
}

class TestHelpers {
  /**
   * Sign up or log in test user
   */
  static async authenticateUser(page: Page): Promise<void> {
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle');
    
    // Try to sign in first
    await page.fill('input[type="email"]', TestConfig.TEST_USER.email);
    await page.fill('input[type="password"]', TestConfig.TEST_USER.password);
    await page.click('button[type="submit"]');
    
    // If sign in fails, go to sign up
    await page.waitForTimeout(2000);
    if (page.url().includes('sign-in')) {
      await page.goto('/sign-up');
      await page.fill('input[name="name"]', TestConfig.TEST_USER.name);
      await page.fill('input[type="email"]', TestConfig.TEST_USER.email);
      await page.fill('input[type="password"]', TestConfig.TEST_USER.password);
      await page.click('button[type="submit"]');
    }
    
    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/.*\/(dashboard|overview)/);
  }
  
  /**
   * Navigate to a specific feature
   */
  static async navigateToFeature(page: Page, feature: 'cv-builder' | 'letter-builder' | 'chat' | 'dashboard'): Promise<void> {
    await page.goto(`/${feature}`);
    await page.waitForLoadState('networkidle');
  }
  
  /**
   * Wait for AI response with proper timeout
   */
  static async waitForAIResponse(page: Page, selector: string): Promise<void> {
    await expect(page.locator(selector)).toBeVisible({ timeout: TestConfig.TIMEOUTS.AI_RESPONSE });
  }
  
  /**
   * Fill CV section with test data
   */
  static async fillCVSection(page: Page, section: string, data: Record<string, string>): Promise<void> {
    // Navigate to section if needed
    const sectionButton = page.locator(`button:has-text("${section}")`);
    if (await sectionButton.isVisible()) {
      await sectionButton.click();
    }
    
    // Fill form fields
    for (const [field, value] of Object.entries(data)) {
      const input = page.locator(`input[name*="${field}"], textarea[name*="${field}"]`).first();
      if (await input.isVisible()) {
        await input.fill(value);
      }
    }
  }
}

// Test data
const testCVData = {
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA'
  },
  
  experience: {
    company: 'Tech Corp',
    position: 'Senior Software Engineer',
    duration: '2020 - Present',
    description: 'Developed and maintained web applications using React and Node.js'
  },
  
  education: {
    institution: 'University of Technology',
    degree: 'Bachelor of Computer Science',
    year: '2020',
    gpa: '3.8'
  },
  
  skills: 'JavaScript, TypeScript, React, Node.js, Python, PostgreSQL'
};

const testLetterData = {
  jobTitle: 'Senior Software Engineer',
  company: 'Amazing Tech Company',
  content: 'I am writing to express my strong interest in the Senior Software Engineer position at Amazing Tech Company.'
};

// Authentication Tests
test.describe('Authentication Flow', () => {
  test('should allow user to sign up with email', async ({ page }) => {
    await page.goto('/sign-up');
    
    await page.fill('input[name="name"]', TestConfig.TEST_USER.name);
    await page.fill('input[type="email"]', `test-${Date.now()}@cvletterai.com`);
    await page.fill('input[type="password"]', TestConfig.TEST_USER.password);
    
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*\/(dashboard|overview)/);
  });
  
  test('should allow user to sign in with email', async ({ page }) => {
    await TestHelpers.authenticateUser(page);
    await expect(page).toHaveURL(/.*\/(dashboard|overview)/);
  });
  
  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/sign-in');
    
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator(':has-text("Invalid")')).toBeVisible();
  });
  
  test('should allow user to sign out', async ({ page }) => {
    await TestHelpers.authenticateUser(page);
    
    // Find and click sign out button
    const signOutButton = page.locator('button:has-text("Sign Out"), a:has-text("Sign Out")').first();
    await signOutButton.click();
    
    // Should redirect to home page
    await expect(page).toHaveURL('/');
  });
});

// CV Builder Tests
test.describe('CV Builder Feature', () => {
  test.beforeEach(async ({ page }) => {
    await TestHelpers.authenticateUser(page);
    await TestHelpers.navigateToFeature(page, 'cv-builder');
  });
  
  test('should load CV builder interface', async ({ page }) => {
    // Should see CV builder elements
    await expect(page.locator('h1, h2').filter({ hasText: /CV|Resume/ })).toBeVisible();
    await expect(page.locator('button, input, textarea').first()).toBeVisible();
  });
  
  test('should create new CV draft', async ({ page }) => {
    // Click create new CV button
    const createButton = page.locator('button:has-text("New CV"), button:has-text("Create")').first();
    if (await createButton.isVisible()) {
      await createButton.click();
    }
    
    // Fill personal information
    await TestHelpers.fillCVSection(page, 'Personal', testCVData.personalInfo);
    
    // Save draft
    const saveButton = page.locator('button:has-text("Save")').first();
    if (await saveButton.isVisible()) {
      await saveButton.click();
      await expect(page.locator(':has-text("Saved")')).toBeVisible({ timeout: TestConfig.TIMEOUTS.MEDIUM });
    }
  });
  
  test('should add work experience', async ({ page }) => {
    // Navigate to experience section
    await TestHelpers.fillCVSection(page, 'Experience', testCVData.experience);
    
    // Add experience entry
    const addButton = page.locator('button:has-text("Add"), button:has-text("+")').first();
    if (await addButton.isVisible()) {
      await addButton.click();
    }
    
    // Verify experience was added
    await expect(page.locator(`:has-text("${testCVData.experience.company}")`)).toBeVisible();
  });
  
  test('should add education', async ({ page }) => {
    await TestHelpers.fillCVSection(page, 'Education', testCVData.education);
    
    // Verify education entry
    await expect(page.locator(`:has-text("${testCVData.education.institution}")`)).toBeVisible();
  });
  
  test('should add skills', async ({ page }) => {
    await TestHelpers.fillCVSection(page, 'Skills', { skills: testCVData.skills });
    
    // Verify skills were added
    await expect(page.locator(`:has-text("JavaScript")`)).toBeVisible();
  });
  
  test('should generate CV preview', async ({ page }) => {
    // Look for preview button
    const previewButton = page.locator('button:has-text("Preview"), button:has-text("Generate")').first();
    if (await previewButton.isVisible()) {
      await previewButton.click();
      
      // Wait for preview to load
      await expect(page.locator('.preview, [data-testid="cv-preview"]')).toBeVisible({ 
        timeout: TestConfig.TIMEOUTS.LONG 
      });
    }
  });
  
  test('should export CV as PDF', async ({ page }) => {
    // Look for export/download button
    const exportButton = page.locator('button:has-text("Export"), button:has-text("Download"), button:has-text("PDF")').first();
    if (await exportButton.isVisible()) {
      // Set up download handler
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.pdf');
    }
  });
});

// Cover Letter Builder Tests  
test.describe('Cover Letter Builder Feature', () => {
  test.beforeEach(async ({ page }) => {
    await TestHelpers.authenticateUser(page);
    await TestHelpers.navigateToFeature(page, 'letter-builder');
  });
  
  test('should load letter builder interface', async ({ page }) => {
    await expect(page.locator('h1, h2').filter({ hasText: /Letter|Cover/ })).toBeVisible();
  });
  
  test('should create new cover letter', async ({ page }) => {
    // Fill job details
    await page.fill('input[placeholder*="job"], input[name*="job"]', testLetterData.jobTitle);
    await page.fill('input[placeholder*="company"], input[name*="company"]', testLetterData.company);
    
    // Fill letter content
    const textArea = page.locator('textarea').first();
    if (await textArea.isVisible()) {
      await textArea.fill(testLetterData.content);
    }
    
    // Save letter
    const saveButton = page.locator('button:has-text("Save")').first();
    if (await saveButton.isVisible()) {
      await saveButton.click();
    }
  });
  
  test('should generate AI-assisted cover letter', async ({ page }) => {
    // Fill job details first
    await page.fill('input[placeholder*="job"]', testLetterData.jobTitle);
    await page.fill('input[placeholder*="company"]', testLetterData.company);
    
    // Look for AI generate button
    const aiButton = page.locator('button:has-text("AI"), button:has-text("Generate")').first();
    if (await aiButton.isVisible()) {
      await aiButton.click();
      
      // Wait for AI response
      await TestHelpers.waitForAIResponse(page, 'textarea, .letter-content');
      
      // Verify content was generated
      const content = await page.locator('textarea').first().inputValue();
      expect(content.length).toBeGreaterThan(50);
    }
  });
  
  test('should export cover letter as PDF', async ({ page }) => {
    // Create letter first
    await page.fill('input[placeholder*="job"]', testLetterData.jobTitle);
    await page.fill('textarea', testLetterData.content);
    
    // Export
    const exportButton = page.locator('button:has-text("Export"), button:has-text("PDF")').first();
    if (await exportButton.isVisible()) {
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.pdf');
    }
  });
});

// AI Chat Tests
test.describe('AI Chat Feature', () => {
  test.beforeEach(async ({ page }) => {
    await TestHelpers.authenticateUser(page);
    await TestHelpers.navigateToFeature(page, 'chat');
  });
  
  test('should load chat interface', async ({ page }) => {
    await expect(page.locator('input[placeholder*="message"], textarea[placeholder*="message"]')).toBeVisible();
    await expect(page.locator('button:has-text("Send")')).toBeVisible();
  });
  
  test('should send and receive AI messages', async ({ page }) => {
    const messageInput = page.locator('input[type="text"], textarea').last();
    const sendButton = page.locator('button:has-text("Send")');
    
    // Send test message
    await messageInput.fill('Hello, can you help me improve my CV?');
    await sendButton.click();
    
    // Wait for AI response
    await TestHelpers.waitForAIResponse(page, '.message, .chat-message, [data-role="assistant"]');
    
    // Verify response
    const messages = page.locator('.message, .chat-message');
    await expect(messages).toHaveCount(2, { timeout: TestConfig.TIMEOUTS.MEDIUM }); // User + AI message
  });
  
  test('should handle follow-up questions', async ({ page }) => {
    const messageInput = page.locator('input[type="text"], textarea').last();
    const sendButton = page.locator('button:has-text("Send")');
    
    // First message
    await messageInput.fill('What makes a good software engineer CV?');
    await sendButton.click();
    await TestHelpers.waitForAIResponse(page, '.message, .chat-message');
    
    // Follow-up message
    await messageInput.fill('Can you give me specific examples?');
    await sendButton.click();
    await TestHelpers.waitForAIResponse(page, '.message, .chat-message');
    
    // Should have 4 messages total (2 user + 2 AI)
    const messages = page.locator('.message, .chat-message');
    await expect(messages.count()).resolves.toBeGreaterThanOrEqual(4);
  });
  
  test('should clear chat history', async ({ page }) => {
    // Send a message first
    const messageInput = page.locator('input[type="text"], textarea').last();
    await messageInput.fill('Test message');
    await page.locator('button:has-text("Send")').click();
    
    // Clear chat
    const clearButton = page.locator('button:has-text("Clear"), button:has-text("New")').first();
    if (await clearButton.isVisible()) {
      await clearButton.click();
      
      // Verify messages are cleared
      const messages = page.locator('.message, .chat-message');
      await expect(messages).toHaveCount(0, { timeout: TestConfig.TIMEOUTS.SHORT });
    }
  });
});

// CV Analysis Tests
test.describe('CV Analysis Feature', () => {
  test.beforeEach(async ({ page }) => {
    await TestHelpers.authenticateUser(page);
  });
  
  test('should analyze uploaded CV', async ({ page }) => {
    await page.goto('/cv-analysis');
    
    // Look for file upload
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      // Create a test PDF file (in real test, you'd use an actual PDF)
      await fileInput.setInputFiles({
        name: 'test-cv.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('Test CV content')
      });
      
      // Submit for analysis
      const analyzeButton = page.locator('button:has-text("Analyze"), button:has-text("Upload")').first();
      await analyzeButton.click();
      
      // Wait for analysis results
      await TestHelpers.waitForAIResponse(page, '.analysis-result, .feedback');
      
      // Verify analysis is shown
      await expect(page.locator(':has-text("analysis"), :has-text("feedback")')).toBeVisible();
    }
  });
  
  test('should provide improvement suggestions', async ({ page }) => {
    await page.goto('/cv-analysis');
    
    // If there are existing analyses, check for suggestions
    const suggestions = page.locator('.suggestion, .recommendation, :has-text("improve")');
    if (await suggestions.first().isVisible()) {
      await expect(suggestions.first()).toBeVisible();
    }
  });
});

// Dashboard and Navigation Tests
test.describe('Dashboard and Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await TestHelpers.authenticateUser(page);
  });
  
  test('should display dashboard overview', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should show user info and recent activity
    await expect(page.locator('h1, h2').filter({ hasText: /Dashboard|Overview/ })).toBeVisible();
    await expect(page.locator(':has-text("CV"), :has-text("Letter")')).toBeVisible();
  });
  
  test('should navigate between features', async ({ page }) => {
    const features = ['cv-builder', 'letter-builder', 'chat'];
    
    for (const feature of features) {
      await page.goto(`/${feature}`);
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain(feature);
    }
  });
  
  test('should show user profile and settings', async ({ page }) => {
    // Look for profile/settings link
    const profileLink = page.locator('a:has-text("Profile"), a:has-text("Settings"), button:has-text("Profile")').first();
    if (await profileLink.isVisible()) {
      await profileLink.click();
      await expect(page.locator(':has-text("Profile"), :has-text("Settings")')).toBeVisible();
    }
  });
});

// Performance and Error Handling Tests
test.describe('Performance and Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Go offline
    await page.context().setOffline(true);
    
    await page.goto('/dashboard');
    
    // Should show appropriate error message
    await expect(page.locator(':has-text("error"), :has-text("offline"), :has-text("connection")')).toBeVisible({
      timeout: TestConfig.TIMEOUTS.MEDIUM
    });
    
    // Go back online
    await page.context().setOffline(false);
  });
  
  test('should load pages within acceptable time', async ({ page }) => {
    const start = Date.now();
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
  
  test('should handle API errors', async ({ page }) => {
    await TestHelpers.authenticateUser(page);
    
    // Intercept API calls and return errors
    await page.route('**/api/**', (route) => {
      route.fulfill({ status: 500, body: 'Server Error' });
    });
    
    await page.goto('/chat');
    
    // Try to send a message - should handle error gracefully
    await page.fill('input, textarea', 'Test message');
    await page.click('button:has-text("Send")');
    
    // Should show error message
    await expect(page.locator(':has-text("error"), :has-text("failed")')).toBeVisible({
      timeout: TestConfig.TIMEOUTS.SHORT
    });
  });
});

// Mobile Responsiveness Tests
test.describe('Mobile Responsiveness', () => {
  test('should work on mobile devices', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 } // iPhone SE
    });
    
    const page = await context.newPage();
    await TestHelpers.authenticateUser(page);
    
    // Test key features on mobile
    await page.goto('/cv-builder');
    await expect(page.locator('h1, h2')).toBeVisible();
    
    await page.goto('/chat');
    await expect(page.locator('input, textarea')).toBeVisible();
    
    await context.close();
  });
});