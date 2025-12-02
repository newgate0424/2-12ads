import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Team mapping for each tab
const TAB_TEAMS: { [key: string]: string[] } = {
  'lottery': ['สาวอ้อย', 'อลิน', 'อัญญาC', 'อัญญาD'],
  'baccarat': ['สเปชบาร์', 'บาล้าน'],
  'football-area': ['ฟุตบอลแอร์เรีย', 'ฟุตบอลแอร์เรีย(ฮารุ)']
}

interface AggregatedData {
  team: string
  date: string
  message: number
  planMessage: number
  spend: number
  planSpend: number
  netMessages: number
  lostMessages: number
  deposit: number
  turnover: number
  turnoverAdser: number
  silent: number
  duplicate: number
  hasUser: number
  spam: number
  blocked: number
  under18: number
  over50: number
  foreign: number
}

/**
 * GET /api/dashboard/data
 * Query params:
 * - startDate: ISO date string
 * - endDate: ISO date string  
 * - tab: lottery | baccarat | horse-racing | football-area | football-area-haru
 * - view: team | adser
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const tab = searchParams.get('tab')
    const view = searchParams.get('view') || 'team'

    if (!startDate || !endDate || !tab) {
      return NextResponse.json(
        { error: 'Missing required parameters: startDate, endDate, tab' },
        { status: 400 }
      )
    }

    const teams = TAB_TEAMS[tab]
    if (!teams) {
      return NextResponse.json(
        { error: `Invalid tab: ${tab}` },
        { status: 400 }
      )
    }

    // Parse dates - convert to UTC date boundaries
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    // Normalize to UTC midnight for start date
    const startUTC = new Date(Date.UTC(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
      0, 0, 0, 0
    ))
    
    // Normalize to UTC end of day for end date
    const endUTC = new Date(Date.UTC(
      end.getFullYear(),
      end.getMonth(),
      end.getDate(),
      23, 59, 59, 999
    ))

    // Fetch data from database
    const rawData = await (prisma as any).syncData.findMany({
      where: {
        team: { in: teams },
        date: {
          gte: startUTC,
          lte: endUTC
        }
      },
      orderBy: [
        { team: 'asc' },
        { date: 'asc' }
      ]
    })
    
    // Remove duplicates and aggregate based on view type
    let aggregated: Map<string, AggregatedData & { dayCount: number }>
    
    if (view === 'adser') {
      // For adser view: aggregate by adser, keeping unique adser-date combinations
      const uniqueRecords = new Map<string, typeof rawData[0]>()
      
      for (const row of rawData) {
        const dateStr = row.date.toISOString().split('T')[0]
        const uniqueKey = `${row.adser}-${dateStr}`
        
        // Only keep the first occurrence of each adser-date combination
        if (!uniqueRecords.has(uniqueKey)) {
          uniqueRecords.set(uniqueKey, row)
        }
      }

      aggregated = new Map<string, AggregatedData & { dayCount: number }>()

      for (const row of uniqueRecords.values()) {
        const dateStr = row.date.toISOString().split('T')[0]
        const key = `${row.adser} (${row.team})` // Group by adser with team name
        
        if (!aggregated.has(key)) {
          aggregated.set(key, {
            team: key, // Use adser name with team for display
            date: dateStr,
            message: 0,
            planMessage: 0,
            spend: 0,
            planSpend: 0,
            netMessages: 0,
            lostMessages: 0,
            deposit: 0,
            turnover: 0,
            turnoverAdser: 0,
            silent: 0,
            duplicate: 0,
            hasUser: 0,
            spam: 0,
            blocked: 0,
            under18: 0,
            over50: 0,
            foreign: 0,
            dayCount: 0
          })
        }

        const current = aggregated.get(key)!
        
        // Sum all numeric fields
        current.message += row.message
        current.planMessage += row.planMessage
        current.spend += row.spend
        current.planSpend += row.planSpend
        current.netMessages += row.netMessages
        current.lostMessages += row.lostMessages
        current.deposit += row.deposit
        current.turnover += row.turnover
        current.turnoverAdser += row.turnoverAdser
        current.silent += row.silent
        current.duplicate += row.duplicate
        current.hasUser += row.hasUser
        current.spam += row.spam
        current.blocked += row.blocked
        current.under18 += row.under18
        current.over50 += row.over50
        current.foreign += row.foreign
        current.dayCount += 1
      }
    } else {
      // For team view: aggregate by team, keeping unique team-adser combinations
      const uniqueRecords = new Map<string, typeof rawData[0]>()
      
      for (const row of rawData) {
        const uniqueKey = `${row.team}-${row.adser}`
        
        // Only keep the first occurrence of each team-adser combination
        if (!uniqueRecords.has(uniqueKey)) {
          uniqueRecords.set(uniqueKey, row)
        }
      }

      aggregated = new Map<string, AggregatedData & { dayCount: number }>()

      for (const row of uniqueRecords.values()) {
        const dateStr = row.date.toISOString().split('T')[0]
        const key = row.team // Group by team only

        if (!aggregated.has(key)) {
          aggregated.set(key, {
            team: row.team,
            date: dateStr,
            message: 0,
            planMessage: 0,
            spend: 0,
            planSpend: 0,
            netMessages: 0,
            lostMessages: 0,
            deposit: 0,
            turnover: 0,
            turnoverAdser: 0,
            silent: 0,
            duplicate: 0,
            hasUser: 0,
            spam: 0,
            blocked: 0,
            under18: 0,
            over50: 0,
            foreign: 0,
            dayCount: 0
          })
        }

        const current = aggregated.get(key)!
        
        // Sum all numeric fields
        current.message += row.message
        current.planMessage += row.planMessage
        current.spend += row.spend
        current.planSpend += row.planSpend
        current.netMessages += row.netMessages
        current.lostMessages += row.lostMessages
        current.deposit += row.deposit
        current.turnover += row.turnover
        current.turnoverAdser += row.turnoverAdser
        current.silent += row.silent
        current.duplicate += row.duplicate
        current.hasUser += row.hasUser
        current.spam += row.spam
        current.blocked += row.blocked
        current.under18 += row.under18
        current.over50 += row.over50
        current.foreign += row.foreign
        current.dayCount += 1
      }
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

    // Convert to array and add calculated fields
    const results = Array.from(aggregated.values()).map(row => {
      // Calculate from aggregated totals
      // CPM = spend / message (cost per message)
      const cpm = row.message > 0 ? row.spend / row.message : 0
      const costPerDeposit = row.deposit > 0 ? row.spend / row.deposit : 0
      // 1$/Cover = (turnoverAdser in USD) / spend
      // First convert turnoverAdser from THB to USD, then divide by spend
      const dollarPerCover = row.spend > 0 && exchangeRate > 0 
        ? (row.turnoverAdser / exchangeRate) / row.spend 
        : 0

      return {
        team: row.team,
        date: row.date,
        message: row.message,
        planMessage: row.planMessage,
        spend: row.spend,
        planSpend: row.planSpend,
        netMessages: row.netMessages,
        lostMessages: row.lostMessages,
        cpm: Number(cpm.toFixed(2)),
        deposit: row.deposit,
        costPerDeposit: Number(costPerDeposit.toFixed(2)),
        turnoverAdser: row.turnoverAdser,
        dollarPerCover: Number(dollarPerCover.toFixed(4)),
        silent: row.silent,
        duplicate: row.duplicate,
        hasUser: row.hasUser,
        spam: row.spam,
        blocked: row.blocked,
        under18: row.under18,
        over50: row.over50,
        foreign: row.foreign
      }
    })

    return NextResponse.json({
      data: results,
      exchangeRate,
      count: results.length,
      timestamp: new Date().toISOString(),
      dateRange: { start: startUTC, end: endUTC }
    })

  } catch (error) {
    console.error('Dashboard data error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch dashboard data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}