# 📅 วิธีตั้ง Cron Job สำหรับซิงค์ Google Sheets

## 🔗 API Endpoint สำหรับ Cron Job

**Local (Development):**
```
http://localhost:3000/api/sync/sheets
```

**Production (บนเซิร์ฟเวอร์):**
```
https://your-domain.com/api/sync/sheets
```

**API Key:**
```
sync-sheets
```

---

## 🪟 Windows Task Scheduler

### วิธีตั้งค่า:

1. **เปิด Task Scheduler:**
   - กด `Win + R`
   - พิมพ์ `taskschd.msc`
   - กด Enter

2. **สร้าง Task ใหม่:**
   - คลิก "Create Task..." (ด้านขวา)
   
3. **แท็บ General:**
   - Name: `Google Sheets Sync`
   - Description: `Sync data from Google Sheets every hour`
   - เลือก "Run whether user is logged on or not"
   - เลือก "Run with highest privileges"

4. **แท็บ Triggers:**
   - คลิก "New..."
   - Begin the task: `On a schedule`
   - Settings: `Daily`
   - Repeat task every: `1 hour` (หรือตามที่ต้องการ)
   - Duration: `Indefinitely`
   - คลิก OK

5. **แท็บ Actions:**
   - คลิก "New..."
   - Action: `Start a program`
   - Program/script: `powershell.exe`
   - Add arguments:
     ```
     -ExecutionPolicy Bypass -File "C:\Users\ADMINSER\Desktop\ads169th-system\sync-cron.ps1"
     ```
   - Start in: `C:\Users\ADMINSER\Desktop\ads169th-system`
   - คลิก OK

6. **แท็บ Conditions:**
   - ยกเลิกการเลือก "Start the task only if the computer is on AC power"

7. **แท็บ Settings:**
   - เลือก "Allow task to be run on demand"
   - เลือก "Run task as soon as possible after a scheduled start is missed"

8. **คลิก OK เพื่อบันทึก**

### ทดสอบ Task:
```powershell
# ใน Task Scheduler คลิกขวาที่ task แล้วเลือก "Run"
# หรือรันด้วยคำสั่ง:
schtasks /run /tn "Google Sheets Sync"
```

### ดู Log:
```powershell
Get-Content "C:\Users\ADMINSER\Desktop\ads169th-system\sync-logs.txt" -Tail 20
```

---

## 🐧 Linux / macOS Cron Job

### 1. สร้างสคริปต์ Bash:

**ไฟล์: `sync-cron.sh`**
```bash
#!/bin/bash

API_URL="http://localhost:3000/api/sync/sheets"
# หรือ: API_URL="https://your-domain.com/api/sync/sheets"

API_KEY="sync-sheets"
LOG_FILE="/path/to/sync-logs.txt"

echo "$(date '+%Y-%m-%d %H:%M:%S') - Starting sync..." >> "$LOG_FILE"

RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}')

if [ $? -eq 0 ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Success: $RESPONSE" >> "$LOG_FILE"
else
    echo "$(date '+%Y-%m-%d %H:%M:%S') - ERROR: Failed to sync" >> "$LOG_FILE"
fi
```

### 2. ให้สิทธิ์รัน:
```bash
chmod +x sync-cron.sh
```

### 3. แก้ไข Crontab:
```bash
crontab -e
```

### 4. เพิ่มบรรทัดนี้ (รันทุก 1 ชั่วโมง):
```cron
0 * * * * /path/to/sync-cron.sh
```

**ตัวอย่างเวลาอื่นๆ:**
```cron
# ทุก 30 นาที
*/30 * * * * /path/to/sync-cron.sh

# ทุกวันเวลา 02:00
0 2 * * * /path/to/sync-cron.sh

# ทุก 6 ชั่วโมง
0 */6 * * * /path/to/sync-cron.sh
```

### 5. ตรวจสอบ Cron Jobs:
```bash
crontab -l
```

---

## 🌐 Plesk Control Panel

ถ้าใช้ Plesk บนเซิร์ฟเวอร์:

1. **เข้า Plesk Control Panel**

2. **ไปที่ Tools & Settings → Scheduled Tasks**

