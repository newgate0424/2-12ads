import { NextRequest, NextResponse } from 'next/server'
import { deleteSession, getSession, logActivity, getClientIP } from '@/lib/auth'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (session) {
      const ipAddress = getClientIP(request.headers)
      const userAgent = request.headers.get('user-agent') || undefined

      // Log activity before deleting session
      await logActivity(
        session.id,
        'LOGOUT',
        'ออกจากระบบ',
        { username: session.username },
        ipAddress,
        userAgent
      )

      // Log logout
      logger.auth.logout(session.username)
    }

    // Delete session
    await deleteSession()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการออกจากระบบ' },
      { status: 500 }
    )
  }
}
