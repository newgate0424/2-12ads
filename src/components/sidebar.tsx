'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Activity,
  Settings,
  Shield,
  UserCircle,
  Clock,
  Menu,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/contexts/sidebar-context'
import { Logo } from '@/components/logo'
import { useLanguage } from '@/contexts/language-context'

interface SidebarProps {
  user: {
    username: string
    role: string
    teams: string[]
  }
}

interface NavItem {
  title: string
  href: string
  icon: any
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  {
    title: 'nav.dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'จัดการซิงค์',
    href: '/sync',
    icon: RefreshCw,
  },
  {
    title: 'nav.users',
    href: '/admin/users',
    icon: Users,
    adminOnly: true,
  },
  {
    title: 'nav.sessions',
    href: '/admin/sessions',
    icon: UserCircle,
    adminOnly: true,
  },
  {
    title: 'nav.activity',
    href: '/admin/activity-logs',
    icon: Activity,
    adminOnly: true,
  },
  {
    title: 'nav.settings',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar()
  const { t } = useLanguage()

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || user.role === 'ADMIN'
  )

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-background border-r">
      {/* Header */}
      <div className="flex items-center justify-center py-6 px-4">
        <Logo collapsed={isCollapsed} />
      </div>

      {/* User Profile */}
      <div className={cn("px-6 pb-8", isCollapsed && "flex justify-center px-3")}>
        <div className={cn("flex items-center gap-3", isCollapsed && "flex-col gap-2")}>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <UserCircle className="w-5 h-5 text-primary" strokeWidth={1.5} />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-light truncate text-foreground">{user.username}</p>
              <p className="text-xs font-light text-foreground/40 mt-0.5">
                {user.role === 'ADMIN' ? t('user.role.admin') : t('user.role.staff')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 space-y-1 overflow-y-auto", isCollapsed ? "px-3" : "px-6")}>
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link 
              key={item.href} 
              href={item.href}
              prefetch={true}
            >
              <button
                className={cn(
                  'w-full flex items-center gap-4 px-4 py-3 text-sm font-light transition-colors rounded-lg',
                  'hover:bg-primary/10',
                  isCollapsed && 'justify-center px-0',
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-foreground/60'
                )}
                title={isCollapsed ? t(item.title) : undefined}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                {!isCollapsed && <span>{t(item.title)}</span>}
              </button>
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="fixed top-0 left-0 h-screen w-64 z-50 lg:hidden">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:block fixed top-0 left-0 h-screen transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
