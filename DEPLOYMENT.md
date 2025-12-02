# ads169th System - Deployment Guide

## 📦 Deployment to Plesk Obsidian

### Prerequisites
- Plesk Obsidian with Node.js support
- MySQL Database
- Git access

### Step-by-Step Deployment

#### 1. เตรียม Database
1. สร้าง MySQL Database ใน Plesk
2. บันทึก:
   - Database name
   - Username
   - Password
   - Host (มักจะเป็น localhost)

#### 2. Clone Repository
```bash
cd /var/www/vhosts/yourdomain.com/httpdocs
git clone https://github.com/newgate0424/ads169th_System.git .
```

#### 3. ตั้งค่า Environment Variables
สร้างไฟล์ `.env`:
```bash
nano .env
```

เพิ่มข้อมูล:
```env
DATABASE_URL="mysql://db_user:db_password@localhost:3306/db_name"
JWT_SECRET="your-random-secret-key-minimum-32-characters-long"
SESSION_EXPIRY_DAYS=7
NODE_ENV="production"
```

#### 4. ติดตั้ง Dependencies
```bash
npm install
```

#### 5. Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Deploy Migrations
npx prisma migrate deploy

# Seed Data (ถ้ามี)
npx prisma db seed
```

#### 6. Build Application
```bash
npm run build
```

#### 7. ตั้งค่า Node.js Application ใน Plesk

1. ไปที่ **Websites & Domains** > **Node.js**
2. เลือก **Enable Node.js**
3. ตั้งค่า:
   - **Node.js version:** 18.x หรือใหม่กว่า
   - **Application mode:** Production
   - **Application startup file:** `server.js`
   - **Application root:** `/httpdocs` (หรือตามที่คุณใช้)
   - **Environment variables:** เพิ่ม variables จาก .env

4. กด **Restart App**

#### 8. ตั้งค่า Apache/Nginx (ถ้าจำเป็น)

สร้าง reverse proxy สำหรับ Node.js app:

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

**Nginx:**
```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

#### 9. ตั้งค่า SSL Certificate
1. ไปที่ **SSL/TLS Certificates**
2. ติดตั้ง Let's Encrypt หรือ SSL ที่คุณมี
3. บังคับใช้ HTTPS

#### 10. ทดสอบ
เข้าไปที่ `https://yourdomain.com` และตรวจสอบ:
- หน้า Login แสดงปกติ
- สามารถ Login ได้
- Database connection ทำงาน

---

## 🔄 Update Application

```bash
cd /var/www/vhosts/yourdomain.com/httpdocs

# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Rebuild
npm run build

# Restart via Plesk Panel
# หรือ
pm2 restart all
```

---

## 🐛 Troubleshooting

### Application ไม่เริ่มต้น
```bash
# ตรวจสอบ logs
tail -f /var/www/vhosts/yourdomain.com/logs/error_log

# ตรวจสอบ Node.js process
ps aux | grep node

# Kill และ restart
pkill -f node
# จากนั้น restart ผ่าน Plesk
```

### Database Connection Error
```bash
# ทดสอบ connection
npx prisma db pull

# ตรวจสอบ .env
cat .env

# ตรวจสอบ MySQL running
systemctl status mysql
```

### Permission Issues
```bash
# ตั้งค่า ownership
chown -R username:username /var/www/vhosts/yourdomain.com/httpdocs

# ตั้งค่า permissions
chmod -R 755 /var/www/vhosts/yourdomain.com/httpdocs
```

---

## 📊 Monitoring

### PM2 (แนะนำ)
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name "ads169th-system"

# Auto-restart on reboot
pm2 startup
pm2 save

# Monitor
pm2 monit

# Logs
pm2 logs
```

---

## 🔐 Security Checklist

- ✅ เปลี่ยนรหัสผ่าน admin เริ่มต้น
- ✅ ใช้ HTTPS (SSL Certificate)
- ✅ ตั้งค่า JWT_SECRET ที่แข็งแรง
- ✅ จำกัด Database access
- ✅ ตั้งค่า Firewall
- ✅ อัพเดท Node.js และ dependencies เป็นประจำ
- ✅ Backup database เป็นประจำ

---

## 📞 Support

ติดปัญหาการ deploy? สร้าง Issue ที่:
https://github.com/newgate0424/ads169th_System/issues
