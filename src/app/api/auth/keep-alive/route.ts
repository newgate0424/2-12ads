import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

/**
 * Keep-Alive Endpoint
 * ใช้สำหรับ refresh session โดยไม่ต้องโหลดข้อมูลเยอะ
 */
export async function GET() {
  try {
    const session = await requireAuth()
    
    return NextResponse.json(
      { alive: true, userId: session.id },
      { 
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
      }
    )
  } catch (error) {
    return NextResponse.json(
      { alive: false },
      { status: 401 }
    )
  }
}
