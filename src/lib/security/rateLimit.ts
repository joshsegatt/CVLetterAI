// Rate Limit Store Global
declare const global: {
  rateLimitStore: Map<string, { count: number; resetTime: number }> | undefined;
}

interface RateLimitConfig {
  requests: number;
  window: number;
}

interface RateLimitResult {
  success: boolean;
  resetTime: number;
  remaining: number;
}

export function checkRateLimit(
  identifier: string, 
  path: string, 
  config: RateLimitConfig
): RateLimitResult {
  const key = `ratelimit:${identifier}:${path.split('/')[1] || 'root'}`;
  
  // Initialize global store if needed
  if (!global.rateLimitStore) {
    global.rateLimitStore = new Map();
  }
  
  const now = Date.now();
  const store = global.rateLimitStore;
  const record = store.get(key) || { count: 0, resetTime: now + config.window };
  
  // Reset if window expired
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + config.window;
  } else {
    record.count++;
  }
  
  store.set(key, record);
  
  // Clean old entries periodically (simple cleanup)
  if (Math.random() < 0.01) { // 1% chance to cleanup
    const cutoff = now - (config.window * 2);
    for (const [k, v] of store.entries()) {
      if (v.resetTime < cutoff) {
        store.delete(k);
      }
    }
  }
  
  return {
    success: record.count <= config.requests,
    resetTime: record.resetTime,
    remaining: Math.max(0, config.requests - record.count)
  };
}

export const RATE_LIMITS = {
  api: { requests: 200, window: 900000 }, // 200 req/15min - more permissive
  auth: { requests: 20, window: 300000 }, // 20 req/5min - more permissive for auth
  register: { requests: 20, window: 900000 }, // 20 req/15min - more permissive for registration
  login: { requests: 30, window: 300000 }, // 30 req/5min - more permissive for login attempts
  global: { requests: 2000, window: 3600000 }, // 2000 req/hour - doubled limit
  ai: { requests: 50, window: 300000 } // 50 req/5min - more permissive for AI requests
} as const;
