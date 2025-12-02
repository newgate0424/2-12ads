'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { LoadingScreen } from '@/components/loading-screen'
import { SessionChecker } from '@/components/session-checker'
import { SidebarProvider, useSidebar } from '@/contexts/sidebar-context'
import { cn } from '@/lib/utils'

interface LayoutWrapperProps {
  children: React.ReactNode
}

function LayoutContent({ children, user }: { children: React.ReactNode; user: any }) {
  const { isCollapsed } = useSidebar()

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        user={{
          username: user.username,
          role: user.role,
          teams: user.teams || [],
        }}
      />

      {/* Main Content Area - adjusts based on sidebar state */}
      <div
        className={cn(
          'flex flex-col h-full transition-all duration-300',
          isCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        )}
      >
        {/* Header - Fixed */}
        <Header
          user={{
            username: user.username,
            role: user.role,
          }}
          sidebarCollapsed={isCollapsed}
        />

        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(false)

  // Check if current page is login
  const isLoginPage = pathname === '/login'

  useEffect(() => {
    // Fetch user data if not on login page
    if (!isLoginPage) {
      setIsCheckingAuth(true)
      fetchUser()
    } else {
      setIsLoading(false)
      setIsCheckingAuth(false)
    }
  }, [pathname, isLoginPage])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (data.user) {
        setUser(data.user)
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      setIsLoading(false)
    } finally {
      setIsCheckingAuth(false)
    }
  }

  // If login page, render children without layout
  if (isLoginPage) {
    return <>{children}</>
  }

  // If checking auth, show nothing to prevent flash
  if (isCheckingAuth) {
    return <LoadingScreen message="กำลังโหลด..." />
  }

  // If no user (not authenticated), render children (let page handle redirect)
  if (!user) {
    return <>{children}</>
  }

  // Render with Sidebar and Header wrapped in SidebarProvider
  return (
    <SidebarProvider>
      <SessionChecker />
      <LayoutContent user={user}>
        {children}
      </LayoutContent>
    </SidebarProvider>
  )
}
