import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin, hashPassword, logActivity, getClientIP } from '@/lib/auth'
import { logger } from '@/lib/logger'

const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'EMPLOYEE']),
  teams: z.array(z.string()).default([]),
})

const updateUserSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['ADMIN', 'EMPLOYEE']).optional(),
  teams: z.array(z.string()).optional(),
  isLocked: z.boolean().optional(),
})

// GET /api/admin/users - List all users
export async function GET(request: NextRequest) {
  try {
    const session = await requireAdmin()

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        teams: true,
        isLocked: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            sessions: true,
            activityLogs: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ users })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 403 })
    }

    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' },
      { status: 500 }
    )
  }
}

// POST /api/admin/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin()
    const body = await request.json()
    const data = createUserSchema.parse(body)

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: data.username },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        role: data.role,
        teams: data.teams,
      },
      select: {
        id: true,
        username: true,
        role: true,
        teams: true,
        createdAt: true,
      },
    })

    // Log activity
    const ipAddress = getClientIP(request.headers)
    const userAgent = request.headers.get('user-agent') || undefined
    
    await logActivity(
      session.id,
      'USER_CREATE',
      `สร้างผู้ใช้ใหม่: ${user.username}`,
      { userId: user.id, username: user.username, role: user.role },
      ipAddress,
      userAgent
    )

    // Log to console
    logger.admin.userCreated(user.username, user.role, session.username)

    return NextResponse.json({ user }, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 403 })
    }

    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/users - Update a user
export async function PUT(request: NextRequest) {
  try {
    const session = await requireAdmin()
    const body = await request.json()
    const { id, ...updates } = body
    
    if (!id) {
      return NextResponse.json({ error: 'ต้องระบุ ID ผู้ใช้' }, { status: 400 })
    }

    const data = updateUserSchema.parse(updates)

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {}
    
    if (data.username) {
      // Check if new username is already taken
      const existingUser = await prisma.user.findFirst({
        where: {
          username: data.username,
          NOT: { id },
        },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' },
          { status: 400 }
        )
      }

      updateData.username = data.username
    }

    if (data.password) {
      updateData.password = await hashPassword(data.password)
    }

    if (data.role !== undefined) updateData.role = data.role
    if (data.teams !== undefined) updateData.teams = data.teams
    if (data.isLocked !== undefined) updateData.isLocked = data.isLocked

    // Update user
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        role: true,
        teams: true,
        isLocked: true,
        updatedAt: true,
      },
    })

    // If user is locked, delete their sessions
    if (data.isLocked) {
      await prisma.session.deleteMany({
        where: { userId: id },
      })
    }

    // Log activity
    const ipAddress = getClientIP(request.headers)
    const userAgent = request.headers.get('user-agent') || undefined
    
    await logActivity(
      session.id,
      'USER_UPDATE',
      `อัพเดทผู้ใช้: ${user.username}`,
      { userId: user.id, changes: updates },
      ipAddress,
      userAgent
    )

    return NextResponse.json({ user })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 403 })
    }

    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพเดทผู้ใช้' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users - Delete a user
export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAdmin()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ต้องระบุ ID ผู้ใช้' }, { status: 400 })
    }

    // Prevent deleting self
    if (id === session.id) {
      return NextResponse.json(
        { error: 'ไม่สามารถลบบัญชีของตนเองได้' },
        { status: 400 }
      )
    }

    // Get user before deleting
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 })
    }

    // Delete user (cascade will delete related records)
    await prisma.user.delete({
      where: { id },
    })

    // Log activity
    const ipAddress = getClientIP(request.headers)
    const userAgent = request.headers.get('user-agent') || undefined
    
    await logActivity(
      session.id,
      'USER_DELETE',
      `ลบผู้ใช้: ${user.username}`,
      { userId: user.id, username: user.username },
      ipAddress,
      userAgent
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 403 })
    }

    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบผู้ใช้' },
      { status: 500 }
    )
  }
}
