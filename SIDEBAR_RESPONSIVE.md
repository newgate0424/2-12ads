# 🎯 Sidebar Responsive Content Update

## ✅ การเปลี่ยนแปลง

### Before (ก่อนแก้ไข)
- ❌ Sidebar collapse/expand ได้
- ❌ แต่ content ไม่ยืดขยายตาม
- ❌ Content width คงที่ (`lg:pl-64`)

### After (หลังแก้ไข)
- ✅ Sidebar collapse/expand ได้
- ✅ **Content ยืดขยายตาม sidebar**
- ✅ Content width ปรับตาม:
  - Collapsed: `lg:pl-16` (64px)
  - Expanded: `lg:pl-64` (256px)
- ✅ Animation smooth (transition-all duration-300)

---

## 🏗️ Architecture

### 1. Sidebar Context
**ไฟล์**: `src/contexts/sidebar-context.tsx`

**เหตุผล**: Share sidebar state ระหว่าง Sidebar component และ Layout

**State ที่ share**:
```typescript
{
  isCollapsed: boolean,        // Sidebar ยุบหรือขยาย
  setIsCollapsed: (boolean),   // ฟังก์ชันเปลี่ยนสถานะ
  isMobileOpen: boolean,       // Mobile menu เปิดหรือปิด
  setIsMobileOpen: (boolean)   // ฟังก์ชันเปลี่ยนสถานะ mobile
}
```

### 2. Sidebar Component Update
**ไฟล์**: `src/components/sidebar.tsx`

**เปลี่ยนแปลง**:
```diff
- import { useState } from 'react'
+ import { useSidebar } from '@/contexts/sidebar-context'

- const [isCollapsed, setIsCollapsed] = useState(false)
- const [isMobileOpen, setIsMobileOpen] = useState(false)
+ const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar()
```

**ผลลัพธ์**: Sidebar ใช้ state จาก Context แทน local state

### 3. Layout Wrapper Update
**ไฟล์**: `src/components/layout-wrapper.tsx`

**เพิ่ม**:
1. **SidebarProvider** - Wrap ทั้งหมดด้วย Provider
2. **LayoutContent** - Component ใหม่ที่อ่านค่า `isCollapsed`
3. **Dynamic className** - ปรับ padding-left ตาม sidebar state

**Code**:
```typescript
function LayoutContent({ children, user }) {
  const { isCollapsed } = useSidebar()  // อ่านสถานะจาก context

  return (
    <div>
      <Sidebar user={user} />
      
      {/* Content ปรับขนาดตาม isCollapsed */}
      <div className={cn(
        'transition-all duration-300',
        isCollapsed ? 'lg:pl-16' : 'lg:pl-64'  // 👈 Dynamic!
      )}>
        <Header user={user} sidebarCollapsed={isCollapsed} />
        <main>{children}</main>
      </div>
    </div>
  )
}
```

---

## 📊 Sidebar States

### Desktop View

#### State 1: Expanded (ขยาย)
```
┌─────────────────────┬────────────────────────────────┐
│                     │                                │
│   Sidebar           │    Content Area                │
│   width: 256px      │    margin-left: 256px          │
│   (w-64)            │    (lg:pl-64)                  │
│                     │                                │
│   - แดชบอร์ด       │    หน้า Dashboard             │
│   - จัดการผู้ใช้   │                                │
│   - ตั้งค่า        │                                │
│                     │                                │
└─────────────────────┴────────────────────────────────┘
```

#### State 2: Collapsed (ยุบ)
```
┌──────┬─────────────────────────────────────────────┐
│      │                                             │
│ Side │    Content Area                             │
│ bar  │    margin-left: 64px                        │
│ 64px │    (lg:pl-16)                               │
│(w-16)│                                             │
│      │    หน้า Dashboard                          │
│  🏠  │    (ขยายกว้างขึ้น 192px!)                  │
│  👥  │                                             │
│  ⚙️  │                                             │
│      │                                             │
└──────┴─────────────────────────────────────────────┘
```

### Mobile View
```
Sidebar ซ่อนอยู่ (Hamburger menu)

┌─────────────────────────────────────────────────┐
│  ☰  Header                                      │
├─────────────────────────────────────────────────┤
│                                                 │
│    Content Area                                 │
│    (Full width)                                 │
│                                                 │
└─────────────────────────────────────────────────┘

เมื่อกด ☰ → Sidebar slide in จากซ้าย
```

---

## 🎨 CSS Classes

### Content Area Classes

**Expanded**:
```css
lg:pl-64          /* padding-left: 16rem (256px) */
transition-all    /* animate all properties */
duration-300      /* 300ms animation */
```

