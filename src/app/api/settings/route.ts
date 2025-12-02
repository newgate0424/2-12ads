import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth, logActivity, getClientIP } from '@/lib/auth'

const updateSettingsSchema = z.object({
  theme: z.string().optional(),
  primaryColor: z.string().optional(),
  customPrimaryColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  customBackgroundColor: z.string().optional(),
  customGradientStart: z.string().optional(),
  customGradientEnd: z.string().optional(),
  fontSize: z.string().optional(),
  customFontSize: z.number().optional(),
  fontFamily: z.string().optional(),
  language: z.string().optional(),
})

// GET /api/settings - Get user settings
export async function GET() {
  try {
    const session = await requireAuth()

    const settings = await prisma.userSettings.findUnique({
      where: { userId: session.id },
    })

    // Return default settings if not found
    if (!settings) {
      return NextResponse.json({
        settings: {
          theme: 'light',
          primaryColor: 'blue',
          customPrimaryColor: '#3b82f6',
          backgroundColor: 'gradient-mint-pink',
          customBackgroundColor: '#ffffff',
          customGradientStart: '#a8edea',
          customGradientEnd: '#fed6e3',
          fontSize: 'medium',
          customFontSize: null,
          fontFamily: 'inter',
          language: 'th',
        },
      })
    }

    return NextResponse.json({ settings })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })
    }

    console.error('Get settings error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการตั้งค่า' },
      { status: 500 }
    )
  }
}

// POST /api/settings - Update user settings
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const data = updateSettingsSchema.parse(body)

    // Upsert settings
    const settings = await prisma.userSettings.upsert({
      where: { userId: session.id },
      update: data,
      create: {
        userId: session.id,
        ...data,
      },
    })

    // Log activity
    const ipAddress = getClientIP(request.headers)
    const userAgent = request.headers.get('user-agent') || undefined
    
    await logActivity(
      session.id,
      'SETTINGS_UPDATE',
      'อัพเดทการตั้งค่า',
      { changes: data },
      ipAddress,
      userAgent
    )

    return NextResponse.json({ settings })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })
    }

    console.error('Update settings error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพเดทการตั้งค่า' },
      { status: 500 }
    )
  }
}