3. **คลิก "Add Task":**
   - Task type: `Run a command`
   - Command:
     ```bash
     curl -X POST https://your-domain.com/api/sync/sheets \
       -H "x-api-key: sync-sheets" \
       -H "Content-Type: application/json" \
       -d '{}'
     ```
   - Schedule: `Custom`
   - Minute: `0`
   - Hour: `*` (ทุกชั่วโมง)
   - Day of Month: `*`
   - Month: `*`
   - Day of Week: `*`

4. **คลิก OK**

---

## 🔄 PM2 (สำหรับ Node.js)

ถ้าต้องการใช้ PM2 รัน scheduler:

### 1. สร้างไฟล์ `sync-scheduler.js`:
```javascript
const http = require('http');
const https = require('https');

const API_URL = 'http://localhost:3000/api/sync/sheets';
const API_KEY = 'sync-sheets';
const INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds

function syncData() {
  const url = new URL(API_URL);
  const client = url.protocol === 'https:' ? https : http;
  
  const options = {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json'
    }
  };
  
  console.log(`[${new Date().toISOString()}] Starting sync...`);
  
  const req = client.request(url, options, (res) => {
    let data = '';
    
    res.on('data', chunk => data += chunk);
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log(`[${new Date().toISOString()}] Sync completed:`, {
          totalRecords: result.results?.totalRecords,
          inserted: result.results?.totalInserted,
          updated: result.results?.totalUpdated
        });
      } catch (e) {
        console.error(`[${new Date().toISOString()}] Error parsing response:`, e.message);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error(`[${new Date().toISOString()}] Sync error:`, error.message);
  });
  
  req.write('{}');
  req.end();
}

// Run immediately on start
syncData();

// Then run on interval
setInterval(syncData, INTERVAL);

console.log(`Scheduler started. Will sync every ${INTERVAL / 1000 / 60} minutes.`);
```

### 2. เพิ่มใน `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'ads-system',
      script: 'server.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'sync-scheduler',
      script: 'sync-scheduler.js',
      instances: 1,
      cron_restart: '0 * * * *', // Restart every hour as backup
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

### 3. เริ่ม PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 📊 ตรวจสอบการทำงาน

### ดู Sync Logs (Windows):
```powershell
Get-Content "C:\Users\ADMINSER\Desktop\ads169th-system\sync-logs.txt" -Tail 50
```

### ดู Sync Logs (Linux):
```bash
tail -f /path/to/sync-logs.txt
```

### ตรวจสอบสถานะผ่าน API:
```powershell
# Windows PowerShell
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/sync/sheets" -Method GET -Headers @{"x-api-key"="sync-sheets"}
$response | ConvertTo-Json -Depth 5
```

```bash
# Linux / macOS
curl -X GET http://localhost:3000/api/sync/sheets \
  -H "x-api-key: sync-sheets" | jq
```

---

## ⚙️ แนะนำการตั้งค่า

| สถานการณ์ | ความถี่ที่แนะนำ |
|-----------|----------------|
| ข้อมูลอัปเดตบ่อย | ทุก 15-30 นาที |
| ข้อมูลอัปเดตปานกลาง | ทุก 1 ชั่วโมง |
| ข้อมูลอัปเดตน้อย | ทุก 6 ชั่วโมง หรือ 1 ครั้งต่อวัน |
| Development | Manual เท่านั้น |

---

## 🔍 Troubleshooting

### ปัญหา: Task ไม่รัน
**วิธีแก้:**
- ตรวจสอบว่าเซิร์ฟเวอร์ Node.js กำลังรันอยู่
- ตรวจสอบ API_URL ให้ถูกต้อง
- ตรวจสอบ API_KEY

### ปัญหา: ข้อมูลไม่อัปเดต
**วิธีแก้:**
- ตรวจสอบ logs: `sync-logs.txt`
- รัน manual test: `.\sync-cron.ps1`
- ตรวจสอบสิทธิ์ Google Sheets

### ปัญหา: Memory leak
**วิธีแก้:**
- ใช้ PM2 แทน cron
- ตั้งค่า `max_memory_restart` ใน PM2

---

## 🎯 สรุป

**API Endpoint:**
```
POST http://localhost:3000/api/sync/sheets
Header: x-api-key: sync-sheets
Body: {}
```

**ไฟล์สำหรับรัน Cron:**
- Windows: `sync-cron.ps1`
- Linux/macOS: `sync-cron.sh`
- PM2: `sync-scheduler.js`

**Log File:**
```
sync-logs.txt
```

ตั้งค่าได้แล้วครับ! 🚀
