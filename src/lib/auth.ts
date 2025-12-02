import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
const SESSION_EXPIRY_DAYS = parseInt(process.env.SESSION_EXPIRY_DAYS || '7')

export interface SessionPayload {
  userId: string
  username: string
  role: string
  teams: string[]
  sessionId: string
}

export interface SessionUser {
  id: string
  username: string
  role: string
  teams: string[]
  sessionId: string
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Create a JWT token
 */
export function createToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: `${SESSION_EXPIRY_DAYS}d`,
  })
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload
  } catch (error) {
    return null
  }
}

/**
 * Get the current session from cookies
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('session')?.value

    if (!token) return null

    const payload = verifyToken(token)
    if (!payload) return null

    // Verify session exists in database and is not expired
    const session = await prisma.session.findUnique({
      where: { id: payload.sessionId },
      include: { user: true },
    })

    if (!session || session.expiresAt < new Date()) {
      // Clean up expired session
      if (session) {
        await prisma.session.delete({ where: { id: session.id } })
      }
      return null
    }

    // Verify user is not locked
    if (session.user.isLocked) {
      return null
    }

    return {
      id: session.user.id,
      username: session.user.username,
      role: session.user.role,
      teams: session.user.teams as string[],
      sessionId: session.id,
    }
  } catch (error) {
    console.error('Session verification error:', error)
    return null
  }
}

/**
 * Create a new session for a user
 */
export async function createSession(
  userId: string,
  userAgent?: string,
  ipAddress?: string
): Promise<string> {
  // Delete existing sessions for this user (enforce single session)
  await prisma.session.deleteMany({
    where: { userId },
  })

  // Get user data
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Create new session
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS)

  const session = await prisma.session.create({
    data: {
      userId,
      sessionToken: generateSessionToken(),
      userAgent,
      ipAddress,
      expiresAt,
    },
  })

  // Create JWT payload
  const payload: SessionPayload = {
    userId: user.id,
    username: user.username,
    role: user.role,
    teams: user.teams as string[],
    sessionId: session.id,
  }

  // Create JWT token
  const token = createToken(payload)

  // Set cookie
  cookies().set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    path: '/',
  })

  return token
}

/**
 * Delete the current session
 */
export async function deleteSession(): Promise<void> {
  const session = await getSession()
  
  if (session) {
    // Delete session from database
    await prisma.session.delete({
      where: { id: session.sessionId },
    }).catch(() => {
      // Session might already be deleted, ignore error
    })
  }

  // Delete cookie
  cookies().delete('session')
}

/**
 * Log user activity
 */
export async function logActivity(
  userId: string,
  action: string,
  description: string,
  metadata?: any,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      description,
      metadata: metadata ? JSON.stringify(metadata) : undefined,
      ipAddress,
      userAgent,
    },
  })
}

/**
 * Check if user has exceeded login attempts
 */
export async function checkLoginAttempts(userId: string): Promise<boolean> {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
  
  const failedAttempts = await prisma.loginAttempt.count({
    where: {
      userId,
      success: false,
      attemptAt: {
        gte: tenMinutesAgo,
      },
    },
  })

  return failedAttempts >= 5
}

/**
 * Record a login attempt
 */
export async function recordLoginAttempt(
  username: string,
  success: boolean,
  userId?: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await prisma.loginAttempt.create({
    data: {
      username,
      success,
      userId,
      ipAddress,
      userAgent,
    },
  })
}

/**
 * Generate a random session token
 */
function generateSessionToken(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Require authentication (for use in API routes)
 */
export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  return session
}

/**
 * Require admin role (for use in API routes)
 */
export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireAuth()
  
  if (session.role !== 'ADMIN') {
    throw new Error('Forbidden')
  }
  
  return session
}

/**
 * Get client IP address from request headers
 */
export function getClientIP(headers: Headers): string | undefined {
  return (
    headers.get('x-forwarded-for')?.split(',')[0] ||
    headers.get('x-real-ip') ||
    undefined
  )
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })
  
  return result.count
}
