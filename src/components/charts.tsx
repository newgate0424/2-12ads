'use client'

import React, { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine
} from 'recharts'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, eachMonthOfInterval, startOfYear } from 'date-fns'
import { th } from 'date-fns/locale'

interface ChartsProps {
  data: any[]
  goals: {
    cover: number
    cpm: number
    deposit: number
    loss: number
    repeat: number
    child: number
    costPerDeposit: number
  }
  dateRange?: {
    from?: Date
    to?: Date
  }
  activeTab: string
  selectedView: string
  chartPeriod: 'daily' | 'monthly'
  selectedMonth: string
  selectedYear: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0']

export default function Charts({ data, goals, dateRange, activeTab, selectedView, chartPeriod, selectedMonth, selectedYear }: ChartsProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // เรียก API เพื่อดึงข้อมูลกราฟ
  useEffect(() => {
    if (!selectedYear) {
      setChartData([])
      return
    }

    const fetchChartData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // กำหนดช่วงเวลาสำหรับการดึงข้อมูล
        let startDate: Date
        let endDate: Date

        if (chartPeriod === 'daily') {
          // รายวัน: ใช้เดือนและปีที่เลือก
          if (!selectedMonth) {
            setChartData([])
            setIsLoading(false)
            return
          }
          const monthIndex = parseInt(selectedMonth) - 1
          const year = parseInt(selectedYear)
          startDate = new Date(year, monthIndex, 1)
          endDate = endOfMonth(startDate)
        } else {
          // รายเดือน: ตั้งแต่เดือนมกราคมจนถึงธันวาคมของปีที่เลือก
          const year = parseInt(selectedYear)
          startDate = new Date(year, 0, 1) // 1 มกราคม
          endDate = new Date(year, 11, 31) // 31 ธันวาคม
        }

        const startDateStr = format(startDate, 'yyyy-MM-dd')
        const endDateStr = format(endDate, 'yyyy-MM-dd')
        
        // แปลง activeTab เป็น tab name
        const tabMap: { [key: string]: string } = {
          '1': 'lottery',
          '2': 'baccarat', 
          '3': 'horse-racing',
          '4': 'football-area'
        }
        
        const tabName = tabMap[activeTab] || 'lottery'
        
        console.log('Fetching chart data:', { startDateStr, endDateStr, tabName, selectedView, chartPeriod })
        
        // สร้าง AbortController สำหรับ timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
        
        try {
          const response = await fetch(
            `/api/dashboard/charts?startDate=${startDateStr}&endDate=${endDateStr}&tab=${tabName}&view=${selectedView}&period=${chartPeriod}`,
            { 
              cache: 'no-store',
              signal: controller.signal
            }
          )
          
          clearTimeout(timeoutId)
          
          if (response.ok) {
            const result = await response.json()
            console.log('Chart data received:', result.data?.length || 0, 'items')
            setChartData(result.data || [])
          } else {
            const errorText = await response.text()
            console.error('Failed to fetch chart data:', response.status, errorText)
            setError(`Failed to load chart data: ${response.status}`)
            setChartData([])
          }
        } catch (fetchError: any) {
          clearTimeout(timeoutId)
          if (fetchError.name === 'AbortError') {
            console.error('Request timeout')
            setError('การโหลดข้อมูลใช้เวลานานเกินไป กรุณาลองใหม่')
          } else {
            throw fetchError
          }
        }
      } catch (error) {
        console.error('Error fetching chart data:', error)
        setError('Network error while loading chart data')
        setChartData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [selectedMonth, selectedYear, chartPeriod, selectedView, activeTab])

  // สร้างเส้นกราฟสำหรับแต่ละทีม/แอดเซอร์
  const getUniqueNames = () => {
    if (chartData.length === 0) return []
    
    // ดึงชื่อทั้งหมดจาก key ของข้อมูลกราฟ (ยกเว้น period และ date)
    const firstDataPoint = chartData[0]
    if (!firstDataPoint) return []
    
    const names = Object.keys(firstDataPoint).filter(key => 
      key !== 'period' && key !== 'date'
    )
    
    return names
  }


  // ข้อมูลสำหรับกราฟเป้าหมายยอดเติม
  const depositTargetData = [
    {
      name: 'เป้าหมาย',
      value: goals.deposit,
      color: '#0088FE'
    },
    {
      name: 'ยอดเติมจริง',
      value: chartData.reduce((sum, item) => sum + item.depositAmount, 0),
      color: '#00C49F'
    }
  ]

  const uniqueNames = getUniqueNames()

  // Show loading state
  if (isLoading) {
    return (
      <div className="mt-6">
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary/20"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent absolute top-0 left-0"></div>
          </div>
          <span className="ml-4 text-lg animate-pulse">กำลังโหลดกราฟ...</span>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="mt-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">⚠️ เกิดข้อผิดพลาด</div>
            <div className="text-muted-foreground">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  // Show empty state
  if (chartData.length === 0) {
    return (
      <div className="mt-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            ไม่มีข้อมูลกราฟ - กรุณาเลือกช่วงเวลา
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* กราฟต้นทุนทัก (CPM) */}
        <Card className="p-4">
          <h3 className="text-md font-semibold mb-3 text-center">ต้นทุนทัก (CPM)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 50, left: 5, bottom: 5 }}>
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 10 }}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip 
                formatter={(value: any, name: any) => [
                  typeof value === 'number' ? value.toFixed(2) : value,
                  name
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              {goals.cpm > 0 && (
                <ReferenceLine 
                  y={goals.cpm} 
                  stroke="#ff6b35" 
                  strokeDasharray="3 3" 
                  label={{ value: `เป้า: ${goals.cpm.toFixed(2)}`, fontSize: 10, fill: '#ff6b35', position: 'right' }}
                />
              )}
              {uniqueNames.map((name, index) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={`${name}.cpm`}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                  name={name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          {goals.cpm > 0 && (
            <div className="text-center mt-2 text-xs text-gray-600">
              เป้าหมาย CPM: {goals.cpm.toFixed(2)} บาท
            </div>
          )}
        </Card>

        {/* กราฟต้นทุนต่อเติม */}
        <Card className="p-4">
          <h3 className="text-md font-semibold mb-3 text-center">ต้นทุนต่อเติม</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 50, left: 5, bottom: 5 }}>
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 10 }}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip 
                formatter={(value: any, name: any) => [
                  typeof value === 'number' ? value.toFixed(2) : value,
                  name
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              {goals.costPerDeposit > 0 && (
                <ReferenceLine 
                  y={goals.costPerDeposit} 
                  stroke="#ff6b35" 
                  strokeDasharray="3 3" 
                  label={{ value: `เป้า: ${goals.costPerDeposit.toFixed(2)}`, fontSize: 10, fill: '#ff6b35', position: 'right' }}
                />
              )}
              {uniqueNames.map((name, index) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={`${name}.costPerDeposit`}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                  name={name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          {goals.costPerDeposit > 0 && (
            <div className="text-center mt-2 text-xs text-gray-600">
              เป้าหมาย: ${goals.costPerDeposit.toFixed(2)}
            </div>
          )}
        </Card>

        {/* กราฟยอดเติม */}
        <Card className="p-4">
          <h3 className="text-md font-semibold mb-3 text-center">ยอดเติม</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 10 }}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              {uniqueNames.map((name, index) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={`${name}.depositAmount`}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                  name={name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          {goals.deposit > 0 && (
            <div className="text-center mt-2 text-xs text-gray-600">
              เป้าหมาย: {goals.deposit.toLocaleString()} บาท
            </div>
          )}
        </Card>

        {/* กราฟ 1$ / Cover */}
        <Card className="p-4">
          <h3 className="text-md font-semibold mb-3 text-center">1$ / Cover</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 50, left: 5, bottom: 5 }}>
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 10 }}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip 
                formatter={(value: any, name: any) => [
                  typeof value === 'number' ? value.toFixed(4) : value,
                  name
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              {goals.cover > 0 && (
                <ReferenceLine 
                  y={goals.cover} 
                  stroke="#ff6b35" 
                  strokeDasharray="3 3" 
                  label={{ value: `เป้า: ${goals.cover.toFixed(2)}`, fontSize: 10, fill: '#ff6b35', position: 'right' }}
                />
              )}
              {uniqueNames.map((name, index) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={`${name}.dollarPerCover`}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                  name={name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          {goals.cover > 0 && (
            <div className="text-center mt-2 text-xs text-gray-600">
              เป้าหมาย: ${goals.cover.toFixed(2)}
            </div>
          )}
        </Card>
      </div>


    </div>
  )
}