# 🚀 Admin Authentication System

A complete, production-ready Next.js 14+ authentication system with role-based access control, multi-team management, and advanced security features.

## ✨ Features

- ✅ **Username/Password Authentication** (No email required)
- ✅ **MySQL Database** with Prisma ORM
- ✅ **Role-Based Access Control** (ADMIN, EMPLOYEE)
- ✅ **Multi-Team Assignment** (8 teams: HCA, HCB, HCC, HCD, HSA1, HSA2, HSB, HZA)
- ✅ **Session Enforcement** (1 user = 1 browser session)
- ✅ **Login Attempt Limiting** (5 attempts per 10 minutes)
- ✅ **Security Features** (bcrypt, JWT, CSRF protection, rate limiting)
- ✅ **Dark/Light Theme** with 20+ color presets
- ✅ **14 Font Families** including Thai fonts
- ✅ **Activity Logging** with detailed tracking
- ✅ **Responsive Design** for all devices
- ✅ **Loading Screens** and animations

## 📋 Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

## 🛠️ Installation

### 1. Install Dependencies

```powershell
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="mysql://username:password@localhost:3306/admin_auth"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SESSION_EXPIRY_DAYS=7
```

### 3. Setup Database

```powershell
# Generate Prisma Client
npx prisma generate

# Create database and run migrations
npx prisma db push

# (Optional) Seed initial admin user
npx prisma db seed
```

### 4. Create Initial Admin User (Manual)

Connect to your MySQL database and run:

```sql
INSERT INTO User (id, username, password, role, teams, isLocked, createdAt, updatedAt)
VALUES (
  'admin001',
  'admin',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5i4I3NqqMbzIi', -- password: admin123
  'ADMIN',
  '[]',
  false,
  NOW(),
  NOW()
);
```

Default credentials:
- Username: `admin`
- Password: `admin123`

**⚠️ IMPORTANT: Change this password after first login!**

### 5. Run Development Server

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── admin/         # Admin-only endpoints  
│   │   └── settings/      # User settings
│   ├── login/             # Login page
│   ├── dashboard/         # Dashboard pages
│   ├── admin/             # Admin pages
│   ├── settings/          # Settings page
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── sidebar.tsx        # Navigation sidebar
│   ├── header.tsx         # Top header
│   └── loading-screen.tsx # Loading component
├── lib/
│   ├── auth.ts            # Auth utilities
│   ├── prisma.ts          # Database client
│   └── utils.ts           # Helper functions
└── hooks/
    └── use-loading.tsx    # Loading hooks
```

## 🔐 Security Features

### Password Hashing
- bcrypt with salt rounds of 12
- Automatic password verification

### Session Management
- JWT tokens with 7-day expiration
- Single session per user (force logout on new login)
- Automatic session cleanup

### Login Protection
- Maximum 5 failed attempts per 10 minutes
- Account locking capability
- IP and user agent tracking

### Activity Logging
- All user actions logged
- IP address and user agent recorded
- Searchable and filterable logs

## 🎨 Customization

### Theme Colors
20+ pre-defined colors available:
- น้ำเงิน (Blue)
- เขียว (Green)
- แดง (Red)
- ส้ม (Orange)
- ม่วง (Purple)
- And 15 more...

### Font Families
14 fonts including Thai support:
- Inter, Roboto, Open Sans, Lato, Poppins, Montserrat
- Noto Sans Thai, Sarabun, Prompt, Kanit, IBM Plex Thai
- Charm, Mali, Mitr

### Font Sizes
- เล็ก (Small - 14px)
- ปานกลาง (Medium - 16px)
- ใหญ่ (Large - 18px)
- ใหญ่มาก (X-Large - 20px)
- กำหนดเอง (Custom)

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Admin (Requires ADMIN role)
- `GET /api/admin/users` - List users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users` - Update user
- `DELETE /api/admin/users?id={id}` - Delete user
- `GET /api/admin/sessions` - List sessions
- `DELETE /api/admin/sessions?id={id}` - Revoke session
- `GET /api/admin/activity-logs` - Get activity logs

### Settings
- `GET /api/settings` - Get user settings
- `POST /api/settings` - Update user settings

## 👥 User Management

### Creating Users
1. Login as admin
2. Navigate to "จัดการผู้ใช้" (User Management)
3. Click "เพิ่มผู้ใช้" (Add User)
4. Fill in details:
   - Username (3-50 characters)
   - Password (minimum 6 characters)
   - Role (ADMIN or EMPLOYEE)
   - Teams (optional, multiple selection)
5. Click "บันทึก" (Save)

### Teams
Available teams for assignment:
- HCA, HCB, HCC, HCD
- HSA1, HSA2, HSB
- HZA

## 🚀 Production Deployment

### 1. Build for Production

```powershell
npm run build
```

### 2. Environment Variables

Set these in your production environment:
- `DATABASE_URL` - Your production MySQL connection string
- `JWT_SECRET` - Strong random secret (use: `openssl rand -base64 32`)
- `NEXT_PUBLIC_APP_URL` - Your production URL
- `NODE_ENV=production`

### 3. Database Migration

```powershell
npx prisma migrate deploy
```

### 4. Start Production Server

```powershell
npm start
```

## 📊 Database Schema

### User
- id, username, password (hashed)
- role (ADMIN/EMPLOYEE)
- teams (JSON array)
- isLocked (boolean)

### Session
- Single active session per user
- Tracks IP and user agent
- Auto-expires after 7 days

### UserSettings
- Theme preferences
- Color customization
- Font settings

### ActivityLog
- Comprehensive action tracking
- Searchable and filterable

### LoginAttempt
- Failed login tracking
- Rate limiting enforcement

## 🐛 Troubleshooting

### Database Connection Issues
```powershell
# Test connection
npx prisma db pull

# Reset database (⚠️ WARNING: Deletes all data)
npx prisma migrate reset
```

### Session Issues
```powershell
# Clear expired sessions
# Run in MySQL
DELETE FROM Session WHERE expiresAt < NOW();
```

### Build Errors
```powershell
# Clean build
rm -rf .next
npm run build
```

## 📝 License

This project is for internal use only.

## 👨‍💻 Support

For issues or questions, contact your system administrator.

---

**Built with ❤️ using Next.js 14, Prisma, shadcn/ui, and Tailwind CSS**
