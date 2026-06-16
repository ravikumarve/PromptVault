'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutGrid,
  FileText,
  Plus,
  Clock,
  Settings,
  ChevronLeft,
  ChevronRight,
  Vault,
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { name: 'My Prompts', href: '/prompts', icon: FileText },
  { name: 'Create Prompt', href: '/prompts/new', icon: Plus },
  { name: 'Recent Activity', href: '/activity', icon: Clock },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  // Restore collapsed state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed')
    if (saved !== null) {
      setCollapsed(JSON.parse(saved))
    }
  }, [])

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('sidebarCollapsed', JSON.stringify(next))
      return next
    })
  }

  const sidebarWidth = collapsed ? 'w-[48px]' : 'w-[240px]'

  return (
    <aside
      className={`${sidebarWidth} h-screen fixed left-0 top-0 z-50 flex flex-col bg-[var(--surface-panel)] border-r border-[var(--border-dim)] transition-all duration-300 ease-in-out`}
    >
      {/* Logo */}
      <div
        className={`flex items-center h-14 border-b border-[var(--border-dim)] ${
          collapsed ? 'justify-center px-0' : 'px-4 gap-3'
        }`}
      >
        {collapsed ? (
          <Vault className="h-5 w-5 text-[var(--accent-amber)] shrink-0" />
        ) : (
          <>
            <div className="w-5 h-5 border-2 border-[var(--accent-amber)] rounded-sm relative shrink-0">
              <div className="absolute top-1 left-1 w-2 h-2 bg-[var(--text-primary)]" />
            </div>
            <span className="font-semibold text-sm text-[var(--text-primary)] tracking-tight">
              PromptVault
            </span>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={`flex items-center gap-3 rounded-[var(--radius-btn)] text-sm transition-all duration-150 ${
                collapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 py-2.5'
              } ${
                isActive
                  ? 'text-[var(--accent-amber)] bg-[var(--accent-amber-dim)] font-medium'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      {!collapsed && <div className="mx-4 border-t border-[var(--border-dim)]" />}

      {/* Collapse toggle */}
      <div className={`p-2 ${collapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={toggleCollapse}
          className="flex items-center gap-3 rounded-[var(--radius-btn)] text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all duration-150 w-full"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <div className={`flex items-center ${collapsed ? 'justify-center w-10 h-10' : 'px-3 py-2.5 w-full'}`}>
            {collapsed ? (
              <ChevronRight className="h-4 w-4 shrink-0" />
            ) : (
              <div className="flex items-center gap-3">
                <ChevronLeft className="h-4 w-4 shrink-0" />
                <span>Collapse</span>
              </div>
            )}
          </div>
        </button>
      </div>
    </aside>
  )
}
