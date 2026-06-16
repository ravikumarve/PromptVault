'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/sidebar'
import Topbar from '@/components/layout/topbar'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed')
    if (saved !== null) {
      setCollapsed(JSON.parse(saved))
    }

    // Listen for sidebar collapse changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sidebarCollapsed' && e.newValue !== null) {
        setCollapsed(JSON.parse(e.newValue))
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Poll local storage for sidebar changes (same-tab)
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem('sidebarCollapsed')
      if (saved !== null) {
        const parsed = JSON.parse(saved)
        if (parsed !== collapsed) {
          setCollapsed(parsed)
        }
      }
    }, 200)
    return () => clearInterval(interval)
  }, [collapsed])

  const sidebarWidth = collapsed ? 48 : 240

  return (
    <div className="min-h-screen bg-[var(--bg-void)]">
      <Sidebar />
      <div
        className="transition-all duration-300 ease-in-out flex flex-col min-h-screen"
        style={{ marginLeft: sidebarWidth }}
      >
        <Topbar breadcrumbs={[]} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
