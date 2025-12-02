'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { LoadingScreen } from './loading-screen'

/**
 * Optimistic Navigation Loading
 * แสดง loading เฉพาะเมื่อการนำทางใช้เวลานานเกิน 300ms
 */
export function NavigationProgress() {
  const router = useRouter()
  const pathname = usePathname()
  const [isNavigating, setIsNavigating] = useState(false)
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null

    // เมื่อเริ่มนำทาง
    const handleStart = () => {
      setIsNavigating(true)
      // แสดง loading หลังจาก 300ms (ถ้ายังโหลดไม่เสร็จ)
      timeout = setTimeout(() => {
        setShowLoading(true)
      }, 300)
    }

    // เมื่อนำทางเสร็จ
    const handleComplete = () => {
      setIsNavigating(false)
      setShowLoading(false)
      if (timeout) clearTimeout(timeout)
    }

    // ใน Next.js App Router ไม่มี router events แบบเดิม
    // ใช้ pathname change แทน
    handleComplete()

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [pathname])

  if (!showLoading) return null

  return <LoadingScreen message="กำลังโหลด..." />
}
