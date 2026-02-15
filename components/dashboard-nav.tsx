'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, OrganizationSwitcher } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Box,
  Key,
  BarChart3,
  MessageSquare,
  CreditCard,
  Settings,
  Menu,
  X,
  Sparkles
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Models', href: '/dashboard/models', icon: Box },
  { name: 'API Keys', href: '/dashboard/api-keys', icon: Key },
  { name: 'API Providers', href: '/dashboard/api-providers', icon: Sparkles },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Playground', href: '/dashboard/playground', icon: MessageSquare },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b h-16 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <div className="ml-4 flex items-center space-x-2">
          <Box className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">AI Platform</span>
        </div>
        <div className="ml-auto">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-card border-r transition-transform duration-300 lg:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Box className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">AI Platform</span>
            </Link>
          </div>

          {/* Organization Switcher */}
          <div className="px-4 py-4 border-b">
            <OrganizationSwitcher
              afterCreateOrganizationUrl="/dashboard"
              afterLeaveOrganizationUrl="/select-org"
              afterSelectOrganizationUrl="/dashboard"
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <UserButton afterSignOutUrl="/" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Account</p>
                <p className="text-xs text-muted-foreground truncate">Manage profile</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
