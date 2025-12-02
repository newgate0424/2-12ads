'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Pencil, Trash2, Shield, Users as UsersIcon, Lock, Unlock } from 'lucide-react'
import { LoadingScreen } from '@/components/loading-screen'

interface User {
  id: string
  username: string
  role: 'ADMIN' | 'EMPLOYEE'
  teams: string[]
  isLocked: boolean
  createdAt: string
  updatedAt: string
}

const availableTeams = [
  'ฝ่ายขาย',
  'ฝ่ายการตลาด',
  'ฝ่ายบัญชี',
  'ฝ่ายบุคคล',
  'ฝ่ายไอที',
  'ฝ่ายผลิต',
  'ฝ่ายคลังสินค้า',
  'ฝ่ายบริการลูกค้า',
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'EMPLOYEE' as 'ADMIN' | 'EMPLOYEE',
    teams: [] as string[],
  })

  useEffect(() => {
    fetchUsers()
    
    // Real-time: Refresh every 15 seconds
    const interval = setInterval(fetchUsers, 15000)
    return () => clearInterval(interval)
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(data.users || [])
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingUser ? '/api/admin/users' : '/api/admin/users'
      const method = editingUser ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser ? { ...formData, id: editingUser.id } : formData),
      })

      if (res.ok) {
        setIsDialogOpen(false)
        setEditingUser(null)
        setFormData({ username: '', password: '', role: 'EMPLOYEE', teams: [] })
        fetchUsers()
      } else {
        const data = await res.json()
        alert(data.error || 'เกิดข้อผิดพลาด')
      }
    } catch (error) {
      alert('ไม่สามารถบันทึกข้อมูลได้')
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?')) return

    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      })

      if (res.ok) {
        fetchUsers()
      } else {
        const data = await res.json()
        alert(data.error || 'ไม่สามารถลบผู้ใช้ได้')
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาด')
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      password: '',
      role: user.role,
      teams: user.teams,
    })
    setIsDialogOpen(true)
  }

  const handleToggleLock = async (user: User) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          isLocked: !user.isLocked,
        }),
      })

      if (res.ok) {
        fetchUsers()
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาด')
    }
  }

  const toggleTeam = (team: string) => {
    setFormData((prev) => ({
      ...prev,
      teams: prev.teams.includes(team)
        ? prev.teams.filter((t) => t !== team)
        : [...prev.teams, team],
    }))
  }

  if (isLoading) {
    return <LoadingScreen message="กำลังโหลดข้อมูล..." />
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      {/* Header with Real-time Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">จัดการผู้ใช้</h1>
          <p className="text-sm text-muted-foreground mt-1">เพิ่ม แก้ไข และจัดการผู้ใช้ในระบบ</p>
        </div>
        <RealTimeIndicator 
          isUpdating={isLoading}
          lastUpdate={lastUpdate || undefined}
          interval={15}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้ทั้งหมด</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">ในระบบ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ดูแลระบบ</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === 'ADMIN').length}
            </div>
            <p className="text-xs text-muted-foreground">Admin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">บัญชีถูกล็อค</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.isLocked).length}
            </div>
            <p className="text-xs text-muted-foreground">ไม่สามารถเข้าสู่ระบบได้</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>จัดการผู้ใช้</CardTitle>
              <CardDescription>เพิ่ม แก้ไข หรือลบผู้ใช้ในระบบ</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingUser(null)
                  setFormData({ username: '', password: '', role: 'EMPLOYEE', teams: [] })
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  เพิ่มผู้ใช้
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingUser ? 'แก้ไขผู้ใช้' : 'เพิ่มผู้ใช้ใหม่'}
                  </DialogTitle>
                  <DialogDescription>
                    กรอกข้อมูลผู้ใช้ใหม่ และกำหนดสิทธิ์การเข้าถึง
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">ชื่อผู้ใช้</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      required
                      disabled={!!editingUser}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">
                      รหัสผ่าน {editingUser && '(เว้นว่างถ้าไม่ต้องการเปลี่ยน)'}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required={!editingUser}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">บทบาท</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: 'ADMIN' | 'EMPLOYEE') =>
                        setFormData({ ...formData, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EMPLOYEE">พนักงาน</SelectItem>
                        <SelectItem value="ADMIN">ผู้ดูแลระบบ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>ทีมที่สังกัด</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableTeams.map((team) => (
                        <label
                          key={team}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.teams.includes(team)}
                            onChange={() => toggleTeam(team)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{team}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      ยกเลิก
                    </Button>
                    <Button type="submit">
                      {editingUser ? 'บันทึก' : 'เพิ่มผู้ใช้'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อผู้ใช้</TableHead>
                <TableHead>บทบาท</TableHead>
                <TableHead>ทีม</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่สร้าง</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {user.role === 'ADMIN' && (
                        <Shield className="w-4 h-4 text-primary" />
                      )}
                      <span>
                        {user.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'พนักงาน'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.teams.slice(0, 2).map((team) => (
                        <span
                          key={team}
                          className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
                        >
                          {team}
                        </span>
                      ))}
                      {user.teams.length > 2 && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-muted">
                          +{user.teams.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.isLocked ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-destructive/10 text-destructive">
                        ล็อค
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500">
                        ปกติ
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('th-TH')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleLock(user)}
                        title={user.isLocked ? 'ปลดล็อค' : 'ล็อคบัญชี'}
                      >
                        {user.isLocked ? (
                          <Unlock className="h-4 w-4" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
