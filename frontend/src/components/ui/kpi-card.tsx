'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

interface KpiCardProps {
  value: string | number
  label: string
  delta?: number
  loading?: boolean
}

export default function KpiCard({ value, label, delta, loading }: KpiCardProps) {
  const isPositive = delta !== undefined && delta >= 0
  const isNegative = delta !== undefined && delta < 0

  return (
    <div className="card p-5">
      <p className="text-sm text-[var(--text-secondary)] mb-1.5">{label}</p>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 w-16 bg-[var(--border-dim)] rounded" />
        </div>
      ) : (
        <div className="flex items-end gap-2">
          <span className="text-2xl font-semibold text-[var(--text-primary)] font-mono tracking-tight">
            {value}
          </span>
          {delta !== undefined && (
            <span
              className={`flex items-center gap-0.5 text-xs font-mono mb-1 ${
                isPositive
                  ? 'text-[var(--diff-add-text)]'
                  : isNegative
                  ? 'text-[var(--diff-remove-text)]'
                  : ''
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(delta)}%
            </span>
          )}
        </div>
      )}
    </div>
  )
}
