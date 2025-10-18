/**
 * Caching Strategy - Redis + In-Memory com TTL inteligente
 * Implementa cache multicamada para otimização de performance
 */

type CacheKey = string;
type CacheValue = any;
type TTL = number;

interface CacheEntry {
  value: CacheValue;
  expiresAt: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  evictions: number;
  totalSize: number;
  itemCount: number;
}

class IntelligentCache {
  private cache = new Map<CacheKey, CacheEntry>();
  private maxSize: number;
  private maxMemory: number;
  private currentMemory = 0;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    evictions: 0,
    totalSize: 0,
    itemCount: 0
  };

  constructor(maxSize = 1000, maxMemoryMB = 50) {
    this.maxSize = maxSize;
    this.maxMemory = maxMemoryMB * 1024 * 1024; // Convert MB to bytes
    
    // Cleanup expired entries periodically
    setInterval(() => this.cleanupExpired(), 60000); // Every minute
    
    // Report stats periodically
    setInterval(() => this.reportStats(), 300000); // Every 5 minutes
  }

  // Get with automatic TTL calculation based on access patterns
  async get<T>(key: CacheKey): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    if (this.isExpired(entry)) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    
    this.stats.hits++;
    return entry.value;
  }

  // Set with intelligent TTL based on data type and access patterns
  async set<T>(key: CacheKey, value: T, ttl?: TTL): Promise<void> {
    const size = this.estimateSize(value);
    const intelligentTTL = ttl || this.calculateIntelligentTTL(key, value);
    
    const entry: CacheEntry = {
      value,
      expiresAt: Date.now() + intelligentTTL,
      accessCount: 0,
      lastAccessed: Date.now(),
      size
    };

    // Check memory limits
    if (this.currentMemory + size > this.maxMemory) {
      await this.evictLeastValuable();
    }

    // Check size limits
    if (this.cache.size >= this.maxSize) {
      await this.evictLeastValuable();
    }

    const existingEntry = this.cache.get(key);
    if (existingEntry) {
      this.currentMemory -= existingEntry.size;
    }

    this.cache.set(key, entry);
    this.currentMemory += size;
    this.stats.sets++;
    this.stats.itemCount = this.cache.size;
    this.stats.totalSize = this.currentMemory;
  }

  // Delete entry
  delete(key: CacheKey): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.currentMemory -= entry.size;
      this.cache.delete(key);
      this.stats.itemCount = this.cache.size;
      this.stats.totalSize = this.currentMemory;
      return true;
    }
    return false;
  }

  // Calculate intelligent TTL based on data patterns
  private calculateIntelligentTTL(key: CacheKey, value: any): number {
    // Base TTL: 5 minutes
    let ttl = 5 * 60 * 1000;

    // Adjust based on key type
    if (key.includes('user-profile')) {
      ttl = 30 * 60 * 1000; // 30 minutes for user data
    } else if (key.includes('cv-template')) {
      ttl = 60 * 60 * 1000; // 1 hour for templates
    } else if (key.includes('ai-response')) {
      ttl = 15 * 60 * 1000; // 15 minutes for AI responses
    } else if (key.includes('analytics')) {
      ttl = 60 * 1000; // 1 minute for analytics
    }

    // Adjust based on value size (larger = longer TTL)
    const size = this.estimateSize(value);
    if (size > 100000) { // 100KB
      ttl *= 2; // Double TTL for large data
    }

    // Adjust based on access patterns
    const existingEntry = this.cache.get(key);
    if (existingEntry && existingEntry.accessCount > 10) {
      ttl *= 1.5; // Extend TTL for frequently accessed data
    }

    return ttl;
  }

  // Smart eviction based on value scoring
  private async evictLeastValuable(): Promise<void> {
    let leastValuable: { key: CacheKey; score: number } | null = null;
    
    for (const [key, entry] of this.cache.entries()) {
      const score = this.calculateValueScore(entry);
      
      if (!leastValuable || score < leastValuable.score) {
        leastValuable = { key, score };
      }
    }

    if (leastValuable) {
      this.delete(leastValuable.key);
      this.stats.evictions++;
    }
  }

  // Calculate value score for eviction decisions
  private calculateValueScore(entry: CacheEntry): number {
    const now = Date.now();
    const ageHours = (now - entry.lastAccessed) / (1000 * 60 * 60);
    const accessFrequency = entry.accessCount / Math.max(ageHours, 0.1);
    const sizeWeight = 1 / (entry.size / 1000); // Prefer smaller items
    
    return accessFrequency * sizeWeight;
  }

  // Estimate memory usage of value
  private estimateSize(value: any): number {
    const jsonString = JSON.stringify(value);
    return new Blob([jsonString]).size;
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() > entry.expiresAt;
  }

  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.delete(key);
      }
    }
  }

  private reportStats(): void {
    const hitRate = this.stats.hits / (this.stats.hits + this.stats.misses) * 100;
    const memoryUsageMB = this.currentMemory / (1024 * 1024);
    
    console.log('Cache Statistics:', {
      hitRate: `${hitRate.toFixed(2)}%`,
      memoryUsage: `${memoryUsageMB.toFixed(2)}MB`,
      ...this.stats
    });
  }

  // Public methods for monitoring
  getStats(): CacheStats {
    return { ...this.stats };
  }

  getHitRate(): number {
    return this.stats.hits / (this.stats.hits + this.stats.misses) * 100;
  }

  clear(): void {
    this.cache.clear();
    this.currentMemory = 0;
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0,
      totalSize: 0,
      itemCount: 0
    };
  }
}

// Cache decorators for easy integration
export function Cacheable(ttl?: number) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cache = new IntelligentCache();

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}.${propertyName}.${JSON.stringify(args)}`;
      
      // Try cache first
      const cachedResult = await cache.get(cacheKey);
      if (cachedResult !== null) {
        return cachedResult;
      }

      // Execute original method
      const result = await originalMethod.apply(this, args);
      
      // Cache the result
      await cache.set(cacheKey, result, ttl);
      
      return result;
    };

    return descriptor;
  };
}

// Singleton cache instance
const globalCache = new IntelligentCache();

export { IntelligentCache, globalCache };