'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCircle, Monitor, LogOut, RefreshCw, Users, Shield, Lock, Activity } from 'lucide-react'
import { LoadingScreen } from '@/components/loading-screen'
import { useToast } from '@/hooks/use-toast'

interface Session {
  id: string
  userId: string
  user: {
    username: string
    role: string
  }
  userAgent: string | null
  ipAddress: string | null
  expiresAt: string
  createdAt: string
}

interface SystemStats {
  totalUsers: number
  activeSessions: number
  adminCount: number
  employeeCount: number
  lockedUsers: number
  onlineUsers: Array<{
    username: string
    role: string
    ipAddress: string | null
    loginAt: string
    expiresAt: string
  }>
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [sessionToRevoke, setSessionToRevoke] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchSessions()
    fetchStats()
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/system/stats', {
        cache: 'no-store',
      })
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const fetchSessions = async () => {
    try {
      setIsRefreshing(true)
      const res = await fetch('/api/admin/sessions')
      const data = await res.json()
      setSessions(data.sessions || [])
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sessionId }),
      })

      if (res.ok) {
        // ส่งสัญญาณผ่าน BroadcastChannel เฉพาะ session ที่ถูกเตะออก
        const revokedSession = sessions.find(s => s.id === sessionId)
        if (revokedSession) {
          try {
            const channel = new BroadcastChannel('session_channel')
            channel.postMessage({
              type: 'SESSION_REVOKED',
              sessionId,
              userId: revokedSession.userId,
              timestamp: Date.now()
            })
            channel.close()
          } catch (err) {
            console.error('BroadcastChannel error:', err)
          }
          
          // ส่งผ่าน localStorage เป็น fallback (สำหรับ cross-tab)
          localStorage.setItem('session_revoked', JSON.stringify({
            sessionId,
            userId: revokedSession.userId,
            timestamp: Date.now()
          }))
          setTimeout(() => {
            localStorage.removeItem('session_revoked')
          }, 1000)
        }
        
        toast({
          title: "บังคับออกจากระบบสำเร็จ",
          description: "ผู้ใช้ถูกบังคับออกจากระบบแล้ว",
        })
        
        setSessionToRevoke(null)
        fetchSessions()
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถบังคับออกจากระบบได้",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
        variant: "destructive",
      })
    }
  }

  const getBrowser = (userAgent: string | null) => {
    if (!userAgent) return 'ไม่ทราบ'
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'อื่นๆ'
  }

  const getDevice = (userAgent: string | null) => {
    if (!userAgent) return 'ไม่ทราบ'
    if (userAgent.includes('Mobile')) return 'มือถือ'
    if (userAgent.includes('Tablet')) return 'แท็บเล็ต'
    return 'คอมพิวเตอร์'
  }

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diff = expiry.getTime() - now.getTime()
    
    if (diff <= 0) return 'หมดอายุ'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days} วัน ${hours} ชั่วโมง`
    return `${hours} ชั่วโมง`
  }

  if (isLoading) {
    return <LoadingScreen message="กำลังโหลดข้อมูล..." />
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      {/* Stats Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* ผู้ใช้ทั้งหมด */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้ทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              ทั้งหมดในระบบ
            </p>
          </CardContent>
        </Card>

        {/* ผู้ใช้ออนไลน์ */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้ออนไลน์</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats?.activeSessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.adminCount || 0} ผู้ดูแล, {stats?.employeeCount || 0} พนักงาน
            </p>
          </CardContent>
        </Card>

        {/* บัญชีถูกล็อค */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">บัญชีถูกล็อค</CardTitle>
            <Lock className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats?.lockedUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              บัญชีที่ถูกระงับ
            </p>
          </CardContent>
        </Card>

        {/* สถานะระบบ */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สถานะระบบ</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">ปกติ</div>
            <p className="text-xs text-muted-foreground">
              ทำงานเป็นปกติ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>เซสชันที่ active</CardTitle>
              <CardDescription>รายการผู้ใช้ที่เข้าสู่ระบบอยู่</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSessions}
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              รีเฟรช
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <UserCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">ไม่มีผู้ใช้ออนไลน์</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                ไม่มีเซสชันที่ active ในขณะนี้
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ผู้ใช้</TableHead>
                  <TableHead>บทบาท</TableHead>
                  <TableHead>อุปกรณ์</TableHead>
                  <TableHead>เบราว์เซอร์</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>เวลาเข้าสู่ระบบ</TableHead>
                  <TableHead>หมดอายุใน</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      {session.user.username}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          session.user.role === 'ADMIN'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {session.user.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'พนักงาน'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                        <span>{getDevice(session.userAgent)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getBrowser(session.userAgent)}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {session.ipAddress || 'ไม่ทราบ'}
                    </TableCell>
                    <TableCell>
                      {new Date(session.createdAt).toLocaleString('th-TH')}
                    </TableCell>
                    <TableCell>
                      {getTimeRemaining(session.expiresAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSessionToRevoke(session.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        บังคับออก
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ผู้ใช้ที่ออนไลน์ */}
      {stats && stats.onlineUsers && stats.onlineUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>ผู้ใช้ที่ออนไลน์</CardTitle>
            <CardDescription>รายชื่อผู้ใช้ที่กำลังใช้งานระบบ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.onlineUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'พนักงาน'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {user.ipAddress || 'ไม่ทราบ IP'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(user.loginAt).toLocaleTimeString('th-TH')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={!!sessionToRevoke} onOpenChange={() => setSessionToRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการบังคับออกจากระบบ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ว่าต้องการบังคับผู้ใช้นี้ออกจากระบบ? 
              ผู้ใช้จะต้องเข้าสู่ระบบใหม่อีกครั้ง
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => sessionToRevoke && handleRevokeSession(sessionToRevoke)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              บังคับออกจากระบบ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
