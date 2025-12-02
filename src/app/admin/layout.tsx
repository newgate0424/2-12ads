import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  // Check if user is admin
  if (session.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return <>{children}</>
}
