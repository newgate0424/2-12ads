import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import {
  verifyPassword,
  createSession,
  checkLoginAttempts,
  recordLoginAttempt,
  logActivity,
  getClientIP,
} from '@/lib/auth'
import { logger } from '@/lib/logger'
import { checkLoginRateLimit } from '@/lib/rate-limit'

const loginSchema = z.object({
  username: z.string().min(3, 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร').max(50),
  password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
})

export async function POST(request: NextRequest) {
  try {
    const ipAddress = getClientIP(request.headers) || 'unknown'
    
    // ตรวจสอบ rate limit ก่อน
    const rateLimit = checkLoginRateLimit(ipAddress)
    if (!rateLimit.success) {
      const resetTime = new Date(rateLimit.resetTime)
      logger.auth.failed('unknown', `Rate limit exceeded from ${ipAddress}`)
      
      return NextResponse.json(
        { 
          error: 'มีการพยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่ในภายหลัง',
          resetTime: resetTime.toISOString(),
        },
        { status: 429 }
      )
    }
    
    const body = await request.json()
    const { username, password } = loginSchema.parse(body)
    const userAgent = request.headers.get('user-agent') || undefined

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      // Record failed attempt
      await recordLoginAttempt(username, false, undefined, ipAddress, userAgent)
      logger.auth.failed(username, 'ไม่พบผู้ใช้')
      
      // Note: Cannot log to ActivityLog without valid userId
      // Failed attempts are tracked in LoginAttempt table instead
      
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      )
    }

    // Check if user is locked
    if (user.isLocked) {
      logger.auth.failed(username, 'บัญชีถูกล็อค')
      
      // Log failed login attempt due to locked account
      await logActivity(
        user.id,
        'LOGIN_FAILED',
        'พยายามเข้าสู่ระบบด้วยบัญชีที่ถูกล็อค',
        { username: user.username, reason: 'account_locked' },
        ipAddress,
        userAgent
      )
      
      return NextResponse.json(
        { error: 'บัญชีนี้ถูกล็อค กรุณาติดต่อผู้ดูแลระบบ' },
        { status: 403 }
      )
    }

    // Check login attempts
    const tooManyAttempts = await checkLoginAttempts(user.id)
    if (tooManyAttempts) {
      logger.auth.failed(username, 'พยายามเข้าสู่ระบบมากเกินไป')
      
      // Log failed login attempt due to too many attempts
      await logActivity(
        user.id,
        'LOGIN_FAILED',
        'มีการพยายามเข้าสู่ระบบมากเกินไป',
        { username: user.username, reason: 'too_many_attempts' },
        ipAddress,
        userAgent
      )
      
      return NextResponse.json(
        { error: 'มีการพยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่ในอีก 10 นาที' },
        { status: 429 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    
    if (!isValidPassword) {
      // Record failed attempt
      await recordLoginAttempt(username, false, user.id, ipAddress, userAgent)
      logger.auth.failed(username, 'รหัสผ่านไม่ถูกต้อง')
      
      // Log failed login attempt due to wrong password
      await logActivity(
        user.id,
        'LOGIN_FAILED',
        'พยายามเข้าสู่ระบบด้วยรหัสผ่านที่ไม่ถูกต้อง',
        { username: user.username, reason: 'wrong_password' },
        ipAddress,
        userAgent
      )
      
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      )
    }

    // Record successful attempt
    await recordLoginAttempt(username, true, user.id, ipAddress, userAgent)

    // Create session (this will delete any existing sessions)
    await createSession(user.id, userAgent, ipAddress)

    // Log successful login
    logger.auth.login(username, ipAddress || undefined)

    // Create default settings if not exists
    const existingSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id }
    })

    if (!existingSettings) {
      await prisma.userSettings.create({
        data: {
          userId: user.id,
          theme: 'light',
          primaryColor: 'blue',
          customPrimaryColor: '#3b82f6',
          backgroundColor: 'gradient-mint-pink',
          customBackgroundColor: '#ffffff',
          customGradientStart: '#a8edea',
          customGradientEnd: '#fed6e3',
          fontSize: 'medium',
          fontFamily: 'inter',
          language: 'th',
        }
      })
    }

    // Log activity
    await logActivity(
      user.id,
      'LOGIN',
      'เข้าสู่ระบบสำเร็จ',
      { username: user.username },
      ipAddress,
      userAgent
    )

    // Return user data (without password)
    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        teams: user.teams,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
      { status: 500 }
    )
  }
}
