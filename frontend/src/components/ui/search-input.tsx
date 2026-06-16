'use client'

import { Search } from 'lucide-react'

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  shortcut?: string
  className?: string
}

export default function SearchInput({
  placeholder = 'Search prompts...',
  value = '',
  onChange,
  shortcut = '⌘K',
  className = '',
}: SearchInputProps) {
  return (
    <div className={`relative flex-1 ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-[var(--bg-subtle)] border border-[var(--border-dim)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] rounded-[var(--radius-btn)] pl-10 pr-16 py-2 text-sm font-mono focus:outline-none focus:border-[var(--accent-amber)] focus:ring-2 focus:ring-[var(--accent-amber-dim)] transition-all duration-150"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-[var(--text-tertiary)] bg-[var(--bg-elevated)] border border-[var(--border-dim)] rounded px-1.5 py-0.5">
        {shortcut}
      </span>
    </div>
  )
}
