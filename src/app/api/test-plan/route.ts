import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // ดึงข้อมูล SyncData ล่าสุด 10 รายการเพื่อดูค่า planMessage และ planSpend
    const data = await prisma.syncData.findMany({
      where: {
        team: { in: ['สาวอ้อย', 'อลิน', 'อัญญาC', 'อัญญาD'] }
      },
      select: {
        team: true,
        adser: true,
        date: true,
        message: true,
        planMessage: true,
        spend: true,
        planSpend: true,
        sheetName: true
      },
      orderBy: { date: 'desc' },
      take: 20
    })

    return NextResponse.json({
      success: true,
      data,
      count: data.length
    })

  } catch (error) {
    console.error('Test plan error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch test data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}