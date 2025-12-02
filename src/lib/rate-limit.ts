/**
 * Rate Limiting Utility
 * ป้องกัน brute force และ DDoS attacks
 * รองรับ concurrent users สูงสุด 100 คน
 */

interface RateLimitStore {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitStore>()

// จำกัด Map size เพื่อป้องกัน memory leak (max 10,000 entries)
const MAX_MAP_SIZE = 10000

// ทำความสะอาดทุก 15 นาที
setInterval(() => {
  const now = Date.now()
  const keysToDelete: string[] = []
  
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      keysToDelete.push(key)
    }
  }
  
  // ลบ expired entries
  keysToDelete.forEach(key => rateLimitMap.delete(key))
  
  // ถ้า Map ใหญ่เกินไป ลบ entries เก่าสุด
  if (rateLimitMap.size > MAX_MAP_SIZE) {
    const entries = Array.from(rateLimitMap.entries())
    entries.sort((a, b) => a[1].resetTime - b[1].resetTime)
    const toDelete = entries.slice(0, entries.length - MAX_MAP_SIZE)
    toDelete.forEach(([key]) => rateLimitMap.delete(key))
  }
}, 15 * 60 * 1000)

interface RateLimitOptions {
  interval?: number // มิลลิวินาที (default: 15 นาที)
  maxRequests?: number // จำนวน request สูงสุด (default: 100)
}

/**
 * ตรวจสอบ rate limit สำหรับ IP address
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { success: boolean; remaining: number; resetTime: number } {
  const interval = options.interval || 15 * 60 * 1000 // 15 นาที
  const maxRequests = options.maxRequests || 100
  
  const now = Date.now()
  const key = `rate_limit:${identifier}`
  
  let store = rateLimitMap.get(key)
  
  // ถ้าไม่มีหรือหมดเวลาแล้ว สร้างใหม่
  if (!store || now > store.resetTime) {
    store = {
      count: 1,
      resetTime: now + interval,
    }
    rateLimitMap.set(key, store)
    
    return {
      success: true,
      remaining: maxRequests - 1,
      resetTime: store.resetTime,
    }
  }
  
  // เพิ่มจำนวน request
  store.count++
  
  // ตรวจสอบว่าเกินจำนวนที่กำหนดไหม
  if (store.count > maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: store.resetTime,
    }
  }
  
  return {
    success: true,
    remaining: maxRequests - store.count,
    resetTime: store.resetTime,
  }
}

/**
 * Rate limit สำหรับ login attempts
 * เข้มงวด: 10 ครั้งต่อ 15 นาที
 */
export function checkLoginRateLimit(identifier: string) {
  return checkRateLimit(identifier, {
    interval: 15 * 60 * 1000, // 15 นาที
    maxRequests: 10, // 10 ครั้งต่อ 15 นาที
  })
}

/**
 * Rate limit สำหรับ API calls ทั่วไป
 * ผ่อนปรนสำหรับ real-time updates: 300 requests/นาที
 * รองรับ 50 concurrent users × 6 requests/นาที
 */
export function checkApiRateLimit(identifier: string) {
  return checkRateLimit(identifier, {
    interval: 60 * 1000, // 1 นาที
    maxRequests: 300, // 300 requests ต่อนาที (เพิ่มจาก 60)
  })
}
