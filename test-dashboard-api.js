const fetch = require('node-fetch');

async function testDashboardAPI() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  console.log(`🔍 ทดสอบ API Dashboard สำหรับวันที่: ${todayStr}`);
  
  try {
    const url = `http://localhost:3000/api/dashboard/data?startDate=${todayStr}&endDate=${todayStr}&tab=lottery&view=team`;
    console.log(`📡 เรียก API: ${url}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ API Error:', data);
      return;
    }
    
    console.log('📊 ผลลัพธ์:');
    console.log(`   จำนวนทีม: ${data.data?.length || 0}`);
    console.log(`   อัตราแลกเปลี่ยน: ${data.exchangeRate || 'ไม่มี'}`);
    
    if (data.data && data.data.length > 0) {
      console.log('\n📋 ข้อมูลแต่ละทีม:');
      data.data.forEach((team, index) => {
        console.log(`   ${index + 1}. ${team.team}:`);
        console.log(`      ข้อความ: ${team.message || 0}`);
        console.log(`      ใช้จ่าย: ${team.spend || 0}`);
        console.log(`      ยอดเติม: ${team.turnover || 0}`);
        console.log(`      Cover: ${team.hasUser || 0}`);
      });
    } else {
      console.log('❌ ไม่มีข้อมูลสำหรับวันที่นี้');
    }
    
    // ทดสอบกับข้อมูลย้อนหลัง
    console.log('\n🔄 ทดสอบข้อมูลเมื่อวาน...');
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const url2 = `http://localhost:3000/api/dashboard/data?startDate=${yesterdayStr}&endDate=${yesterdayStr}&tab=lottery&view=team`;
    const response2 = await fetch(url2);
    const data2 = await response2.json();
    
    console.log(`📊 ข้อมูลเมื่อวาน (${yesterdayStr}): ${data2.data?.length || 0} ทีม`);
    
    // ทดสอบกับข้อมูลสัปดาห์ที่แล้ว
    console.log('\n🔄 ทดสอบข้อมูลสัปดาห์ที่แล้ว...');
    const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    const url3 = `http://localhost:3000/api/dashboard/data?startDate=${weekStartStr}&endDate=${todayStr}&tab=lottery&view=team`;
    const response3 = await fetch(url3);
    const data3 = await response3.json();
    
    console.log(`📊 ข้อมูล 7 วันที่ผ่านมา: ${data3.data?.length || 0} ทีม`);
    
    if (data3.data && data3.data.length > 0) {
      console.log('   ข้อมูลรวม 7 วัน:');
      data3.data.forEach((team, index) => {
        console.log(`   ${index + 1}. ${team.team}: ${team.message || 0} ข้อความ, ${team.spend || 0} บาท`);
      });
    }
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
  }
}

testDashboardAPI();