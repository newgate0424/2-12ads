/**
 * In-Memory Cache for API Responses
 * ลด database load โดยการ cache response
 * รองรับ concurrent users สูง
 */

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

class ResponseCache {
  private cache = new Map<string, CacheEntry<any>>()
  private maxSize = 1000 // จำกัด cache size

  /**
   * Get cached data
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }
    
    // ตรวจสอบว่าหมดอายุหรือยัง
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data as T
  }

  /**
   * Set cache data with TTL (Time To Live)
   */
  set<T>(key: string, data: T, ttlSeconds: number): void {
    // ถ้า cache เต็ม ลบ entry เก่าสุด
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }
    
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + (ttlSeconds * 1000),
    })
  }

  /**
   * Clear specific key
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Clear expired entries
   */
  cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        keysToDelete.push(key)
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key))
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
    }
  }
}

// Singleton instance
export const responseCache = new ResponseCache()

// Cleanup expired entries every 5 minutes
setInterval(() => {
  responseCache.cleanup()
}, 5 * 60 * 1000)

/**
 * Helper function to cache API responses
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  // ลองดึงจาก cache ก่อน
  const cached = responseCache.get<T>(key)
  if (cached !== null) {
    return cached
  }
  
  // ถ้าไม่มี ดึงข้อมูลใหม่
  const data = await fetcher()
  
  // บันทึกลง cache
  responseCache.set(key, data, ttlSeconds)
  
  return data
}
