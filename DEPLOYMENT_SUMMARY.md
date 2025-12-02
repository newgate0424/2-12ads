# 🚀 ads169th System - Plesk Deployment Ready!

## ✅ การเตรียมความพร้อม Deployment เสร็จสิ้น

### 📁 ไฟล์ที่สร้างสำหรับ Plesk Obsidian:

1. **`app.js`** - ไฟล์หลักสำหรับรัน application บน Plesk (เปลี่ยนจาก server.js)
2. **`.env.production`** - ตัวอย่าง environment variables สำหรับ production
3. **`PLESK_DEPLOYMENT.md`** - คู่มือการ deploy บน Plesk แบบละเอียด
4. **`ecosystem.config.js`** - PM2 configuration (เผื่อใช้)
5. **`healthcheck.js`** - Script ตรวจสอบสถานะ application

### 🔧 การปรับปรุงที่ทำ:

- ✅ อัปเดต `package.json` scripts ให้ใช้ `app.js`
- ✅ ปรับ `next.config.js` สำหรับ production optimization
- ✅ เพิ่ม security headers และ performance settings
- ✅ อัปเดต `.gitignore` สำหรับ deployment files

### 🌍 GitHub Repository พร้อมแล้ว:
**https://github.com/newgate0424/ads169th-system.git**

---

## 📋 ขั้นตอนการ Deploy บน Plesk Obsidian:

### 1. **Download จาก GitHub**
```bash
git clone https://github.com/newgate0424/ads169th-system.git
```

### 2. **Upload ไฟล์ไปยัง Plesk**
- อัปโหลดทุกไฟล์ไปที่ `httpdocs` folder
- หรือใช้ Git clone ใน Plesk terminal

### 3. **ตั้งค่า Node.js App ใน Plesk**
- **Application root:** `/httpdocs`
- **Application startup file:** `app.js` ⭐
- **Node.js version:** 18.x หรือสูงกว่า

### 4. **Environment Variables**
Copy `.env.production` เป็น `.env.local` และแก้ไข:
```env
NODE_ENV=production
DATABASE_URL="mysql://your_user:your_password@localhost:3306/your_database"
JWT_SECRET="your-secure-jwt-secret-at-least-32-characters"
```

### 5. **Install และ Build**
```bash
npm install --production
npm run build
```

### 6. **Setup Database**
```bash
npm run db:push
npm run db:seed
```

### 7. **Start Application**
```bash
npm start
```

---

## 🔍 ตรวจสอบการทำงาน:

### Health Check:
- เข้าไปที่: `https://yourdomain.com/health`
- ควรเห็น: `{"status":"ok","timestamp":"..."}`

### Login Test:
- **Admin:** admin / admin123
- **Employee:** employee / employee123

---

## 📁 โครงสร้างไฟล์สำคัญ:

```
ads169th-system/
├── app.js                    ← Startup file สำหรับ Plesk
├── package.json             ← Scripts และ dependencies
├── .env.production          ← Environment template
├── .env.local              ← Production config (สร้างเอง)
├── prisma/
│   ├── schema.prisma       ← Database schema
│   └── seed.js            ← Initial data
├── .next/                  ← Built application (หลัง npm run build)
└── src/                    ← Source code
```

---

## 🆘 แก้ปัญหา:

### ถ้า Application ไม่เริ่ม:
1. ตรวจสอบ Node.js version (ต้อง 18.x+)
2. ตรวจสอบ `app.js` exists
3. ดู error logs ใน Plesk

### ถ้าเชื่อมต่อ Database ไม่ได้:
1. ตรวจสอบ `DATABASE_URL` ใน `.env.local`
2. ตรวจสอบ database credentials ใน Plesk
3. รัน `npm run db:push` อีกครั้ง

### Performance Issues:
1. เพิ่ม memory limit ใน Plesk
2. ใช้ PM2 ecosystem config
3. Enable gzip compression

---

## 🎯 ฟีเจอร์ที่พร้อมใช้งาน:

- ✅ **Authentication System** - Login/Logout with sessions
- ✅ **User Management** - Admin และ Employee roles
- ✅ **Admin Panel** - จัดการผู้ใช้, sessions, activity logs
- ✅ **Settings** - Theme, language, profile management
- ✅ **Privacy & Terms** - หน้านโยบายความเป็นส่วนตัว
- ✅ **Multilingual** - ไทย/English support
- ✅ **Responsive Design** - Mobile-friendly
- ✅ **Dark/Light Theme** - Theme switching

---

**🎉 ads169th System พร้อม Deploy บน Plesk Obsidian แล้ว!**

สำหรับคำถามหรือปัญหา สามารถตรวจสอบ logs ใน Plesk หรือรัน healthcheck เพื่อดูสถานะ application