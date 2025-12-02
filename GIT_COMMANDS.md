# คำสั่งสำหรับ Push โปรเจคขึ้น GitHub

## 1. Initial Setup (ครั้งแรก)

```bash
# เข้าไปที่โฟลเดอร์โปรเจค
cd c:\Users\user\Desktop\admin

# Initialize Git (ถ้ายังไม่ได้ทำ)
git init

# Add remote repository
git remote add origin https://github.com/newgate0424/ads169th_System.git

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: ads169th System"

# Push to GitHub
git push -u origin main
```

## 2. การอัพเดทครั้งถัดไป

```bash
# เช็คสถานะไฟล์
git status

# Add ไฟล์ที่แก้ไข
git add .

# หรือ add ไฟล์เฉพาะ
git add src/components/header.tsx
git add src/components/sidebar.tsx

# Commit พร้อมข้อความ
git commit -m "Update: ปรับปรุง UI และ UX"

# Push ขึ้น GitHub
git push origin main
```

## 3. ตัวอย่าง Commit Messages

```bash
# Feature ใหม่
git commit -m "feat: เพิ่มระบบ force logout users"

# แก้ไข Bug
git commit -m "fix: แก้ไขปัญหา sidebar ไม่เก็บสถานะ"

# ปรับปรุง UI
git commit -m "style: ปรับแต่ง header และ dropdown menu"

# Refactor Code
git commit -m "refactor: ปรับปรุงโครงสร้างโค้ด sidebar"

# Documentation
git commit -m "docs: เพิ่มคู่มือการติดตั้งและ deploy"
```

## 4. Pull ก่อน Push (ถ้ามีคนแก้ไขพร้อมกัน)

```bash
# Pull ล่าสุดจาก GitHub
git pull origin main

# จากนั้นค่อย Push
git push origin main
```

## 5. ดู History

```bash
# ดู commit history
git log

# ดูแบบสั้น
git log --oneline

# ดูไฟล์ที่เปลี่ยนแปลง
git diff
```

## 6. Undo Changes

```bash
# Undo ไฟล์ที่ยังไม่ได้ add
git checkout -- filename

# Undo ไฟล์ที่ add แล้ว
git reset HEAD filename

# Undo commit ล่าสุด (แต่เก็บการแก้ไข)
git reset --soft HEAD~1

# Undo commit ล่าสุด (ลบการแก้ไขด้วย)
git reset --hard HEAD~1
```

## 7. Create New Branch (สำหรับพัฒนาฟีเจอร์ใหม่)

```bash
# สร้าง branch ใหม่
git checkout -b feature/new-feature

# Push branch ใหม่
git push -u origin feature/new-feature

# กลับไป main branch
git checkout main

# Merge branch
git merge feature/new-feature
```

## 📝 หมายเหตุ

- ก่อน push ครั้งแรก ต้องสร้าง repository ใน GitHub ก่อน
- URL: https://github.com/newgate0424/ads169th_System.git
- ไม่ควร commit ไฟล์ `.env` (มีใน .gitignore แล้ว)
- แนะนำให้ commit บ่อยๆ และเขียน message ให้ชัดเจน
