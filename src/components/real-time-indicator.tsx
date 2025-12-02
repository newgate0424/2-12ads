'use client'

import { useEffect, useState } from 'react'
import { Activity, Wifi, WifiOff } from 'lucide-react'

interface RealTimeIndicatorProps {
  isUpdating?: boolean
  lastUpdate?: Date
  interval?: number // in seconds
}

export function RealTimeIndicator({ 
  isUpdating = false, 
  lastUpdate,
  interval = 10
}: RealTimeIndicatorProps) {
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0)

  useEffect(() => {
    if (!lastUpdate) return

    const timer = setInterval(() => {
      const seconds = Math.floor((Date.now() - lastUpdate.getTime()) / 1000)
      setSecondsSinceUpdate(seconds)
    }, 1000)

    return () => clearInterval(timer)
  }, [lastUpdate])

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {isUpdating ? (
        <>
          <Activity className="h-3 w-3 animate-pulse text-green-500" />
          <span className="text-green-500">กำลังอัปเดต...</span>
        </>
      ) : (
        <>
          <div className="relative">
            <Wifi className="h-3 w-3 text-green-500" />
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <span>
            {lastUpdate ? (
              <>
                อัปเดตล่าสุด {secondsSinceUpdate}s ที่แล้ว
                {interval && ` • รีเฟรชอัตโนมัติทุก ${interval}s`}
              </>
            ) : (
              `รีเฟรชอัตโนมัติทุก ${interval}s`
            )}
          </span>
        </>
      )}
    </div>
  )
}

export function OfflineIndicator() {
  return (
    <div className="flex items-center gap-2 text-xs text-destructive">
      <WifiOff className="h-3 w-3" />
      <span>ออฟไลน์</span>
    </div>
  )
}
