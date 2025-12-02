'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingScreen } from '@/components/loading-screen'
import { Lock, User } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        
        if (data.user) {
          // User is already logged in, redirect to dashboard
          router.push('/dashboard')
          return
        }
      } catch (error) {
        // Session check failed, stay on login page
      } finally {
        setIsCheckingSession(false)
      }
    }

    checkSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'เกิดข้อผิดพลาด')
        setIsLoading(false)
        return
      }

      // Redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้')
      setIsLoading(false)
    }
  }

  if (isCheckingSession) {
    return <LoadingScreen message="กำลังตรวจสอบ..." />
  }

  if (isLoading) {
    return <LoadingScreen message="กำลังเข้าสู่ระบบ..." />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            ADS169TH
          </h1>
        </div>

        <Card className="shadow-2xl">
          <CardHeader>

          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">ชื่อผู้ใช้</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="กรอกชื่อผู้ใช้"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="กรอกรหัสผ่าน"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                เข้าสู่ระบบ
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>ลืมรหัสผ่าน? ติดต่อผู้ดูแลระบบ</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-muted-foreground space-y-2">
          <p>© 2025 ads169th System. All rights reserved.</p>
          <div className="flex items-center justify-center space-x-4">
            <a 
              href="/privacy" 
              className="hover:text-primary transition-colors underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              นโยบายความเป็นส่วนตัว
            </a>
            <span>•</span>
            <a 
              href="/terms" 
              className="hover:text-primary transition-colors underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ข้อกำหนดการใช้บริการ
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
