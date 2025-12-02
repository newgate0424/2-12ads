# 🚀 Quick Setup Guide

Follow these steps to get the admin authentication system running:

## Step 1: Install Dependencies

```powershell
npm install
```

This will install all required packages including:
- Next.js 14
- Prisma & MySQL client
- Authentication libraries (bcryptjs, jsonwebtoken)
- UI libraries (shadcn/ui, Radix UI, Tailwind CSS)
- And more...

## Step 2: Configure Database

1. Create a MySQL database:
```sql
CREATE DATABASE admin_auth CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Copy `.env.example` to `.env`:
```powershell
copy .env.example .env
```

3. Edit `.env` and update the DATABASE_URL:
```env
DATABASE_URL="mysql://root:password@localhost:3306/admin_auth"
JWT_SECRET="change-this-to-a-random-secret-key"
```

## Step 3: Setup Database Schema

```powershell
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
```

## Step 4: Create Admin User

Run this SQL in your MySQL database:

```sql
USE admin_auth;

INSERT INTO User (id, username, password, role, teams, isLocked, createdAt, updatedAt)
VALUES (
  'clnxxxxxxxxxx',
  'admin',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5i4I3NqqMbzIi',
  'ADMIN',
  '[]',
  false,
  NOW(),
  NOW()
);
```

Default Login:
- **Username**: admin
- **Password**: admin123

⚠️ **Change this password immediately after first login!**

## Step 5: Run Development Server

```powershell
npm run dev
```

Open http://localhost:3000 in your browser!

## Step 6: First Login

1. Navigate to http://localhost:3000
2. You'll be redirected to the login page
3. Login with:
   - Username: `admin`
   - Password: `admin123`
4. Go to Settings and change your password!

## 📋 Next Steps

After logging in, you can:

1. **Change Admin Password**
   - Go to Settings (⚙️ icon)
   - Change your password

2. **Create New Users**
   - Go to Admin → จัดการผู้ใช้ (User Management)
   - Click เพิ่มผู้ใช้ (Add User)
   - Fill in details and assign roles/teams

3. **Customize Theme**
   - Go to Settings
   - Choose from 20+ colors
   - Select Thai fonts
   - Adjust font size

4. **Monitor Activity**
   - Go to Admin → บันทึกกิจกรรม (Activity Logs)
   - View all user actions

5. **Manage Sessions**
   - Go to Admin → ผู้ใช้ออนไลน์ (Online Users)
   - Force logout if needed

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check if MySQL is running
- Verify DATABASE_URL in .env
- Test connection: `npx prisma db pull`

### "Module not found" errors
- Run `npm install` again
- Delete node_modules and run `npm install`

### TypeScript errors before npm install
- These are normal! Run `npm install` first
- Errors will disappear after dependencies are installed

### Build errors
- Clear Next.js cache: `rm -rf .next` or `rmdir /s .next`
- Rebuild: `npm run build`

## 📚 Documentation

See README.md for complete documentation including:
- Full feature list
- API documentation
- Security features
- Deployment guide

## 🎯 Production Deployment

For production deployment:

1. Set strong JWT_SECRET
2. Configure production DATABASE_URL
3. Run `npm run build`
4. Run `npm start`

See README.md for detailed production deployment steps.

---

**Need help? Check the full README.md or contact your system administrator.**
