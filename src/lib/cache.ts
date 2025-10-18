/**
 * Production Cache System
 * Handles caching for high-traffic scenarios
 */

interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  tags?: string[];
}

declare global {
  var productionCache: Map<string, CacheItem> | undefined;
  var cacheStats: {
    hits: number;
    misses: number;
    sets: number;
    deletes: number;
    size: number;
  } | undefined;
}

export class ProductionCache {
  private static getStore(): Map<string, CacheItem> {
    if (!global.productionCache) {
      global.productionCache = new Map();
    }
    return global.productionCache;
  }

  private static getCacheStats() {
    if (!global.cacheStats) {
      global.cacheStats = {
        hits: 0,
        misses: 0,
        sets: 0,
        deletes: 0,
        size: 0
      };
    }
    return global.cacheStats;
  }

  static set<T>(key: string, data: T, ttlSeconds: number = 300, tags: string[] = []): void {
    const store = this.getStore();
    const stats = this.getCacheStats();
    
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
      tags
    };
    
    store.set(key, item);
    stats.sets++;
    stats.size = store.size;
    
    // Clean expired items periodically
    if (Math.random() < 0.01) { // 1% chance
      this.cleanup();
    }
  }

  static get<T>(key: string): T | null {
    const store = this.getStore();
    const stats = this.getCacheStats();
    const item = store.get(key);
    
    if (!item) {
      stats.misses++;
      return null;
    }
    
    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      store.delete(key);
      stats.deletes++;
      stats.misses++;
      stats.size = store.size;
      return null;
    }
    
    stats.hits++;
    return item.data as T;
  }

  static delete(key: string): boolean {
    const store = this.getStore();
    const stats = this.getCacheStats();
    const deleted = store.delete(key);
    
    if (deleted) {
      stats.deletes++;
      stats.size = store.size;
    }
    
    return deleted;
  }

  static invalidateByTag(tag: string): number {
    const store = this.getStore();
    const stats = this.getCacheStats();
    let deleted = 0;
    
    for (const [key, item] of store.entries()) {
      if (item.tags?.includes(tag)) {
        store.delete(key);
        deleted++;
      }
    }
    
    stats.deletes += deleted;
    stats.size = store.size;
    return deleted;
  }

  static cleanup(): number {
    const store = this.getStore();
    const stats = this.getCacheStats();
    const now = Date.now();
    let deleted = 0;
    
    for (const [key, item] of store.entries()) {
      if (now - item.timestamp > item.ttl) {
        store.delete(key);
        deleted++;
      }
    }
    
    stats.deletes += deleted;
    stats.size = store.size;
    return deleted;
  }

  static clear(): void {
    const store = this.getStore();
    const stats = this.getCacheStats();
    
    store.clear();
    stats.size = 0;
  }

  static getStats(): typeof global.cacheStats {
    return { ...this.getCacheStats() };
  }

  static getHitRate(): number {
    const stats = this.getCacheStats();
    const total = stats.hits + stats.misses;
    return total > 0 ? stats.hits / total : 0;
  }
}

// Cache wrapper for expensive operations
export function withCache<T>(
  key: string,
  fn: () => Promise<T> | T,
  ttlSeconds: number = 300,
  tags: string[] = []
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      // Try cache first
      const cached = ProductionCache.get<T>(key);
      if (cached !== null) {
        resolve(cached);
        return;
      }
      
      // Execute function
      const result = await fn();
      
      // Cache result
      ProductionCache.set(key, result, ttlSeconds, tags);
      
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

// Common cache keys and TTLs
export const CacheKeys = {
  USER_PLAN: (userId: string) => `user:plan:${userId}`,
  AI_RESPONSE: (prompt: string) => `ai:response:${Buffer.from(prompt).toString('base64').slice(0, 32)}`,
  CV_TEMPLATE: (templateId: string) => `cv:template:${templateId}`,
  RATE_LIMIT: (ip: string, endpoint: string) => `rate:${ip}:${endpoint}`,
  SYSTEM_CONFIG: 'system:config',
  PRICING_DATA: 'pricing:data'
};

export const CacheTTL = {
  SHORT: 60,      // 1 minute
  MEDIUM: 300,    // 5 minutes
  LONG: 1800,     // 30 minutes
  HOUR: 3600,     // 1 hour
  DAY: 86400      // 24 hours
};

export const CacheTags = {
  USER: 'user',
  AI: 'ai',
  TEMPLATES: 'templates',
  PRICING: 'pricing',
  SYSTEM: 'system'
};