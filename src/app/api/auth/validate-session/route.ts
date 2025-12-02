import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// API endpoint to validate if a session is still active
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value

    if (!sessionId) {
      return NextResponse.json(
        { valid: false, message: 'No session cookie' },
        { status: 401 }
      )
    }

    // Check if session exists and is not expired
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        expiresAt: true,
      },
    })

    // Session doesn't exist or is expired
    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json(
        { valid: false, message: 'Session expired or not found' },
        { status: 401 }
      )
    }

    // Session is valid
    return NextResponse.json({ valid: true }, { status: 200 })
  } catch (error) {
    console.error('Session validation error:', error)
    return NextResponse.json(
      { valid: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
