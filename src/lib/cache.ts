/**
 * Simple in-memory cache implementation for server-side caching
 * This is a free alternative to Redis for server-side caching
 */

type CacheItem<T> = {
  value: T;
  expiry: number | null; // Timestamp when the item expires (null for no expiry)
};

class MemoryCache {
  private cache: Map<string, CacheItem<any>>;
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  constructor() {
    this.cache = new Map();
    // Run cleanup every minute to remove expired items
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  /**
   * Set a value in the cache
   * @param key - The cache key
   * @param value - The value to cache
   * @param ttl - Time to live in milliseconds (optional, defaults to 5 minutes)
   */
  set<T>(key: string, value: T, ttl: number = this.DEFAULT_TTL): void {
    const expiry = ttl ? Date.now() + ttl : null;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Get a value from the cache
   * @param key - The cache key
   * @returns The cached value or undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);

    // Return undefined if item doesn't exist
    if (!item) return undefined;

    // Return undefined if item has expired
    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value as T;
  }

  /**
   * Check if a key exists in the cache and is not expired
   * @param key - The cache key
   * @returns True if the key exists and is not expired
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Delete a key from the cache
   * @param key - The cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get all keys in the cache
   * @returns Array of cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get the number of items in the cache
   * @returns Number of items in the cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Remove expired items from the cache
   * @private
   */
  private cleanup(): void {
    const now = Date.now();
    // Use Array.from to convert the entries to an array first to avoid iterator issues
    const entries = Array.from(this.cache.entries());
    for (const [key, item] of entries) {
      if (item.expiry && item.expiry < now) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get or set a value in the cache
   * If the key exists and is not expired, return the cached value
   * Otherwise, call the factory function, cache the result, and return it
   *
   * @param key - The cache key
   * @param factory - Function to generate the value if not in cache
   * @param ttl - Time to live in milliseconds (optional)
   * @returns The cached or newly generated value
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    // Check if the value is already in the cache
    const cachedValue = this.get<T>(key);
    if (cachedValue !== undefined) {
      return cachedValue;
    }

    // Generate the value using the factory function
    const value = await factory();

    // Cache the value
    this.set(key, value, ttl);

    return value;
  }
}

// Create a singleton instance
const memoryCache = new MemoryCache();

export default memoryCache;