**Collapsed**:
```css
lg:pl-16          /* padding-left: 4rem (64px) */
transition-all    /* animate all properties */
duration-300      /* 300ms animation */
```

**Result**: Content ขยาย/หดแบบ smooth

---

## ⚡ Performance

### Context Performance
- ✅ Context ใช้เฉพาะใน Layout level
- ✅ ไม่ re-render child pages
- ✅ เฉพาะ Sidebar และ Layout content ที่ update

### Animation Performance
- ✅ ใช้ CSS transition (GPU accelerated)
- ✅ Duration 300ms (fast and smooth)
- ✅ No JavaScript animation

---

## 🔧 การทำงาน

### Flow Chart
```
User กดปุ่ม Collapse
    ↓
Sidebar: setIsCollapsed(true)
    ↓
Context: isCollapsed = true
    ↓
LayoutContent: อ่าน isCollapsed
    ↓
Content div: className changes
    lg:pl-64 → lg:pl-16
    ↓
CSS Transition: animate 300ms
    ↓
Content ขยายกว้างขึ้น!
```

### Code Flow
```typescript
// 1. User clicks collapse button in Sidebar
<Button onClick={() => setIsCollapsed(!isCollapsed)}>
  <ChevronLeft />
</Button>

// 2. Context updates
const [isCollapsed, setIsCollapsed] = useState(false)

// 3. LayoutContent reads new value
const { isCollapsed } = useSidebar()

// 4. className updates
className={cn(
  'transition-all duration-300',
  isCollapsed ? 'lg:pl-16' : 'lg:pl-64'
)}

// 5. Browser animates padding-left change
// 256px → 64px (smooth transition)
```

---

## 📱 Responsive Behavior

### Desktop (lg and up)
- ✅ Sidebar fixed ด้านซ้าย
- ✅ Content ปรับ padding-left ตาม sidebar
- ✅ Collapse button ใช้งานได้

### Tablet/Mobile (< lg)
- ✅ Sidebar ซ่อนเป็น hamburger menu
- ✅ Content full width (no padding)
- ✅ Sidebar slide in เมื่อกด menu

---

## 🎯 Width Calculation

### Expanded State
```
Screen width: 1920px
Sidebar: 256px
Content: 1920px - 256px = 1664px
```

### Collapsed State
```
Screen width: 1920px
Sidebar: 64px
Content: 1920px - 64px = 1856px
                        ↑
                    +192px wider! 🎉
```

---

## 🧪 Testing

### Test Cases

1. **Desktop - Expand/Collapse**
   - ✅ คลิก collapse button
   - ✅ Sidebar ยุบลง (256px → 64px)
   - ✅ Content ขยายออก (smooth animation)
   - ✅ Text และ icons ใน sidebar ซ่อน/แสดง

2. **Desktop - Navigation**
   - ✅ คลิกเมนู → เปลี่ยนหน้า
   - ✅ Sidebar state คงที่ (collapsed/expanded)
   - ✅ Content width คงที่ตาม sidebar

3. **Mobile - Menu**
   - ✅ กด hamburger → Sidebar slide in
   - ✅ คลิกเมนู → ไปหน้าใหม่
   - ✅ Sidebar auto-close หลังเลือกเมนู

4. **Resize Window**
   - ✅ Desktop → Mobile: Sidebar เปลี่ยนเป็น drawer
   - ✅ Mobile → Desktop: Sidebar แสดงคงที่

---

## 🎨 Visual States

### Expanded
```
[==== Sidebar ====][========== Content ==========]
     256px                    Remaining
```

### Collapsed
```
[===][============ Content Expanded =============]
 64px              More space for content!
```

### Animation
```
Expanding:
[===] → [====] → [======] → [=========] → [==== Sidebar ====]
 64px    96px     128px      192px           256px

Content shrinks accordingly with smooth transition
```

---

## ✅ สรุป

### เปลี่ยนแปลง
- ✅ สร้าง Sidebar Context
- ✅ Share state ระหว่าง Sidebar และ Layout
- ✅ Content ปรับ padding-left ตาม sidebar state
- ✅ Animation smooth 300ms

### ผลลัพธ์
- ✅ Sidebar collapse → Content ขยาย (+192px)
- ✅ Sidebar expand → Content หด (-192px)
- ✅ Animation smooth ไม่กระตุก
- ✅ Responsive ทั้ง desktop และ mobile

### Performance
- ✅ ใช้ Context (efficient)
- ✅ CSS transition (GPU accelerated)
- ✅ No unnecessary re-renders

**พร้อมใช้งาน 100%! 🎉**
