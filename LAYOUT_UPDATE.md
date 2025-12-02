# 📝 Layout Structure Update

## ✅ การเปลี่ยนแปลง

### Before (ก่อนแก้ไข)
- Sidebar และ Header อยู่แค่ใน `/dashboard` layout
- หน้าอื่นๆ ไม่มี Sidebar/Header

### After (หลังแก้ไข)
- ✅ **Sidebar และ Header จะปรากฏในทุกหน้า**
- ✅ **ยกเว้นหน้า Login** (ไม่มี Sidebar/Header)
- ✅ Auto-detect user และแสดงข้อมูลใน Sidebar/Header

---

## 🏗️ Structure ใหม่

```
src/
├── app/
│   ├── layout.tsx              # Root Layout (เพิ่ม LayoutWrapper)
│   ├── login/
│   │   └── page.tsx            # ❌ ไม่มี Sidebar/Header
│   ├── dashboard/
│   │   ├── layout.tsx          # ลบ Sidebar/Header ออก (ใช้จาก Root)
│   │   └── page.tsx            # ✅ มี Sidebar/Header
│   ├── admin/
│   │   ├── layout.tsx          # ตรวจสอบสิทธิ์ ADMIN
│   │   ├── users/
│   │   │   └── page.tsx        # ✅ มี Sidebar/Header
│   │   ├── sessions/
│   │   │   └── page.tsx        # ✅ มี Sidebar/Header
│   │   └── activity-logs/
│   │       └── page.tsx        # ✅ มี Sidebar/Header
│   └── settings/
│       ├── layout.tsx
│       └── page.tsx            # ✅ มี Sidebar/Header
└── components/
    ├── layout-wrapper.tsx      # 🆕 Component ใหม่
    ├── sidebar.tsx
    └── header.tsx
```

---

## 🔧 Components ที่เกี่ยวข้อง

### 1. LayoutWrapper (ใหม่)
**ไฟล์**: `src/components/layout-wrapper.tsx`

**หน้าที่**:
- ✅ ตรวจสอบว่าเป็นหน้า Login หรือไม่
- ✅ ถ้าเป็นหน้า Login → แสดงเฉพาะ children (ไม่มี Sidebar/Header)
- ✅ ถ้าไม่ใช่หน้า Login → ดึงข้อมูล user แล้วแสดง Sidebar/Header

**Logic**:
```typescript
const isLoginPage = pathname === '/login'

if (isLoginPage) {
  return <>{children}</>  // ไม่มี layout
}

// แสดง Sidebar + Header + children
return (
  <div>
    <Sidebar user={user} />
    <div className="lg:pl-64">
      <Header user={user} />
      <main>{children}</main>
    </div>
  </div>
)
```

### 2. Root Layout (อัพเดท)
**ไฟล์**: `src/app/layout.tsx`

**เพิ่ม**:
```typescript
import { LayoutWrapper } from "@/components/layout-wrapper"

// Wrap children ด้วย LayoutWrapper
<LayoutWrapper>
  {children}
</LayoutWrapper>
```

### 3. Dashboard Layout (ลดความซับซ้อน)
**ไฟล์**: `src/app/dashboard/layout.tsx`

**ลบออก**:
- ❌ Sidebar component
- ❌ Header component
- ❌ Layout structure

**เหลือเฉพาะ**:
- ✅ Session check (redirect ถ้าไม่ login)
- ✅ Return children โดยตรง

---

## 🎯 ผลลัพธ์

### หน้าที่มี Sidebar + Header:
- ✅ `/dashboard` - แดชบอร์ด
- ✅ `/admin/users` - จัดการผู้ใช้
- ✅ `/admin/sessions` - ผู้ใช้ออนไลน์
- ✅ `/admin/activity-logs` - บันทึกกิจกรรม
- ✅ `/settings` - ตั้งค่า
- ✅ **ทุกหน้าใหม่ที่จะสร้างในอนาคต**

### หน้าที่ไม่มี Sidebar + Header:
- ❌ `/login` - หน้า Login เท่านั้น

---

## 🚀 การทำงาน

### 1. User เข้าหน้า Login
```
User → /login
     ↓
LayoutWrapper detect → isLoginPage = true
     ↓
แสดงเฉพาะ LoginPage (ไม่มี Sidebar/Header)
```

### 2. User Login สำเร็จ → ไปหน้า Dashboard
```
User → /dashboard
     ↓
LayoutWrapper detect → isLoginPage = false
     ↓
Fetch /api/auth/me → get user data
     ↓
แสดง Sidebar + Header + DashboardPage
```

### 3. User คลิกเมนู จัดการผู้ใช้
```
User → /admin/users
     ↓
LayoutWrapper detect → isLoginPage = false
     ↓
ใช้ user data ที่มีอยู่แล้ว
     ↓
แสดง Sidebar + Header + UsersPage
```

---

## 💡 ข้อดี

### ✅ Consistency (ความสม่ำเสมอ)
- Sidebar และ Header จะเหมือนกันทุกหน้า
- User เห็น navigation เดิมตลอดเวลา

### ✅ Performance
- ดึงข้อมูล user แค่ครั้งเดียวตอน mount
- Re-use user data เมื่อเปลี่ยนหน้า
- ไม่ต้อง fetch ซ้ำๆ

### ✅ Maintainability (ง่ายต่อการดูแล)
- แก้ Sidebar/Header ที่เดียว → มีผลทุกหน้า
- ไม่ต้องคัดลอก layout ในทุก page

### ✅ Future-proof
- หน้าใหม่จะมี Sidebar/Header อัตโนมัติ
- ไม่ต้องเพิ่ม layout ซ้ำๆ

---

## 🔍 Debug

### ถ้า Sidebar/Header ไม่แสดง:

1. **เช็ค Console**:
   ```javascript
   // ใน LayoutWrapper
   console.log('pathname:', pathname)
   console.log('isLoginPage:', isLoginPage)
   console.log('user:', user)
   ```

2. **เช็ค Network**:
   - เปิด DevTools → Network
   - ดู request `/api/auth/me`
   - ควรได้ status 200 และมี user data

3. **เช็ค Cookie**:
   - เปิด DevTools → Application → Cookies
   - ควรมี cookie `session`

### ถ้า Sidebar/Header แสดงในหน้า Login:

1. **เช็ค pathname**:
   ```javascript
   console.log('pathname:', pathname) // ควรได้ '/login'
   ```

2. **เช็ค condition**:
   ```javascript
   const isLoginPage = pathname === '/login'
   console.log('isLoginPage:', isLoginPage) // ควรได้ true
   ```

---

## 📊 สรุป

| หน้า | Sidebar | Header | Navigation |
|------|---------|--------|------------|
| `/login` | ❌ | ❌ | ไม่มี |
| `/dashboard` | ✅ | ✅ | มี |
| `/admin/users` | ✅ | ✅ | มี |
| `/admin/sessions` | ✅ | ✅ | มี |
| `/admin/activity-logs` | ✅ | ✅ | มี |
| `/settings` | ✅ | ✅ | มี |
| **หน้าใหม่ทั้งหมด** | ✅ | ✅ | มี |

---

## ✅ เสร็จสมบูรณ์!

ตอนนี้ระบบมี:
- ✅ Sidebar และ Header ในทุกหน้า (ยกเว้น Login)
- ✅ Auto-detect user
- ✅ Responsive design
- ✅ Performance optimized
- ✅ Easy to maintain

**พร้อมใช้งาน 100%! 🎉**
