import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { format, parseISO, eachDayOfInterval, eachMonthOfInterval, startOfMonth, endOfMonth } from 'date-fns'
import { th } from 'date-fns/locale'

// Team mapping for each tab
const TAB_TEAMS: { [key: string]: string[] } = {
  'lottery': ['สาวอ้อย', 'อลิน', 'อัญญาC', 'อัญญาD'],
  'baccarat': ['สเปชบาร์', 'บาล้าน'],
  'horse-racing': [],
  'football-area': ['ฟุตบอลแอร์เรีย', 'ฟุตบอลแอร์เรีย(ฮารุ)']
}

/**
 * GET /api/dashboard/charts
 * Query params:
 * - startDate: ISO date string
 * - endDate: ISO date string  
 * - tab: lottery | baccarat | horse-racing | football-area
 * - view: team | adser
 * - period: daily | monthly
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const tab = searchParams.get('tab')
    const view = searchParams.get('view') || 'team'
    const period = searchParams.get('period') || 'daily'

    if (!startDate || !endDate || !tab) {
      return NextResponse.json(
        { error: 'Missing required parameters: startDate, endDate, tab' },
        { status: 400 }
      )
    }

    // Get current exchange rate
    let exchangeRate = 35.0 // Default fallback
    try {
      const rateData = await (prisma as any).exchangeRate.findFirst({
        orderBy: { timestamp: 'desc' }
      })
      if (rateData) {
        exchangeRate = rateData.rate
      }
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error)
    }

    const start = parseISO(startDate)
    const end = parseISO(endDate)

    // สร้างช่วงเวลาตามประเภท (รายวัน/รายเดือน)
    const intervals = period === 'daily' 
      ? eachDayOfInterval({ start, end })
      : eachMonthOfInterval({ start, end })

    // กรองเฉพาะช่วงเวลาที่มีข้อมูล (ไม่เกินวันปัจจุบัน)
    const today = new Date()
    const filteredIntervals = intervals.filter(interval => {
      return period === 'daily' 
        ? interval <= today
        : interval <= today
    })

    const chartData = []

    for (const interval of filteredIntervals) {
      let periodStart: Date
      let periodEnd: Date
      
      if (period === 'daily') {
        // รายวัน: ตั้งแต่เริ่มวันจนจบวัน
        periodStart = new Date(interval)
        periodStart.setHours(0, 0, 0, 0)
        periodEnd = new Date(interval)
        periodEnd.setHours(23, 59, 59, 999)
      } else {
        // รายเดือน: ตั้งแต่ต้นเดือนจนจบเดือน
        periodStart = startOfMonth(interval)
        periodEnd = endOfMonth(interval)
      }
      
      const periodLabel = period === 'daily'
        ? format(interval, 'dd')
        : format(interval, 'MMM', { locale: th })

      const periodData: any = { 
        period: periodLabel,
        date: format(interval, 'yyyy-MM-dd')
      }

      if (view === 'team') {
        // ดึงข้อมูลแยกตามทีม
        const teams = TAB_TEAMS[tab] || []
        
        for (const team of teams) {
          const teamData = await (prisma as any).syncData.findMany({
            where: {
              team: team,
              date: {
                gte: periodStart,
                lte: periodEnd
              }
            }
          })

          const totalSpend = teamData.reduce((sum: number, item: any) => sum + (item.spend || 0), 0)
          const totalDeposit = teamData.reduce((sum: number, item: any) => sum + (item.deposit || 0), 0)
          const totalMessage = teamData.reduce((sum: number, item: any) => sum + (item.message || 0), 0)
          const totalTurnoverAdser = teamData.reduce((sum: number, item: any) => sum + (item.turnoverAdser || 0), 0)

          // คำนวณ dollarPerCover = (เล่นใหม่ / อัตราแลกเปลี่ยน) / ใช้จ่าย
          const dollarPerCover = totalSpend > 0 && exchangeRate > 0 
            ? (totalTurnoverAdser / exchangeRate) / totalSpend 
            : 0

          periodData[team] = {
            cpm: totalMessage > 0 ? parseFloat((totalSpend / totalMessage).toFixed(2)) : 0,
            costPerDeposit: totalDeposit > 0 ? parseFloat((totalSpend / totalDeposit).toFixed(2)) : 0,
            depositAmount: totalDeposit,
            dollarPerCover: parseFloat(dollarPerCover.toFixed(4)),
            spend: totalSpend,
            deposit: totalDeposit,
            turnoverAdser: totalTurnoverAdser
          }
        }
      } else {
        // ดึงข้อมูลแยกตามแอดเซอร์
        const adserData = await (prisma as any).syncData.findMany({
          where: {
            team: { in: TAB_TEAMS[tab] || [] },
            date: {
              gte: periodStart,
              lte: periodEnd
            }
          },
          distinct: ['adser'],
          select: {
            adser: true
          }
        })

        const uniqueAdsers = adserData.map((item: any) => item.adser).filter(Boolean)

        for (const adser of uniqueAdsers) {
          const adserStats = await (prisma as any).syncData.findMany({
            where: {
              adser: adser,
              date: {
                gte: periodStart,
                lte: periodEnd
              }
            }
          })

          const totalSpend = adserStats.reduce((sum: number, item: any) => sum + (item.spend || 0), 0)
          const totalDeposit = adserStats.reduce((sum: number, item: any) => sum + (item.deposit || 0), 0)
          const totalMessage = adserStats.reduce((sum: number, item: any) => sum + (item.message || 0), 0)
          const totalTurnoverAdser = adserStats.reduce((sum: number, item: any) => sum + (item.turnoverAdser || 0), 0)

          // คำนวณ dollarPerCover = (เล่นใหม่ / อัตราแลกเปลี่ยน) / ใช้จ่าย
          const dollarPerCover = totalSpend > 0 && exchangeRate > 0 
            ? (totalTurnoverAdser / exchangeRate) / totalSpend 
            : 0

          if (adser) {
            periodData[adser] = {
              cpm: totalMessage > 0 ? parseFloat((totalSpend / totalMessage).toFixed(2)) : 0,
              costPerDeposit: totalDeposit > 0 ? parseFloat((totalSpend / totalDeposit).toFixed(2)) : 0,
              depositAmount: totalDeposit,
              dollarPerCover: parseFloat(dollarPerCover.toFixed(4)),
              spend: totalSpend,
              deposit: totalDeposit,
              turnoverAdser: totalTurnoverAdser
            }
          }
        }
      }

      chartData.push(periodData)
    }

    return NextResponse.json({
      success: true,
      data: chartData,
      period,
      view
    })

  } catch (error) {
    console.error('Chart data API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}