'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, RefreshCw, Database, Calendar, Users, TrendingUp } from 'lucide-react'

interface SyncStatus {
  sheet: string
  recordCount: number
  lastUpdated: string | null
}

interface SyncResult {
  success: { sheet: string; records: number }[]
  failed: { sheet: string; error: string }[]
  totalRecords: number
  totalInserted: number
  totalUpdated: number
}

export default function SyncPage() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus[]>([])
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)

  // ดึงสถานะการซิงค์
  const fetchSyncStatus = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/sync/sheets')
      if (response.ok) {
        const data = await response.json()
        setSyncStatus(data.stats || [])
      }
    } catch (error) {
      console.error('Error fetching sync status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // ซิงค์ข้อมูลทั้งหมด
  const syncAllSheets = async () => {
    setIsSyncing(true)
    setSyncResult(null)
    
    try {
      const response = await fetch('/api/sync/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // ซิงค์ทั้งหมด
      })
      
      if (response.ok) {
        const data = await response.json()
        setSyncResult(data.results)
        setLastSyncTime(new Date().toLocaleString('th-TH'))
        
        // รีเฟรชสถานะหลังซิงค์เสร็จ
        setTimeout(() => {
          fetchSyncStatus()
        }, 1000)
      } else {
        const errorData = await response.json()
        console.error('Sync error:', errorData)
        setSyncResult({
          success: [],
          failed: [{ sheet: 'ทั้งหมด', error: errorData.error || 'เกิดข้อผิดพลาดในการซิงค์' }],
          totalRecords: 0,
          totalInserted: 0,
          totalUpdated: 0
        })
      }
    } catch (error) {
      console.error('Error syncing:', error)
      setSyncResult({
        success: [],
        failed: [{ sheet: 'ทั้งหมด', error: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้' }],
        totalRecords: 0,
        totalInserted: 0,
        totalUpdated: 0
      })
    } finally {
      setIsSyncing(false)
    }
  }

  // ซิงค์ชีตเดียว
  const syncSingleSheet = async (sheetName: string) => {
    setIsSyncing(true)
    
    try {
      const response = await fetch('/api/sync/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sheets: [sheetName] }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setSyncResult(data.results)
        setLastSyncTime(new Date().toLocaleString('th-TH'))
        
        // รีเฟรชสถานะหลังซิงค์เสร็จ
        setTimeout(() => {
          fetchSyncStatus()
        }, 1000)
      }
    } catch (error) {
      console.error('Error syncing sheet:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  useEffect(() => {
    fetchSyncStatus()
    
    // ตั้งค่าให้อัปเดตข้อมูลทุก 30 วินาที
    const interval = setInterval(() => {
      fetchSyncStatus()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'ไม่มีข้อมูล'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'ไม่มีข้อมูล'
    }
  }

  const totalRecords = syncStatus.reduce((sum, status) => sum + status.recordCount, 0)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">จัดการซิงค์ข้อมูล</h1>
          <p className="text-muted-foreground mt-1">
            ซิงค์ข้อมูลจาก Google Sheets และตรวจสอบสถานะ
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={fetchSyncStatus} 
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            รีเฟรช
          </Button>
          
          <Button 
            onClick={syncAllSheets}
            disabled={isSyncing}
            className="bg-primary hover:bg-primary/90"
          >
            {isSyncing ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Database className="w-4 h-4 mr-2" />
            )}
            ซิงค์ทั้งหมด
          </Button>
        </div>
      </div>

      {/* สรุปข้อมูล */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">จำนวนข้อมูลทั้งหมด</p>
              <p className="text-2xl font-bold">{totalRecords.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">จำนวนชีต</p>
              <p className="text-2xl font-bold">{syncStatus.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">ซิงค์ครั้งล่าสุด</p>
              <p className="text-sm font-medium">
                {lastSyncTime || 'ยังไม่ได้ซิงค์'}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">สถานะ</p>
              <Badge variant={isSyncing ? "default" : "secondary"}>
                {isSyncing ? 'กำลังซิงค์...' : 'พร้อม'}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* สถานะแต่ละชีต */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">สถานะแต่ละชีต</h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>กำลังโหลด...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {syncStatus.map((status) => (
              <div 
                key={status.sheet}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{status.sheet}</h3>
                    <Badge variant="outline">
                      {status.recordCount.toLocaleString()} รายการ
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    อัปเดตล่าสุด: {formatDate(status.lastUpdated)}
                  </p>
                </div>
                
                <Button
                  onClick={() => syncSingleSheet(status.sheet)}
                  disabled={isSyncing}
                  variant="outline"
                  size="sm"
                >
                  {isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  ซิงค์
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ผลลัพธ์การซิงค์ล่าสุด */}
      {syncResult && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">ผลลัพธ์การซิงค์ล่าสุด</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* สำเร็จ */}
            <div>
              <h3 className="font-medium text-green-600 mb-3">
                ซิงค์สำเร็จ ({syncResult.success.length} ชีต)
              </h3>
              <div className="space-y-2">
                {syncResult.success.map((item) => (
                  <div key={item.sheet} className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="font-medium">{item.sheet}</span>
                    <Badge variant="secondary">
                      {item.records.toLocaleString()} รายการ
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-green-100 rounded">
                <div className="text-sm space-y-1">
                  <div>จำนวนข้อมูลทั้งหมด: <span className="font-medium">{syncResult.totalRecords.toLocaleString()}</span></div>
                  <div>เพิ่มใหม่: <span className="font-medium text-blue-600">{syncResult.totalInserted.toLocaleString()}</span></div>
                  <div>อัปเดต: <span className="font-medium text-orange-600">{syncResult.totalUpdated.toLocaleString()}</span></div>
                </div>
              </div>
            </div>

            {/* ล้มเหลว */}
            {syncResult.failed.length > 0 && (
              <div>
                <h3 className="font-medium text-red-600 mb-3">
                  ซิงค์ล้มเหลว ({syncResult.failed.length} ชีต)
                </h3>
                <div className="space-y-2">
                  {syncResult.failed.map((item) => (
                    <div key={item.sheet} className="p-2 bg-red-50 rounded">
                      <div className="font-medium text-red-700">{item.sheet}</div>
                      <div className="text-sm text-red-600 mt-1">{item.error}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}