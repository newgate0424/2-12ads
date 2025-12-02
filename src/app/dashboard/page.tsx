'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DateRange } from 'react-day-picker'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Input } from '@/components/ui/input'
import Charts from '@/components/charts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLeftOpen, setIsLeftOpen] = useState(true)
  const [activeTab, setActiveTab] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedView, setSelectedView] = useState<string>('')
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'monthly'>('daily')
  
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState<any[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [exchangeRate, setExchangeRate] = useState<number>(35.0)
  
  // Status tracking
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  
  // Sound effects
  const playSound = (type: 'click' | 'switch' | 'success') => {
    // Create audio context for smooth sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    const createBeep = (frequency: number, duration: number, volume: number = 0.1) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = frequency
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    }
    
    switch (type) {
      case 'click':
        createBeep(800, 0.1, 0.05)
        break
      case 'switch':
        createBeep(600, 0.15, 0.08)
        setTimeout(() => createBeep(900, 0.1, 0.06), 100)
        break
      case 'success':
        createBeep(523, 0.1, 0.06) // C
        setTimeout(() => createBeep(659, 0.1, 0.06), 100) // E
        setTimeout(() => createBeep(784, 0.2, 0.08), 200) // G
        break
    }
  }
  
  // Goals state - keyed by tab id
  const [goals, setGoals] = useState<{[key: number]: {
    cover: string
    cpm: string
    deposit: string
    loss: string
    repeat: string
    child: string
    costPerDeposit: string
  }}>({
    1: { cover: '', cpm: '', deposit: '', loss: '', repeat: '', child: '', costPerDeposit: '' },
    2: { cover: '', cpm: '', deposit: '', loss: '', repeat: '', child: '', costPerDeposit: '' },
    3: { cover: '', cpm: '', deposit: '', loss: '', repeat: '', child: '', costPerDeposit: '' },
    4: { cover: '', cpm: '', deposit: '', loss: '', repeat: '', child: '', costPerDeposit: '' },
  })

  const months = [
    { value: '1', label: 'ม.ค.' },
    { value: '2', label: 'ก.พ.' },
    { value: '3', label: 'มี.ค.' },
    { value: '4', label: 'เม.ย.' },
    { value: '5', label: 'พ.ค.' },
    { value: '6', label: 'มิ.ย.' },
    { value: '7', label: 'ก.ค.' },
    { value: '8', label: 'ส.ค.' },
    { value: '9', label: 'ก.ย.' },
    { value: '10', label: 'ต.ค.' },
    { value: '11', label: 'พ.ย.' },
    { value: '12', label: 'ธ.ค.' },
  ]

  const years = [
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
  ]

  const viewOptions = [
    { value: 'team', label: 'ทีม' },
    { value: 'adser', label: 'แอดเซอร์' },
  ]

  const tabs = [
    { id: 1, name: 'หวย', slug: 'lottery' },
    { id: 2, name: 'บาคาร่า', slug: 'baccarat' },
    { id: 3, name: 'หวยม้า', slug: 'horse-racing' },
    { id: 4, name: 'ฟุตบอลแอเรีย', slug: 'football-area' },
  ]

  // Load saved state from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedLeftOpen = localStorage.getItem('dashboard-leftOpen')
    const savedMonth = localStorage.getItem('dashboard-selectedMonth')
    const savedYear = localStorage.getItem('dashboard-selectedYear')
    const savedDateRange = localStorage.getItem('dashboard-dateRange')
    const savedView = localStorage.getItem('dashboard-selectedView')
    
    if (savedLeftOpen !== null) {
      setIsLeftOpen(savedLeftOpen === 'true')
    }
    if (savedMonth) {
      setSelectedMonth(savedMonth)
    }
    if (savedYear) {
      setSelectedYear(savedYear)
    }
    if (savedView) {
      setSelectedView(savedView)
    } else {
      setSelectedView('team') // Default to team view
    }
    
    // Load goals from localStorage
    const savedGoals = localStorage.getItem('dashboard-goals')
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals))
      } catch (e) {
        // Invalid JSON, ignore
      }
    }
    
    // Fetch exchange rate on mount
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('/api/exchange-rate')
        if (response.ok) {
          const data = await response.json()
          setExchangeRate(data.rate || 35.0)
        }
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error)
      }
    }
    fetchExchangeRate()
    
    if (savedDateRange) {
      try {
        const parsed = JSON.parse(savedDateRange)
        setDateRange({
          from: parsed.from ? new Date(parsed.from) : undefined,
          to: parsed.to ? new Date(parsed.to) : undefined
        })
      } catch (e) {
        // Invalid JSON, ignore
      }
    }
  }, [])

  // Function to update URL with all current state
  const updateURL = () => {
    if (!mounted) return
    
    const currentTab = tabs.find(t => t.id === activeTab)
    if (!currentTab) return

    const params = new URLSearchParams()
    params.set('tab', currentTab.slug)
    
    if (selectedView) {
      params.set('view', selectedView)
    }
    
    if (selectedMonth) {
      params.set('month', selectedMonth)
    }
    
    if (selectedYear) {
      params.set('year', selectedYear)
    }
    
    if (dateRange?.from) {
      // Use local date format to avoid timezone issues
      const year = dateRange.from.getFullYear()
      const month = String(dateRange.from.getMonth() + 1).padStart(2, '0')
      const day = String(dateRange.from.getDate()).padStart(2, '0')
      params.set('startDate', `${year}-${month}-${day}`)
    }
    
    if (dateRange?.to) {
      // Use local date format to avoid timezone issues
      const year = dateRange.to.getFullYear()
      const month = String(dateRange.to.getMonth() + 1).padStart(2, '0')
      const day = String(dateRange.to.getDate()).padStart(2, '0')
      params.set('endDate', `${year}-${month}-${day}`)
    }

    const newURL = `/dashboard?${params.toString()}`
    router.replace(newURL, { scroll: false })
  }

  // Read all parameters from URL on mount
  useEffect(() => {
    if (!mounted) return
    
    // Read tab
    const tabParam = searchParams.get('tab')
    if (tabParam) {
      const foundTab = tabs.find(t => t.slug === tabParam)
      if (foundTab) {
        setActiveTab(foundTab.id)
        localStorage.setItem('dashboard-activeTab', String(foundTab.id))
      }
    }
    
    // Read view
    const viewParam = searchParams.get('view')
    if (viewParam && (viewParam === 'team' || viewParam === 'adser')) {
      setSelectedView(viewParam)
      localStorage.setItem('dashboard-selectedView', viewParam)
    }
    
    // Read month
    const monthParam = searchParams.get('month')
    if (monthParam) {
      setSelectedMonth(monthParam)
      localStorage.setItem('dashboard-selectedMonth', monthParam)
    }
    
    // Read year
    const yearParam = searchParams.get('year')
    if (yearParam) {
      setSelectedYear(yearParam)
      localStorage.setItem('dashboard-selectedYear', yearParam)
    }
    
    // Read date range
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')
    if (startDateParam && endDateParam) {
      // Parse dates using local timezone to avoid timezone issues
      const startDate = new Date(startDateParam + 'T00:00:00')
      const endDate = new Date(endDateParam + 'T00:00:00')
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        const range = { from: startDate, to: endDate }
        setDateRange(range)
        localStorage.setItem('dashboard-dateRange', JSON.stringify({
          from: startDate.toISOString(),
          to: endDate.toISOString()
        }))
      }
    }
    
    // If no URL params, load from localStorage and update URL
    if (!tabParam && !viewParam && !monthParam && !yearParam && !startDateParam && !endDateParam) {
      const savedTab = localStorage.getItem('dashboard-activeTab')
      const savedView = localStorage.getItem('dashboard-selectedView')
      const savedMonth = localStorage.getItem('dashboard-selectedMonth')
      const savedYear = localStorage.getItem('dashboard-selectedYear')
      const savedDateRange = localStorage.getItem('dashboard-dateRange')
      
      if (savedTab) {
        const tabId = parseInt(savedTab)
        setActiveTab(tabId)
      }
      
      if (savedView) {
        setSelectedView(savedView)
      }
      
      if (savedMonth) {
        setSelectedMonth(savedMonth)
      }
      
      if (savedYear) {
        setSelectedYear(savedYear)
      }
      
      if (savedDateRange) {
        try {
          const parsed = JSON.parse(savedDateRange)
          setDateRange({
            from: parsed.from ? new Date(parsed.from) : undefined,
            to: parsed.to ? new Date(parsed.to) : undefined
          })
        } catch (e) {
          // Invalid JSON, ignore
        }
      }
    }
  }, [searchParams, mounted])

  // Update URL whenever state changes
  useEffect(() => {
    updateURL()
  }, [activeTab, selectedView, selectedMonth, selectedYear, dateRange, mounted])

  // Save left panel state to localStorage
  const handleLeftToggle = (newState: boolean) => {
    setIsLeftOpen(newState)
    localStorage.setItem('dashboard-leftOpen', String(newState))
  }

  // Save month selection to localStorage and update URL
  const handleMonthChange = (value: string) => {
    if (value !== selectedMonth) {
      playSound('click')
    }
    setSelectedMonth(value)
    localStorage.setItem('dashboard-selectedMonth', value)
  }

  // Save year selection to localStorage and update URL
  const handleYearChange = (value: string) => {
    if (value !== selectedYear) {
      playSound('click')
    }
    setSelectedYear(value)
    localStorage.setItem('dashboard-selectedYear', value)
  }

  // Save view selection to localStorage and update URL
  const handleViewChange = (value: string) => {
    if (value === selectedView) return
    
    playSound('switch')
    setSelectedView(value)
    localStorage.setItem('dashboard-selectedView', value)
  }

  // Update goal for current tab
  const handleGoalChange = (field: 'cover' | 'cpm' | 'deposit' | 'loss' | 'repeat' | 'child' | 'costPerDeposit', value: string) => {
    const newGoals = {
      ...goals,
      [activeTab]: {
        ...goals[activeTab],
        [field]: value
      }
    }
    setGoals(newGoals)
    localStorage.setItem('dashboard-goals', JSON.stringify(newGoals))
  }

  // Save date range to localStorage and update URL
  const handleDateRangeChange = (range: DateRange | undefined) => {
    playSound('click')
    setDateRange(range)
    if (range?.from && range?.to) {
      localStorage.setItem('dashboard-dateRange', JSON.stringify({
        from: range.from.toISOString(),
        to: range.to.toISOString()
      }))
    } else if (range?.from) {
      localStorage.setItem('dashboard-dateRange', JSON.stringify({
        from: range.from.toISOString(),
        to: null
      }))
    } else {
      localStorage.removeItem('dashboard-dateRange')
    }
  }

  // Fetch dashboard data when date range or activeTab changes
  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange?.from || !dateRange?.to || !mounted) {
        setDashboardData([])
        return
      }

      setIsLoadingData(true)
      try {
        const tab = tabs.find(t => t.id === activeTab)
        if (!tab) return

        // Convert dates to local date strings (YYYY-MM-DD format)
        const formatDateLocal = (date: Date): string => {
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          return `${year}-${month}-${day}`
        }

        const params = new URLSearchParams({
          startDate: formatDateLocal(dateRange.from),
          endDate: formatDateLocal(dateRange.to),
          tab: tab.slug,
          view: selectedView || 'team'
        })

        const response = await fetch(`/api/dashboard/data?${params}`)
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const result = await response.json()
        setDashboardData(result.data || [])
        setExchangeRate(result.exchangeRate || 35.0)
        setLastRefresh(new Date())
        
        // Only play success sound on manual actions, not on auto-refresh
        // Remove the sound for now as requested
        // if (result.data && result.data.length > 0) {
        //   setTimeout(() => playSound('success'), 100)
        // }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setDashboardData([])
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [dateRange, activeTab, selectedView, mounted])

  // Render table with real data
  const renderTable = (tabName: string) => {
    // Display team name mapping
    const displayTeamName = (team: string): string => {
      if (team === 'บาล้าน') return 'คิง มหาเฮง'
      return team
    }
    
    // Format number with commas
    const formatNumber = (num: number, decimals: number = 0): string => {
      return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })
    }

    // Format currency with $ symbol
    const formatDollar = (num: number): string => {
      return '$' + formatNumber(num, 2)
    }

    // Format currency with ฿ symbol
    const formatBaht = (num: number): string => {
      return '฿' + formatNumber(num, 2)
    }

    // Progress Bar Component for ทัก/แผน
    const ProgressBar = ({ current, target, label }: { current: number, target: number, label: string }) => {
      const percentage = target > 0 ? (current / target) * 100 : 0
      
      // สีสำหรับ ทัก/แผน
      const getMessageBarColor = () => {
        if (percentage >= 100) return 'bg-green-500' // 100% ขึ้นไป
        if (percentage >= 71) return 'bg-orange-500' // 71-99.99%
        if (percentage >= 51) return 'bg-red-400'    // 51-70%
        return 'bg-red-700'                          // <51%
      }
      
      const getMessageTextColor = () => {
        if (percentage >= 100) return 'text-green-600 dark:text-green-400'
        if (percentage >= 71) return 'text-orange-600 dark:text-orange-400'
        if (percentage >= 51) return 'text-red-400 dark:text-red-300'
        return 'text-red-700 dark:text-red-500'
      }
      
      return (
        <div className="flex flex-col items-center gap-1 min-w-[100px]">
          <div className="text-sm text-center">
            {formatNumber(current)}/{formatNumber(target)}
          </div>
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 relative overflow-hidden">
              <div 
                className={`h-1.5 rounded-full transition-all duration-500 ${getMessageBarColor()}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <div className={`text-xs font-medium min-w-[35px] text-right ${getMessageTextColor()}`}>
              {percentage.toFixed(0)}%
            </div>
          </div>
        </div>
      )
    }

    // Progress Bar for Spend (with 2 decimals) - ใช้จ่าย/แผน
    const SpendProgressBar = ({ current, target }: { current: number, target: number }) => {
      const percentage = target > 0 ? (current / target) * 100 : 0
      
      // สีสำหรับ ใช้จ่าย/แผน
      const getSpendBarColor = () => {
        if (percentage > 115) return 'bg-red-500'     // >115%
        if (percentage > 100) return 'bg-orange-500'  // >100%
        return 'bg-green-500'                         // ≤100%
      }
      
      const getSpendTextColor = () => {
        if (percentage > 115) return 'text-red-600 dark:text-red-400'
        if (percentage > 100) return 'text-orange-600 dark:text-orange-400'
        return 'text-green-600 dark:text-green-400'
      }
      
      const shouldPulse = percentage > 115
      
      return (
        <div className="flex flex-col items-center gap-1 min-w-[100px]">
          <div className="text-sm text-center">
            {formatNumber(current, 2)}/{formatNumber(target, 2)}
          </div>
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 relative overflow-hidden">
              <div 
                className={`h-1.5 rounded-full transition-all duration-500 ${getSpendBarColor()}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
              {shouldPulse && (
                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse" />
              )}
            </div>
            <div className={`text-xs font-medium min-w-[35px] text-right ${getSpendTextColor()}`}>
              {percentage.toFixed(0)}%
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">{tabName}</h2>
        <div className="border border-white/10 rounded-xl overflow-x-auto bg-white/5 dark:bg-black/5 backdrop-blur-2xl shadow-2xl">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5 dark:hover:bg-white/5 bg-white/10 dark:bg-black/10 backdrop-blur-xl">
                <TableHead className="font-semibold whitespace-nowrap text-center">ทีม</TableHead>
                <TableHead className="font-semibold whitespace-nowrap text-center">ทัก/แผน</TableHead>
                <TableHead className="font-semibold whitespace-nowrap text-center">ใช้จ่าย/แผน</TableHead>
                <TableHead className="font-semibold whitespace-nowrap text-center">คุณภาพ</TableHead>
                <TableHead className="font-semibold whitespace-nowrap text-center">เสีย</TableHead>
                <TableHead className="font-semibold whitespace-nowrap text-center">CPM</TableHead>
                <TableHead className="font-semibold whitespace-nowrap text-center">เติม</TableHead>
                <TableHead className="font-semibold whitespace-nowrap text-center">ต้นทุน/เติม</TableHead>
                <TableHead className="font-semibold whitespace-nowrap text-center">เล่นใหม่</TableHead>
                <TableHead className="font-semibold whitespace-nowrap text-center">1$/Cover</TableHead>
                <TableHead className="font-semibold whitespace-nowrap text-center">เงียบ</TableHead>
                <TableHead className="font-semibold whitespace-nowrap text-center">ซ้ำ</TableHead>
                <TableHead className="font-semibold whitespace-nowrap text-center">ยูส</TableHead>
                <TableHead className="font-semibold whitespace-nowrap text-center">กวน</TableHead>
                <TableHead className="font-semibold whitespace-nowrap text-center">บล็อก</TableHead>
                <TableHead className="font-semibold whitespace-nowrap text-center">เด็ก</TableHead>
                <TableHead className="font-semibold whitespace-nowrap text-center">50+</TableHead>
                <TableHead className="font-semibold whitespace-nowrap text-center">ชาติ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingData ? (
                <TableRow>
                  <TableCell colSpan={18} className="text-center py-8">
                    <div className="flex items-center justify-center gap-3">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/20"></div>
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent absolute top-0 left-0"></div>
                      </div>
                      <span className="animate-pulse">กำลังโหลดข้อมูล...</span>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : dashboardData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={18} className="text-center py-8 text-muted-foreground">
                    ไม่มีข้อมูล - กรุณาเลือกช่วงวันที่
                  </TableCell>
                </TableRow>
              ) : (
                dashboardData.map((row, index) => (
                  <TableRow 
                    key={`${row.team}-${index}`} 
                    className="border-white/10 hover:bg-white/5 dark:hover:bg-white/5 backdrop-blur-xl"
                  >
                    <TableCell className="font-medium whitespace-nowrap text-left">{displayTeamName(row.team)}</TableCell>
                    <TableCell className="whitespace-nowrap text-center">
                      <ProgressBar current={row.message} target={row.planMessage} label="ทัก" />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-center">
                      <SpendProgressBar current={row.spend} target={row.planSpend} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-center">{formatNumber(row.netMessages)}</TableCell>
                    <TableCell className="whitespace-nowrap text-center">{formatNumber(row.lostMessages)}</TableCell>
                    <TableCell className="whitespace-nowrap text-center">{formatDollar(row.cpm)}</TableCell>
                    <TableCell className="whitespace-nowrap text-center">{formatNumber(row.deposit)}</TableCell>
                    <TableCell className="whitespace-nowrap text-center">{formatDollar(row.costPerDeposit)}</TableCell>
                    <TableCell className="whitespace-nowrap text-right">{formatBaht(row.turnoverAdser)}</TableCell>
                    <TableCell className="whitespace-nowrap text-center">{formatDollar(row.dollarPerCover)}</TableCell>
                    <TableCell className="whitespace-nowrap text-center">{formatNumber(row.silent)}</TableCell>
                    <TableCell className="whitespace-nowrap text-center">{formatNumber(row.duplicate)}</TableCell>
                    <TableCell className="whitespace-nowrap text-center">{formatNumber(row.hasUser)}</TableCell>
                    <TableCell className="whitespace-nowrap text-center">{formatNumber(row.spam)}</TableCell>
                    <TableCell className="whitespace-nowrap text-center">{formatNumber(row.blocked)}</TableCell>
                    <TableCell className="whitespace-nowrap text-center">{formatNumber(row.under18)}</TableCell>
                    <TableCell className="whitespace-nowrap text-center">{formatNumber(row.over50)}</TableCell>
                    <TableCell className="whitespace-nowrap text-center">{formatNumber(row.foreign)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  // Update dateRange when it changes to trigger re-render
  useEffect(() => {
    if (dateRange?.from) {
      // Force update to ensure DateRangePicker receives the value
    }
  }, [dateRange])

  // Update URL when tab changes and save to localStorage
  const handleTabChange = (tabId: number) => {
    if (tabId === activeTab) return
    
    playSound('switch')
    setActiveTab(tabId)
    localStorage.setItem('dashboard-activeTab', String(tabId))
  }

  return (
    <div className="h-full flex gap-4 relative">
      {/* Left Card - เล็ก */}
      <div className={cn(
        "transition-all duration-300 flex-shrink-0 h-full relative",
        isLeftOpen ? "w-64" : "w-0"
      )}>
        <Card className={cn(
          "h-full transition-all duration-300",
          "bg-white/30 dark:bg-black/30 backdrop-blur-xl border-white/20",
          "shadow-xl",
          isLeftOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <CardContent className="h-full p-4">
            {/* Date Range Picker */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">เลือกช่วงวันที่</label>
                <DateRangePicker
                  date={dateRange}
                  onDateChange={handleDateRangeChange}
                />
              </div>
              
              {/* Month and Year Selector */}
              <div>
                <label className="text-sm font-medium mb-2 block">ดูกราฟ</label>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={selectedMonth} onValueChange={handleMonthChange}>
                    <SelectTrigger className="w-full h-9 text-sm bg-white/10 dark:bg-white/5 backdrop-blur-xl border-white/20">
                      <SelectValue placeholder="เดือน" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-950">
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedYear} onValueChange={handleYearChange}>
                    <SelectTrigger className="w-full h-9 text-sm bg-white/10 dark:bg-white/5 backdrop-blur-xl border-white/20">
                      <SelectValue placeholder="ปี" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-950">
                      {years.map((year) => (
                        <SelectItem key={year.value} value={year.value}>
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Chart Period Selector */}
              <div>
                <label className="text-sm font-medium mb-2 block">ประเภทกราฟ</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={chartPeriod === 'daily' ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                      "h-9 text-sm transition-all duration-200 ease-in-out",
                      "hover:bg-white/15 active:bg-white/20",
                      chartPeriod === 'daily'
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/10 dark:bg-white/5 border-white/20"
                    )}
                    onClick={() => setChartPeriod('daily')}
                  >
                    <span className={cn(
                      "transition-all duration-150",
                      chartPeriod === 'daily' ? "font-semibold" : "font-medium"
                    )}>
                      รายวัน
                    </span>
                  </Button>
                  
                  <Button
                    variant={chartPeriod === 'monthly' ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                      "h-9 text-sm transition-all duration-200 ease-in-out",
                      "hover:bg-white/15 active:bg-white/20",
                      chartPeriod === 'monthly'
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/10 dark:bg-white/5 border-white/20"
                    )}
                    onClick={() => setChartPeriod('monthly')}
                  >
                    <span className={cn(
                      "transition-all duration-150",
                      chartPeriod === 'monthly' ? "font-semibold" : "font-medium"
                    )}>
                      รายเดือน
                    </span>
                  </Button>
                </div>
              </div>

              {/* View Selector */}
              <div>
                <label className="text-sm font-medium mb-2 block">ดู</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedView === 'team' ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                      "h-9 text-sm transition-all duration-200 ease-in-out",
                      "hover:bg-white/15 active:bg-white/20",
                      selectedView === 'team'
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/10 dark:bg-white/5 border-white/20"
                    )}
                    onClick={() => handleViewChange('team')}
                  >
                    <span className={cn(
                      "transition-all duration-150",
                      selectedView === 'team' ? "font-semibold" : "font-medium"
                    )}>
                      ทีม
                    </span>
                  </Button>
                  <Button
                    variant={selectedView === 'adser' ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                      "h-9 text-sm transition-all duration-200 ease-in-out",
                      "hover:bg-white/15 active:bg-white/20",
                      selectedView === 'adser'
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/10 dark:bg-white/5 border-white/20"
                    )}
                    onClick={() => handleViewChange('adser')}
                  >
                    <span className={cn(
                      "transition-all duration-150",
                      selectedView === 'adser' ? "font-semibold" : "font-medium"
                    )}>
                      แอดเซอร์
                    </span>
                  </Button>
                </div>
              </div>

              {/* Goals Section */}
              <div className="pt-4 border-t border-white/20">
                <h3 className="text-sm font-semibold mb-3">
                  เป้าหมาย: {tabs.find(t => t.id === activeTab)?.name}
                </h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-[1fr,120px] gap-2 items-center">
                    <label className="text-xs text-muted-foreground">เป้า Cover ($)</label>
                    <Input
                      type="text"
                      value={goals[activeTab]?.cover || ''}
                      onChange={(e) => handleGoalChange('cover', e.target.value)}
                      placeholder="0"
                      className="h-9 text-sm bg-white/10 dark:bg-white/5 backdrop-blur-xl border-white/20"
                    />
                  </div>

                  <div className="grid grid-cols-[1fr,120px] gap-2 items-center">
                    <label className="text-xs text-muted-foreground">เป้า CPM</label>
                    <Input
                      type="text"
                      value={goals[activeTab]?.cpm || ''}
                      onChange={(e) => handleGoalChange('cpm', e.target.value)}
                      placeholder="0"
                      className="h-9 text-sm bg-white/10 dark:bg-white/5 backdrop-blur-xl border-white/20"
                    />
                  </div>

                  <div className="grid grid-cols-[1fr,120px] gap-2 items-center">
                    <label className="text-xs text-muted-foreground">เป้าต้ันทุนต่อเติม ($)</label>
                    <Input
                      type="text"
                      value={goals[activeTab]?.costPerDeposit || ''}
                      onChange={(e) => handleGoalChange('costPerDeposit', e.target.value)}
                      placeholder="0"
                      className="h-9 text-sm bg-white/10 dark:bg-white/5 backdrop-blur-xl border-white/20"
                    />
                  </div>

                  <div className="grid grid-cols-[1fr,120px] gap-2 items-center">
                    <label className="text-xs text-muted-foreground">เป้ายอดเติม ($)</label>
                    <Input
                      type="text"
                      value={goals[activeTab]?.deposit || ''}
                      onChange={(e) => handleGoalChange('deposit', e.target.value)}
                      placeholder="0"
                      className="h-9 text-sm bg-white/10 dark:bg-white/5 backdrop-blur-xl border-white/20"
                    />
                  </div>

                  <div className="grid grid-cols-[1fr,120px] gap-2 items-center">
                    <label className="text-xs text-muted-foreground">เป้ายอดเสีย (%)</label>
                    <Input
                      type="text"
                      value={goals[activeTab]?.loss || ''}
                      onChange={(e) => handleGoalChange('loss', e.target.value)}
                      placeholder="0"
                      className="h-9 text-sm bg-white/10 dark:bg-white/5 backdrop-blur-xl border-white/20"
                    />
                  </div>

                  <div className="grid grid-cols-[1fr,120px] gap-2 items-center">
                    <label className="text-xs text-muted-foreground">เป้าทักซ้ำ (%)</label>
                    <Input
                      type="text"
                      value={goals[activeTab]?.repeat || ''}
                      onChange={(e) => handleGoalChange('repeat', e.target.value)}
                      placeholder="0"
                      className="h-9 text-sm bg-white/10 dark:bg-white/5 backdrop-blur-xl border-white/20"
                    />
                  </div>

                  <div className="grid grid-cols-[1fr,120px] gap-2 items-center">
                    <label className="text-xs text-muted-foreground">เป้าเด็ก (%)</label>
                    <Input
                      type="text"
                      value={goals[activeTab]?.child || ''}
                      onChange={(e) => handleGoalChange('child', e.target.value)}
                      placeholder="0"
                      className="h-9 text-sm bg-white/10 dark:bg-white/5 backdrop-blur-xl border-white/20"
                    />
                  </div>
                </div>
              </div>

              {/* Refresh Info */}
              <div className="pt-4 border-t border-white/20">
                <div className="space-y-2 text-xs">
                  {lastRefresh && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">อัปเดตล่าสุด</span>
                      <span className="font-medium">
                        {lastRefresh.toLocaleTimeString('th-TH', { 
                          hour: '2-digit', 
                          minute: '2-digit', 
                          second: '2-digit' 
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">สถานะ</span>
                    <span className={cn(
                      "font-medium flex items-center gap-1",
                      isLoadingData ? "text-orange-500" : "text-green-500"
                    )}>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        isLoadingData ? "bg-orange-500 animate-pulse" : "bg-green-500"
                      )}></div>
                      {isLoadingData ? "กำลังโหลด..." : "พร้อมใช้งาน"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Exchange Rate Display - ล่างสุด */}
              <div className="pt-4 border-t border-white/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">เรท 1$</span>
                  <span className="font-medium">฿{exchangeRate.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Toggle Button for Left Card */}
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full",
            "bg-white/40 dark:bg-black/40 backdrop-blur-xl border-white/20",
            "shadow-lg hover:bg-white/60 dark:hover:bg-black/60",
            !isLeftOpen && "-right-10"
          )}
          onClick={() => handleLeftToggle(!isLeftOpen)}
        >
          {isLeftOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Center Card - กว้าง (เมนูหลัก) */}
      <Card className={cn(
        "flex-1 h-full flex flex-col overflow-hidden",
        "bg-white/30 dark:bg-black/30 backdrop-blur-xl border-white/20",
        "shadow-xl"
      )}>
        {/* Tabs Header */}
        <div className="flex gap-0 border-b border-white/20 bg-white/20 dark:bg-black/20 flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "px-6 py-3 text-sm font-medium transition-all duration-200 ease-in-out relative whitespace-nowrap",
                "hover:text-primary hover:bg-white/10 dark:hover:bg-white/5",
                "active:bg-white/15 dark:active:bg-white/10",
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary -mb-[1px] bg-white/10 dark:bg-white/5"
                  : "text-foreground/60"
              )}
            >
              <span className={cn(
                "transition-all duration-150",
                activeTab === tab.id ? "font-semibold" : "font-medium"
              )}>
                {tab.name}
              </span>
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        <CardContent className="flex-1 p-6 overflow-auto">
          <div>
            {activeTab === 1 && renderTable('หวย')}
            {activeTab === 2 && renderTable('บาคาร่า')}
            {activeTab === 3 && renderTable('หวยม้า')}
            {activeTab === 4 && renderTable('ฟุตบอลแอเรีย')}
            
            {/* Charts Section */}
            {dashboardData.length > 0 && (
              <Charts 
                data={dashboardData} 
                goals={{
                  cover: parseFloat(goals[activeTab]?.cover || '0'),
                  cpm: parseFloat(goals[activeTab]?.cpm || '0'),
                  deposit: parseFloat(goals[activeTab]?.deposit || '0'),
                  loss: parseFloat(goals[activeTab]?.loss || '0'),
                  repeat: parseFloat(goals[activeTab]?.repeat || '0'),
                  child: parseFloat(goals[activeTab]?.child || '0'),
                  costPerDeposit: parseFloat(goals[activeTab]?.costPerDeposit || '0')
                }}
                dateRange={dateRange}
                activeTab={activeTab.toString()}
                selectedView={selectedView}
                chartPeriod={chartPeriod}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
