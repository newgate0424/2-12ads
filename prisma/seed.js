const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // สร้าง admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
      teams: [],
      isLocked: false,
    },
  })
  
  console.log('✅ Created admin user:', adminUser.username)

  // สร้าง test employee user
  const hashedEmployeePassword = await bcrypt.hash('employee123', 12)
  
  const employeeUser = await prisma.user.upsert({
    where: { username: 'employee' },
    update: {},
    create: {
      username: 'employee',
      password: hashedEmployeePassword,
      role: 'EMPLOYEE',
      teams: ['IT', 'Support'],
      isLocked: false,
    },
  })
  
  console.log('✅ Created employee user:', employeeUser.username)
  
  console.log('🎉 Database seeding completed successfully!')
  console.log('')
  console.log('📝 Login credentials:')
  console.log('👤 Admin: username=admin, password=admin123')
  console.log('👤 Employee: username=employee, password=employee123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })