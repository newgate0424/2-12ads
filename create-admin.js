const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // ลบ admin เก่าถ้ามี
    await prisma.user.deleteMany({
      where: { username: 'admin' }
    });

    // สร้าง admin ใหม่
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = await prisma.user.create({
      data: {
        id: 'admin-001',
        username: 'admin',
        password: hashedPassword,
        role: 'ADMIN',
        teams: [],
        isLocked: false,
      }
    });

    console.log('✅ สร้าง Admin User สำเร็จ!');
    console.log('Username:', admin.username);
    console.log('Password: admin123');
    console.log('\n🚀 ตอนนี้รันคำสั่ง: npm run dev');
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
