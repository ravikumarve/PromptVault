'use client'

type BadgeVariant = 'amber' | 'green' | 'gray' | 'outline'

interface BadgeProps {
  text: string
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  amber:
    'bg-[var(--accent-amber-dim)] text-[var(--accent-amber)] border border-[rgba(245,158,11,0.2)]',
  green:
    'bg-[var(--diff-add-bg)] text-[var(--diff-add-text)] border border-[rgba(16,185,129,0.2)]',
  gray:
    'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-dim)]',
  outline:
    'bg-transparent text-[var(--text-secondary)] border border-[var(--border-dim)]',
}

export default function Badge({ text, variant = 'amber', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-medium rounded-[var(--radius-btn)] ${variantStyles[variant]} ${className}`}
    >
      {text}
    </span>
  )
}
