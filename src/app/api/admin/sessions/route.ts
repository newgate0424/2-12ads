import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, logActivity, getClientIP } from '@/lib/auth'
import { logger } from '@/lib/logger'

// GET /api/admin/sessions - Get all active sessions
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const sessions = await prisma.session.findMany({
      where: {
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            role: true,
            teams: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ sessions })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 403 })
    }

    console.error('Get sessions error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลเซสชัน' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/sessions - Revoke a session
export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAdmin()
    
    // รับ id จาก query parameter หรือ request body
    const { searchParams } = new URL(request.url)
    let sessionId = searchParams.get('id')
    
    if (!sessionId) {
      const body = await request.json()
      sessionId = body.id
    }
    
    if (!sessionId) {
      return NextResponse.json({ error: 'ต้องระบุ ID เซสชัน' }, { status: 400 })
    }

    // Get session before deleting
    const targetSession = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    })

    if (!targetSession) {
      return NextResponse.json({ error: 'ไม่พบเซสชัน' }, { status: 404 })
    }

    // Delete session
    await prisma.session.delete({
      where: { id: sessionId },
    })

    // Log activity
    const ipAddress = getClientIP(request.headers)
    const userAgent = request.headers.get('user-agent') || undefined
    
    await logActivity(
      session.id,
      'SESSION_REVOKE',
      `ยกเลิกเซสชันของผู้ใช้: ${targetSession.user.username}`,
      { sessionId, username: targetSession.user.username },
      ipAddress,
      userAgent
    )

    // Log to console
    logger.auth.sessionRevoked(
      targetSession.user.username,
      session.username
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 403 })
    }

    console.error('Delete session error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการยกเลิกเซสชัน' },
      { status: 500 }
    )
  }
}
