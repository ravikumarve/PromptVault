'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import SearchInput from '@/components/ui/search-input'
import Avatar from '@/components/ui/avatar'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface TopbarProps {
  breadcrumbs?: BreadcrumbItem[]
}

export default function Topbar({ breadcrumbs = [] }: TopbarProps) {
  const { user } = useAuth()

  return (
    <header className="h-14 border-b border-[var(--border-dim)] bg-[var(--bg-void)] px-6 flex items-center justify-between shrink-0">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-sm min-w-0">
        {breadcrumbs.length === 0 ? (
          <span className="text-[var(--text-primary)] font-medium">PromptVault</span>
        ) : (
          breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1
            return (
              <span key={index} className="flex items-center gap-1.5 min-w-0">
                {index > 0 && (
                  <span className="text-[var(--text-tertiary)] text-xs">/</span>
                )}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors truncate"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={`truncate ${
                      isLast
                        ? 'text-[var(--text-primary)] font-mono font-medium'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </span>
            )
          })
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <SearchInput
          placeholder="Search prompts..."
          shortcut="⌘K"
          className="w-[260px]"
        />

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-medium text-[var(--text-primary)]">{user.name}</span>
              <span className="text-[10px] text-[var(--text-tertiary)]">{user.email}</span>
            </div>
          )}
          {user && <Avatar name={user.name} size="sm" />}
        </div>
      </div>
    </header>
  )
}
