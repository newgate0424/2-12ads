'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { RealTimeIndicator } from '@/components/real-time-indicator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { LoadingScreen } from '@/components/loading-screen'

interface ActivityLog {
  id: string
  userId: string
  action: string
  description: string
  metadata: any
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  user: {
    username: string
    role: string
  }
}

const actionLabels: Record<string, string> = {
  'LOGIN': 'เข้าสู่ระบบ',
  'LOGIN_FAILED': 'เข้าสู่ระบบล้มเหลว',
  'LOGOUT': 'ออกจากระบบ',
  'USER_CREATE': 'สร้างผู้ใช้',
  'USER_UPDATE': 'แก้ไขผู้ใช้',
  'USER_DELETE': 'ลบผู้ใช้',
  'SETTINGS_UPDATE': 'เปลี่ยนการตั้งค่า',
  'SESSION_REVOKE': 'บังคับออกจากระบบ',
}

const actionColors: Record<string, string> = {
  'LOGIN': 'bg-green-500/10 text-green-500',
  'LOGIN_FAILED': 'bg-red-500/10 text-red-500',
  'LOGOUT': 'bg-yellow-500/10 text-yellow-500',
  'USER_CREATE': 'bg-blue-500/10 text-blue-500',
  'USER_UPDATE': 'bg-purple-500/10 text-purple-500',
  'USER_DELETE': 'bg-red-500/10 text-red-500',
  'SETTINGS_UPDATE': 'bg-indigo-500/10 text-indigo-500',
  'SESSION_REVOKE': 'bg-orange-500/10 text-orange-500',
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [filterAction, setFilterAction] = useState<string>('all')
  const [filterUser, setFilterUser] = useState<string>('all')
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    fetchLogs()
    
    // Real-time: Refresh every 10 seconds
    const interval = setInterval(() => {
      // Only auto-refresh if on page 1 (latest logs)
      if (page === 1) {
        fetchLogs()
      }
    }, 10000)
    
    return () => clearInterval(interval)
  }, [page, filterAction, filterUser])

  const fetchLogs = async () => {
    try {
      setIsRefreshing(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      
      if (filterAction !== 'all') {
        params.append('action', filterAction)
      }
      
      if (filterUser !== 'all') {
        params.append('userId', filterUser)
      }

      const res = await fetch(`/api/admin/activity-logs?${params}`)
      const data = await res.json()
      
      setLogs(data.logs || [])
      setTotalPages(Math.ceil((data.total || 0) / limit))
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const getActionLabel = (action: string) => {
    return actionLabels[action] || action
  }

  const getActionColor = (action: string) => {
    return actionColors[action] || 'bg-muted text-muted-foreground'
  }

  if (isLoading) {
    return <LoadingScreen message="กำลังโหลดข้อมูล..." />
  }

  // Get unique users for filter
  const uniqueUsers = Array.from(
    new Set(logs.map((log) => JSON.stringify({ id: log.userId, username: log.user.username })))
  ).map((item) => JSON.parse(item))

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      {/* Header with Real-time Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">บันทึกกิจกรรม</h1>
          <p className="text-sm text-muted-foreground mt-1">ติดตามการใช้งานของผู้ใช้</p>
        </div>
        <RealTimeIndicator 
          isUpdating={isRefreshing}
          lastUpdate={lastUpdate || undefined}
          interval={10}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กิจกรรมทั้งหมด</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
            <p className="text-xs text-muted-foreground">บันทึก</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เข้าสู่ระบบสำเร็จ</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter((l) => l.action === 'LOGIN').length}
            </div>
            <p className="text-xs text-muted-foreground">ครั้ง</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เข้าสู่ระบบล้มเหลว</CardTitle>
            <Activity className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter((l) => l.action === 'LOGIN_FAILED').length}
            </div>
            <p className="text-xs text-muted-foreground">ครั้ง</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">จัดการผู้ใช้</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter((l) => ['USER_CREATE', 'USER_UPDATE', 'USER_DELETE'].includes(l.action)).length}
            </div>
            <p className="text-xs text-muted-foreground">ครั้ง</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>บันทึกกิจกรรม</CardTitle>
              <CardDescription>ประวัติการใช้งานของผู้ใช้ทั้งหมด</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="ประเภท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {Object.entries(actionLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchLogs}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">ไม่มีบันทึกกิจกรรม</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                ยังไม่มีกิจกรรมที่ตรงกับเงื่อนไขที่เลือก
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>เวลา</TableHead>
                      <TableHead>ผู้ใช้</TableHead>
                      <TableHead>กิจกรรม</TableHead>
                      <TableHead>รายละเอียด</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString('th-TH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.user.username}</div>
                            <div className="text-xs text-muted-foreground">
                              {log.user.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'พนักงาน'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getActionColor(
                              log.action
                            )}`}
                          >
                            {getActionLabel(log.action)}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="text-sm">{log.description}</div>
                          {log.metadata && Object.keys(log.metadata).length > 0 && (
                            <details className="mt-1">
                              <summary className="text-xs text-muted-foreground cursor-pointer">
                                ดูข้อมูลเพิ่มเติม
                              </summary>
                              <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto">
                                {JSON.stringify(log.metadata, null, 2)}
                              </pre>
                            </details>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {log.ipAddress || 'ไม่ทราบ'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  หน้า {page} จาก {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    ก่อนหน้า
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    ถัดไป
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
