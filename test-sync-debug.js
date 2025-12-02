const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugSync() {
  try {
    console.log('🔍 เริ่มตรวจสอบข้อมูลในฐานข้อมูล...');
    
    // ตรวจสอบจำนวนข้อมูลทั้งหมด
    const totalRecords = await prisma.syncData.count();
    console.log(`📊 จำนวนข้อมูลทั้งหมด: ${totalRecords} รายการ`);
    
    if (totalRecords === 0) {
      console.log('❌ ไม่มีข้อมูลในฐานข้อมูล');
      return;
    }
    
    // ตรวจสอบข้อมูลล่าสุด
    const latestRecord = await prisma.syncData.findFirst({
      orderBy: { updatedAt: 'desc' },
      select: {
        team: true,
        adser: true,
        date: true,
        sheetName: true,
        updatedAt: true,
        createdAt: true
      }
    });
    
    console.log('📅 ข้อมูลล่าสุด:');
    console.log(`   ทีม: ${latestRecord.team}`);
    console.log(`   แอดเซอร์: ${latestRecord.adser}`);
    console.log(`   วันที่: ${latestRecord.date.toISOString().split('T')[0]}`);
    console.log(`   ชีต: ${latestRecord.sheetName}`);
    console.log(`   อัปเดตล่าสุด: ${latestRecord.updatedAt.toLocaleString('th-TH')}`);
    console.log(`   สร้างเมื่อ: ${latestRecord.createdAt.toLocaleString('th-TH')}`);
    
    // ตรวจสอบข้อมูลแยกตามชีต
    const sheets = ['สาวอ้อย', 'อลิน', 'อัญญาC', 'อัญญาD', 'สเปชบาร์', 'บาล้าน', 'ฟุตบอลแอร์เรีย'];
    
    console.log('\n📋 สถิติแยกตามชีต:');
    for (const sheet of sheets) {
      const count = await prisma.syncData.count({
        where: { sheetName: sheet }
      });
      
      const latest = await prisma.syncData.findFirst({
        where: { sheetName: sheet },
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true, date: true }
      });
      
      console.log(`   ${sheet}: ${count} รายการ (ล่าสุด: ${latest ? latest.date.toISOString().split('T')[0] : 'ไม่มีข้อมูล'})`);
    }
    
    // ตรวจสอบข้อมูลวันนี้
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayRecords = await prisma.syncData.count({
      where: {
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    });
    
    console.log(`\n📈 ข้อมูลวันนี้ (${today.toISOString().split('T')[0]}): ${todayRecords} รายการ`);
    
    // ตรวจสอบข้อมูลเมื่อวาน
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayRecords = await prisma.syncData.count({
      where: {
        date: {
          gte: yesterday,
          lt: today
        }
      }
    });
    
    console.log(`📈 ข้อมูลเมื่อวาน (${yesterday.toISOString().split('T')[0]}): ${yesterdayRecords} รายการ`);
    
    // ตรวจสอบข้อมูลสัปดาห์นี้
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekRecords = await prisma.syncData.count({
      where: {
        date: {
          gte: weekAgo
        }
      }
    });
    
    console.log(`📈 ข้อมูล 7 วันที่ผ่านมา: ${weekRecords} รายการ`);
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugSync();