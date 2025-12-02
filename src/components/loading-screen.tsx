'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

const loadingMessages = [
  'กำลังโหลดข้อมูล...',
  'กำลังประมวลผล...',
  'กรุณารอสักครู่...',
  'เกือบเสร็จแล้ว...',
  'กำลังเตรียมข้อมูล...',
]

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message }: LoadingScreenProps = {}) {
  const [currentMessage, setCurrentMessage] = useState(message || loadingMessages[0])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!message) {
      const messageInterval = setInterval(() => {
        setCurrentMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)])
      }, 2000)

      return () => clearInterval(messageInterval)
    }
  }, [message])

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        return prev + Math.random() * 10
      })
    }, 300)

    return () => clearInterval(progressInterval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative">
        {/* Grid background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg blur-3xl" />
        </div>

        {/* Loading card */}
        <div className="relative bg-card border rounded-lg shadow-2xl p-8 min-w-[300px]">
          {/* Spinning loaders */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <Loader2 className="h-16 w-16 text-primary/40 animate-spin absolute inset-0" style={{ animationDuration: '1.5s' }} />
              <Loader2 className="h-16 w-16 text-primary/20 animate-spin absolute inset-0" style={{ animationDuration: '2s' }} />
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-4">
            <p className="text-lg font-medium text-foreground animate-pulse">
              {currentMessage}
            </p>

            {/* Progress bar */}
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Dots animation */}
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
