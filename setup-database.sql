-- สร้างฐานข้อมูล
CREATE DATABASE IF NOT EXISTS admin_auth CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE admin_auth;

-- Prisma จะสร้างตารางให้อัตโนมัติ แต่ถ้าต้องการสร้างเอง ใช้ script นี้:

-- เพิ่ม Admin User (username: admin, password: admin123)
-- หมายเหตุ: รันคำสั่งนี้หลังจาก npx prisma db push เสร็จแล้ว
INSERT INTO User (id, username, password, role, teams, isLocked, createdAt, updatedAt)
VALUES (
  'admin-001',
  'admin',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5i4I3NqqMbzIi',
  'ADMIN',
  '[]',
  false,
  NOW(),
  NOW()
);

-- เพิ่ม User ตัวอย่างเพิ่มเติม (username: user1, password: user123)
INSERT INTO User (id, username, password, role, teams, isLocked, createdAt, updatedAt)
VALUES (
  'user-001',
  'user1',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'EMPLOYEE',
  '["ฝ่ายขาย","ฝ่ายการตลาด"]',
  false,
  NOW(),
  NOW()
);
