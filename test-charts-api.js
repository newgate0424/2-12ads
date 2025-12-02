const fetch = require('node-fetch');

async function testChartsAPI() {
  console.log('🔍 ทดสอบ API Charts สำหรับแอดเซอร์...');
  
  try {
    // ทดสอบ API Charts สำหรับ adser view
    const url = `http://localhost:3000/api/dashboard/charts?startDate=2025-11-01&endDate=2025-11-05&tab=lottery&view=adser&period=daily`;
    console.log(`📡 เรียก API: ${url}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ API Error:', data);
      return;
    }
    
    console.log('📊 ผลลัพธ์:');
    console.log(`   จำนวนข้อมูล: ${data.data?.length || 0} วัน`);
    console.log(`   ประเภท: ${data.period}`);
    console.log(`   มุมมอง: ${data.view}`);
    
    if (data.data && data.data.length > 0) {
      console.log('\n📋 ตัวอย่างข้อมูลวันแรก:');
      const firstDay = data.data[0];
      console.log(`   วันที่: ${firstDay.period}`);
      
      // แสดงชื่อแอดเซอร์ทั้งหมด
      const adserNames = Object.keys(firstDay).filter(key => 
        key !== 'period' && key !== 'date'
      );
      
      console.log(`   จำนวนแอดเซอร์: ${adserNames.length}`);
      console.log(`   รายชื่อแอดเซอร์: ${adserNames.slice(0, 5).join(', ')}${adserNames.length > 5 ? '...' : ''}`);
      
      // แสดงข้อมูลตัวอย่าง
      if (adserNames.length > 0) {
        const firstAdser = adserNames[0];
        const adserData = firstDay[firstAdser];
        console.log(`\n   ข้อมูล ${firstAdser}:`);
        console.log(`     CPM: ${adserData?.cpm || 0}`);
        console.log(`     ต้นทุนต่อเติม: ${adserData?.costPerDeposit || 0}`);
        console.log(`     ยอดเติม: ${adserData?.depositAmount || 0}`);
        console.log(`     $/Cover: ${adserData?.dollarPerCover || 0}`);
      }
      
      // ทดสอบวันที่ 2-3
      if (data.data.length > 1) {
        console.log(`\n📋 ข้อมูลวันที่ 2:`);
        const secondDay = data.data[1];
        const adserInSecondDay = Object.keys(secondDay).filter(key => 
          key !== 'period' && key !== 'date'
        );
        console.log(`   วันที่: ${secondDay.period}`);
        console.log(`   จำนวนแอดเซอร์: ${adserInSecondDay.length}`);
      }
    } else {
      console.log('❌ ไม่มีข้อมูลกราหสำหรับช่วงเวลานี้');
    }
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
  }
}

testChartsAPI();