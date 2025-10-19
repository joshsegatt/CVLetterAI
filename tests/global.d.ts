/// <reference types="@playwright/test" />

// Global test types
declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toBeWithinRange(a: number, b: number): R;
    }
  }
}

// AI Service types for dynamic data
export interface DynamicAIData {
  [key: string]: unknown;
}

export interface FlexibleApiResponse {
  success: boolean;
  data?: DynamicAIData;
  error?: string;
  [key: string]: unknown;
}

export interface AIServiceContext {
  model?: string;
  provider?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export {};