/**
 * Input Sanitization Utilities
 * ป้องกัน XSS และ SQL Injection
 */

/**
 * ลบ HTML tags และอักขระพิเศษที่อันตราย
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * ลบอักขระพิเศษที่อาจใช้ใน SQL Injection
 */
export function sanitizeSql(input: string): string {
  // Prisma ORM จัดการ SQL injection ให้อยู่แล้ว
  // แต่เพิ่มการตรวจสอบเผื่อมีการใช้ raw query
  return input
    .replace(/[;\-\-]/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .trim()
}

/**
 * ตรวจสอบว่า input เป็น alphanumeric เท่านั้น
 */
export function isAlphanumeric(input: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(input)
}

/**
 * ตรวจสอบว่า input เป็น email ที่ถูกต้อง
 */
export function isValidEmail(input: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(input)
}

/**
 * Sanitize username - อนุญาตเฉพาะอักขระที่ปลอดภัย
 */
export function sanitizeUsername(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .substring(0, 50)
    .toLowerCase()
}

/**
 * ตรวจสอบความแข็งแรงของรหัสผ่าน
 */
export function isStrongPassword(password: string): {
  isStrong: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('ต้องมีตัวอักษรพิมพ์เล็ก')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('ต้องมีตัวอักษรพิมพ์ใหญ่')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('ต้องมีตัวเลข')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('ต้องมีอักขระพิเศษ')
  }
  
  return {
    isStrong: errors.length === 0,
    errors,
  }
}

/**
 * ตรวจสอบ URL ที่ปลอดภัย
 */
export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    // อนุญาตเฉพาะ http และ https
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}
