/**
 * CACHE MANAGER
 *
 * Provides caching functionality for repositories
 * Reduces database load and improves performance
 *
 * Caching Strategies:
 * - Memory cache for development
 * - Redis cache for production
 * - TTL (Time To Live) support
 * - Cache invalidation
 */

interface CacheItem {
  value: any;
  expiry: number;
}

class CacheManager {
  private cache: Map<string, CacheItem>;
  private defaultTTL: number;

  constructor() {
    this.cache = new Map(); // Simple in-memory cache
    this.defaultTTL = 300000; // 5 minutes in milliseconds
  }

  /**
   * Generate cache key from parameters
   *
   * @param {string} prefix - Cache key prefix
   * @param {any} params - Parameters to include in key
   * @returns {string} Cache key
   */
  generateKey(prefix: string, params: any = {}): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result: any, key: string) => {
        result[key] = params[key];
        return result;
      }, {});

    return `${prefix}:${JSON.stringify(sortedParams)}`;
  }

  /**
   * Get value from cache
   *
   * @param {string} key - Cache key
   * @returns {any|null} Cached value or null if not found/expired
   */
  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Set value in cache
   *
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key: string, value: any, ttl: number = this.defaultTTL): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Delete value from cache
   *
   * @param {string} key - Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Delete cache entries matching pattern
   *
   * @param {string} pattern - Pattern to match (simple string matching)
   */
  deleteByPattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   *
   * @returns {Object} Cache statistics
   */
  getStats(): { totalEntries: number; validEntries: number; expiredEntries: number; hitRate: number } {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [key, item] of this.cache) {
      if (now > item.expiry) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      hitRate: 0 // Would need to track hits/misses for this
    };
  }
}

export default new CacheManager();