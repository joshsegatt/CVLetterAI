// Simple in-memory rate limiting for authentication endpoints
// In production, you'd want to use Redis or a proper database for persistence

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (will reset on server restart)
const store: RateLimitStore = {};

// Cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Rate limit implementation for authentication endpoints
 * @param key - Unique identifier for the rate limit (e.g., IP address, user ID)
 * @param maxRequests - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @param checkOnly - If true, only check without incrementing count
 */
export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
  checkOnly = false
): RateLimitResult {
  const now = Date.now();
  const resetTime = now + windowMs;

  // Get or create entry
  let entry = store[key];
  
  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired entry
    entry = {
      count: 0,
      resetTime,
    };
    store[key] = entry;
  }

  // Check if limit exceeded
  if (entry.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000), // seconds
    };
  }

  // Increment count if not checking only
  if (!checkOnly) {
    entry.count++;
  }

  return {
    success: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Reset rate limit for a specific key
 * @param key - The key to reset
 */
export function resetRateLimit(key: string): void {
  delete store[key];
}

/**
 * Get current rate limit status without incrementing
 * @param key - The key to check
 * @param maxRequests - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 */
export function getRateLimitStatus(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = store[key];

  if (!entry || entry.resetTime < now) {
    return {
      success: true,
      remaining: maxRequests,
      resetTime: now + windowMs,
    };
  }

  return {
    success: entry.count < maxRequests,
    remaining: Math.max(0, maxRequests - entry.count),
    resetTime: entry.resetTime,
    retryAfter: entry.count >= maxRequests 
      ? Math.ceil((entry.resetTime - now) / 1000) 
      : undefined,
  };
}
