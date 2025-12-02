# Google Sheets Sync System

ระบบซิงค์ข้อมูลจาก Google Sheets ไปยัง MySQL Database

## การตั้งค่า

### 1. ตั้งค่า Google Service Account

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้างโปรเจกต์ใหม่หรือเลือกโปรเจกต์ที่มีอยู่
3. เปิดใช้งาน Google Sheets API
4. สร้าง Service Account:
   - ไปที่ IAM & Admin > Service Accounts
   - คลิก "Create Service Account"
   - ตั้งชื่อและคลิก "Create"
   - ไม่ต้องให้สิทธิ์พิเศษ คลิก "Continue" และ "Done"
5. สร้าง Private Key:
   - คลิกที่ Service Account ที่สร้าง
   - ไปที่แท็บ "Keys"
   - คลิก "Add Key" > "Create new key"
   - เลือก JSON format
   - ดาวน์โหลดไฟล์ JSON

### 2. แชร์ Google Sheet

แชร์ Google Sheet กับ Service Account Email (จากไฟล์ JSON):
```
thailand-sh0424@sa-ads.iam.gserviceaccount.com
```

สิทธิ์: **Viewer** (อ่านอย่างเดียว)

### 3. ตั้งค่า Environment Variables

ใน `.env` เพิ่มค่าต่อไปนี้:

```env
GOOGLE_CLIENT_EMAIL="thailand-sh0424@sa-ads.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
GOOGLE_SHEET_ID="1Q8aPPsro7_7aqWNs13kPa3OgFp7qDRmlnXY7ve3B9hw"
SYNC_API_KEY="sync-sheets"
```

**หมายเหตุ:** 
- `GOOGLE_PRIVATE_KEY` คือ private_key จากไฟล์ JSON (เก็บ \n ไว้)
- `GOOGLE_SHEET_ID` คือ ID จาก URL ของ Google Sheet

## โครงสร้างชีต

### ชีตที่ต้องซิงค์

1. สาวอ้อย
2. อลิน
3. อัญญาC
4. อัญญาD
5. สเปชบาร์
6. บาล้าน
7. ฟุตบอลแอร์เรีย

### คอลัมน์ที่ต้องมี (28 คอลัมน์)

แถวแรกต้องเป็น Header:
```
team, B, adser, date, message, message_meta, lost_messages, net_messages, plan_spend, spend, plan_message, L, deposit, N, turnover_adser, P, turnover, cover, page_blocks7days, page_blocks30days, Silent, duplicate, has_user, spam, blocked, under_18, over_50, foreign
```

## การใช้งาน API

### 1. ซิงค์ข้อมูล (POST)

```bash
curl -X POST http://localhost:3000/api/sync/sheets \
  -H "x-api-key: sync-sheets" \
  -H "Content-Type: application/json" \
  -d '{}'
```

ซิงค์เฉพาะชีตที่ต้องการ:
```bash
curl -X POST http://localhost:3000/api/sync/sheets \
  -H "x-api-key: sync-sheets" \
  -H "Content-Type: application/json" \
  -d '{"sheets": ["สาวอ้อย", "อลิน"]}'
```

Response:
```json
{
  "message": "Sync completed",
  "results": {
    "success": [
      {
        "sheet": "สาวอ้อย",
        "records": 150
      }
    ],
    "failed": [],
    "totalRecords": 150,
    "totalInserted": 100,
    "totalUpdated": 50
  }
}
```

### 2. ตรวจสอบสถานะ (GET)

```bash
curl -X GET http://localhost:3000/api/sync/sheets \
  -H "x-api-key: sync-sheets"
```

Response:
```json
{
  "stats": [
    {
      "sheet": "สาวอ้อย",
      "recordCount": 150,
      "lastUpdated": "2025-11-09T10:30:00.000Z"
    }
  ],
  "totalRecords": 1050
}
```

## Database Schema

ตาราง `SyncData`:
- `team` - ชื่อทีม
- `adser` - ชื่อแอดเซอร์
- `date` - วันที่
- `message` - จำนวนข้อความ
- `spend` - ค่าใช้จ่าย
- `deposit` - ยอดเติม
- `cover` - ค่า Cover
- ... และอื่นๆ (ดูใน `prisma/schema.prisma`)

Unique constraint: `team` + `adser` + `date` + `sheetName`

## Automation

### ตั้ง Cron Job สำหรับซิงค์อัตโนมัติ

Linux/Mac (crontab):
```bash
# ซิงค์ทุกชั่วโมง
0 * * * * curl -X POST http://localhost:3000/api/sync/sheets -H "x-api-key: sync-sheets"
```

Windows (Task Scheduler):
```powershell
# PowerShell script
Invoke-WebRequest -Uri "http://localhost:3000/api/sync/sheets" `
  -Method POST `
  -Headers @{"x-api-key"="sync-sheets"}
```

## Troubleshooting

### Error: "Missing Google Sheets credentials"
- ตรวจสอบว่า `.env` มีค่า `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`
- ตรวจสอบว่า private key มี `\n` ตามที่ควรจะเป็น

### Error: "Unauthorized"
- ตรวจสอบว่าส่ง header `x-api-key` ที่ถูกต้อง
- ตรวจสอบค่า `SYNC_API_KEY` ใน `.env`

### Error: "No data found"
- ตรวจสอบว่าชีตมีข้อมูล
- ตรวจสอบว่าแถวแรกเป็น header
- ตรวจสอบว่าแชร์ชีตให้ Service Account แล้ว

### Error: "The caller does not have permission"
- ตรวจสอบว่าได้แชร์ Google Sheet ให้ Service Account Email แล้ว
- ตรวจสอบว่า Service Account มีสิทธิ์อย่างน้อย Viewer
