'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { Plus, FileText, MoreHorizontal, ArrowUpDown, AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { Prompt } from '@/types'
import SearchInput from '@/components/ui/search-input'
import Badge from '@/components/ui/badge'
import EmptyState from '@/components/ui/empty-state'

export default function PromptsPage() {
  const { user, loading: authLoading } = useAuth()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && user) {
      fetchPrompts()
    }
  }, [authLoading, user])

  const fetchPrompts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getPrompts()

      if (response.error) {
        setError(response.error)
      } else if (response.data) {
        setPrompts(response.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prompts')
    } finally {
      setLoading(false)
    }
  }

  const timeAgo = (dateStr: string): string => {
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-amber)]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            My Prompts
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage your AI prompts and track version history
          </p>
        </div>
        <Link
          href="/prompts/new"
          className="btn btn-primary text-sm !py-2 !px-4 gap-2"
        >
          <Plus className="h-4 w-4" />
          New Prompt
        </Link>
      </div>

      {/* Toolbar: Search + Sort */}
      <div className="flex items-center gap-3">
        <SearchInput
          placeholder="Search prompts by title or content..."
          shortcut="⌘K"
        />
        <button className="flex items-center gap-2 border border-[var(--border-dim)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] px-3 py-2 rounded-[var(--radius-btn)] text-sm transition-all duration-150 bg-[var(--surface-panel)]">
          <ArrowUpDown className="h-4 w-4" />
          <span className="hidden sm:inline">Sort: Updated</span>
          <span className="sm:hidden">Sort</span>
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-[var(--error-bg)] border border-[var(--error-border)] rounded-[var(--radius-card)] p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-[var(--error)] shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--error)]">Error fetching prompts</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{error}</p>
            </div>
            <button
              onClick={fetchPrompts}
              className="flex items-center gap-1.5 text-xs text-[var(--accent-amber)] hover:text-[var(--accent-hover)] transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && !error && (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-[var(--radius-card)] border border-[var(--border-dim)] p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-[var(--border-dim)] rounded w-1/3 mb-2" />
                  <div className="h-3 bg-[var(--border-dim)] rounded w-1/4" />
                </div>
                <div className="h-5 w-14 bg-[var(--border-dim)] rounded-[var(--radius-btn)]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && prompts.length === 0 && (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="No prompts yet"
          description="Create your first prompt to start tracking versions and collaborating with your team."
          action={
            <Link
              href="/prompts/new"
              className="btn btn-primary text-sm !py-2.5 !px-5 gap-2"
            >
              <Plus className="h-4 w-4" />
              Create your first prompt
            </Link>
          }
        />
      )}

      {/* Prompts list */}
      {!loading && !error && prompts.length > 0 && (
        <div className="space-y-1 rounded-[var(--radius-card)] border border-[var(--border-dim)] overflow-hidden divide-y divide-[var(--border-dim)]">
          {prompts.map((prompt) => (
            <Link
              key={prompt.id}
              href={`/prompts/${prompt.id}`}
              className="flex items-center justify-between px-5 py-4 bg-[var(--bg-void)] hover:bg-[var(--surface-panel)] transition-colors group"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                {/* Icon */}
                <div className="w-9 h-9 rounded-[var(--radius-btn)] bg-[var(--accent-amber-dim)] flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-[var(--accent-amber)]" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--accent-amber)] transition-colors">
                      {prompt.title}
                    </h3>
                    <Badge text={`v${prompt.version_count}`} variant="amber" />
                  </div>
                  <p className="text-[11px] text-[var(--text-tertiary)] font-mono">
                    {prompt.description
                      ? `${prompt.description.slice(0, 60)}${prompt.description.length > 60 ? '...' : ''}`
                      : 'No description'}
                    <span className="mx-2">·</span>
                    {prompt.version_count} version{prompt.version_count !== 1 ? 's' : ''}
                    <span className="mx-2">·</span>
                    {timeAgo(prompt.updated_at)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // TODO: Open actions menu
                  }}
                  className="p-1.5 rounded-[var(--radius-btn)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Prompt count */}
      {!loading && !error && prompts.length > 0 && (
        <p className="text-xs text-[var(--text-tertiary)] font-mono text-center">
          {prompts.length} prompt{prompts.length !== 1 ? 's' : ''} total
        </p>
      )}
    </div>
  )
}
