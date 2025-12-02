import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes in milliseconds
const ACTIVE_HOURS = { start: 12, end: 2 } // 12:00 PM to 2:00 AM

/**
 * Check if current time is within active hours (12:00 - 02:00)
 */
function isWithinActiveHours(): boolean {
  const now = new Date()
  const hour = now.getHours()
  
  // 12:00 PM (12) to 11:59 PM (23) OR 12:00 AM (0) to 2:00 AM (2)
  return hour >= ACTIVE_HOURS.start || hour <= ACTIVE_HOURS.end
}

/**
 * GET /api/exchange-rate
 * Returns the current USD to THB exchange rate
 * Fetches from external API only if:
 * 1. No cached rate exists OR
 * 2. Cached rate is older than 30 minutes AND
 * 3. Current time is within 12:00 PM - 2:00 AM
 */
export async function GET(request: NextRequest) {
  try {
    // Get the latest cached rate
    const cachedRate = await prisma.exchangeRate.findFirst({
      orderBy: { timestamp: 'desc' }
    })

    // If cache exists and is still valid, return it
    if (cachedRate) {
      const cacheAge = Date.now() - cachedRate.timestamp.getTime()
      const isCacheValid = cacheAge < CACHE_DURATION
      
      // Return cached rate if it's still valid OR outside active hours
      if (isCacheValid || !isWithinActiveHours()) {
        return NextResponse.json({
          rate: cachedRate.rate,
          timestamp: cachedRate.timestamp,
          source: 'cache',
          cacheAge: Math.floor(cacheAge / 1000), // in seconds
          nextUpdate: isCacheValid ? 
            new Date(cachedRate.timestamp.getTime() + CACHE_DURATION).toISOString() : 
            'Outside active hours (12:00 PM - 2:00 AM)'
        })
      }
    }

    // Fetch fresh rate from external API (only during active hours)
    if (isWithinActiveHours()) {
      console.log('Fetching fresh exchange rate from API...')
      
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
      
      if (!response.ok) {
        throw new Error(`Exchange rate API returned ${response.status}`)
      }

      const data = await response.json()
      const rate = data.rates.THB

      if (!rate || typeof rate !== 'number') {
        throw new Error('Invalid rate data received from API')
      }

      // Save to database
      const newRate = await prisma.exchangeRate.create({
        data: { rate }
      })

      return NextResponse.json({
        rate: newRate.rate,
        timestamp: newRate.timestamp,
        source: 'api',
        nextUpdate: new Date(Date.now() + CACHE_DURATION).toISOString()
      })
    }

    // If we reach here, no cache exists and we're outside active hours
    // Return a default rate or error
    if (cachedRate) {
      return NextResponse.json({
        rate: cachedRate.rate,
        timestamp: cachedRate.timestamp,
        source: 'cache_expired',
        message: 'Using expired cache (outside active hours)',
        cacheAge: Math.floor((Date.now() - cachedRate.timestamp.getTime()) / 1000)
      })
    }

    return NextResponse.json(
      { 
        error: 'No exchange rate available. Please try again during active hours (12:00 PM - 2:00 AM)' 
      },
      { status: 503 }
    )

  } catch (error) {
    console.error('Exchange rate error:', error)
    
    // Try to return cached rate as fallback
    try {
      const fallbackRate = await prisma.exchangeRate.findFirst({
        orderBy: { timestamp: 'desc' }
      })

      if (fallbackRate) {
        return NextResponse.json({
          rate: fallbackRate.rate,
          timestamp: fallbackRate.timestamp,
          source: 'cache_fallback',
          message: 'Using cached rate due to API error'
        })
      }
    } catch (dbError) {
      console.error('Database fallback error:', dbError)
    }

    return NextResponse.json(
      { 
        error: 'Failed to fetch exchange rate',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
