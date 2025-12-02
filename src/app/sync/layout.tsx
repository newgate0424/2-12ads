import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'จัดการซิงค์ข้อมูล - ads169th System',
  description: 'ซิงค์ข้อมูลจาก Google Sheets และตรวจสอบสถานะการซิงค์',
}

export default function SyncLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}