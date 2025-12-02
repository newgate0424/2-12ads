# Plesk Obsidian Deployment Guide for ads169th System

## 🚀 Quick Deployment Steps

### 1. Upload Files to Plesk
1. Upload all project files to your domain's document root (usually `httpdocs` folder)
2. Make sure to include the `.next` folder after building

### 2. Environment Setup
1. Copy `.env.production` to `.env.local`
2. Update database credentials in `.env.local`:
   ```
   DATABASE_URL="mysql://your_db_user:your_db_password@localhost:3306/your_db_name"
   JWT_SECRET="your-secure-jwt-secret-at-least-32-characters-long"
   ```

### 3. Install Dependencies
Run in Plesk Node.js terminal:
```bash
npm install --production
```

### 4. Build Application
```bash
npm run build
```

### 5. Setup Database
```bash
npm run db:push
npm run db:seed
```

### 6. Start Application
For Plesk Node.js app, set:
- **Startup file:** `app.js`
- **Environment:** production
- **Node.js version:** 18.x or higher

Or run manually:
```bash
npm start
```

## 🔧 Plesk Configuration

### Node.js App Settings
- **Application root:** `/httpdocs`
- **Application startup file:** `app.js`
- **Custom environment variables:**
  ```
  NODE_ENV=production
  PORT=3000
  ```

### Database Setup (if not exists)
1. Create MySQL database in Plesk
2. Create database user with full privileges
3. Update DATABASE_URL in .env.local

### SSL Certificate
1. Enable SSL in Plesk for your domain
2. Update NEXT_PUBLIC_BASE_URL in .env.local

## 📁 Required Files for Deployment
```
app.js                  ← Main server file (startup file)
package.json           ← Dependencies and scripts
.env.local            ← Production environment variables
.next/                ← Built Next.js application
prisma/               ← Database schema and seed
src/                  ← Application source code
public/               ← Static assets
```

## 🔍 Troubleshooting

### Check Application Status
Visit: `https://yourdomain.com/health`

### Common Issues
1. **Database connection failed**
   - Check DATABASE_URL in .env.local
   - Verify database credentials in Plesk

2. **Application won't start**
   - Check Node.js version (18.x+)
   - Verify app.js exists
   - Check error logs in Plesk

3. **Build failed**
   - Run `npm install` first
   - Check available disk space
   - Review build logs

### Default Login Credentials
- **Admin:** admin / admin123
- **Employee:** employee / employee123

## 📞 Support
If you encounter issues, check the Plesk error logs or contact your hosting provider.

---
🎉 **ads169th System** - Ready for production deployment!