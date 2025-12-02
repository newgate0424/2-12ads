import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

// GET /api/admin/activity-logs - Get activity logs
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const userId = searchParams.get('userId')
    const action = searchParams.get('action')

    const where: any = {}
    if (userId) where.userId = userId
    if (action) where.action = action

    // Fetch activity logs
    const [activityLogs, activityTotal] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: {
          user: {
            select: {
              username: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.activityLog.count({ where }),
    ])

    // Fetch failed login attempts if no specific action filter or if filtering for LOGIN_FAILED
    let failedLogins: any[] = []
    if (!action || action === 'LOGIN_FAILED') {
      const failedLoginAttempts = await prisma.loginAttempt.findMany({
        where: {
          success: false,
          ...(userId && { userId }),
        },
        include: {
          user: {
            select: {
              username: true,
              role: true,
            },
          },
        },
        orderBy: {
          attemptAt: 'desc',
        },
        take: limit,
      })

      // Transform failed login attempts to match ActivityLog format
      failedLogins = failedLoginAttempts.map(attempt => ({
        id: attempt.id,
        userId: attempt.userId || 'unknown',
        action: 'LOGIN_FAILED',
        description: `พยายามเข้าสู่ระบบด้วยชื่อผู้ใช้: ${attempt.username}${!attempt.userId ? ' (ไม่พบผู้ใช้)' : ''}`,
        metadata: {
          username: attempt.username,
          reason: !attempt.userId ? 'user_not_found' : 'wrong_password',
        },
        ipAddress: attempt.ipAddress,
        userAgent: attempt.userAgent,
        createdAt: attempt.attemptAt.toISOString(),
        user: attempt.user || {
          username: attempt.username,
          role: 'UNKNOWN',
        },
      }))
    }

    // Combine and sort all logs by date
    const allLogs = [...activityLogs, ...failedLogins].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, limit)

    const total = activityTotal + (failedLogins.length > 0 ? await prisma.loginAttempt.count({
      where: { success: false, ...(userId && { userId }) }
    }) : 0)

    return NextResponse.json({
      logs: allLogs,
      total,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 403 })
    }

    console.error('Get activity logs error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม' },
      { status: 500 }
    )
  }
}
