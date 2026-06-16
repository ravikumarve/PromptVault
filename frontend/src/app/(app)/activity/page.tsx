'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { Prompt } from '@/types'
import { Activity, FileText, Plus, RefreshCw, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Badge from '@/components/ui/badge'
import EmptyState from '@/components/ui/empty-state'

interface ActivityEvent {
  id: string
  type: 'created' | 'updated'
  promptTitle: string
  promptId: number
  timestamp: string
  versionCount: number
}

export default function ActivityPage() {
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
      setError(err instanceof Error ? err.message : 'Failed to fetch activity')
    } finally {
      setLoading(false)
    }
  }

  // Build activity feed from prompts data
  const events: ActivityEvent[] = prompts.flatMap((p) => {
    const items: ActivityEvent[] = [
      {
        id: `created-${p.id}`,
        type: 'created',
        promptTitle: p.title,
        promptId: p.id,
        timestamp: p.created_at,
        versionCount: p.version_count,
      },
    ]

    // Only add an "updated" event if created_at differs from updated_at
    if (p.created_at !== p.updated_at) {
      items.push({
        id: `updated-${p.id}`,
        type: 'updated',
        promptTitle: p.title,
        promptId: p.id,
        timestamp: p.updated_at,
        versionCount: p.version_count,
      })
    }

    return items
  })

  // Sort newest first
  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Group by date
  const grouped = events.reduce<Record<string, ActivityEvent[]>>((acc, event) => {
    const dateKey = new Date(event.timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(event)
    return acc
  }, {})

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-amber)]" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            Activity
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Recent changes to your prompts
          </p>
        </div>
        <button
          onClick={fetchPrompts}
          className="btn btn-outline text-sm !py-2 !px-3 gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-[var(--error-bg)] border border-[var(--error-border)] rounded-[var(--radius-card)] p-3 text-sm text-[var(--error)] flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Empty state */}
      {!error && events.length === 0 && (
        <EmptyState
          icon={<Activity className="h-6 w-6" />}
          title="No activity yet"
          description="Your recent changes to prompts will appear here."
          action={
            <Link
              href="/prompts/new"
              className="btn btn-primary text-sm !py-2 !px-4 gap-2"
            >
              <Plus className="h-4 w-4" />
              Create your first prompt
            </Link>
          }
        />
      )}

      {/* Activity feed */}
      {events.length > 0 && (
        <div className="space-y-8">
          {Object.entries(grouped).map(([date, dateEvents]) => (
            <div key={date}>
              <h2 className="text-xs font-medium text-[var(--text-tertiary)] font-mono uppercase tracking-wider mb-4">
                {date}
              </h2>
              <div className="space-y-1 rounded-[var(--radius-card)] border border-[var(--border-dim)] overflow-hidden divide-y divide-[var(--border-dim)]">
                {dateEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/prompts/${event.promptId}`}
                    className="flex items-center gap-4 px-5 py-4 bg-[var(--bg-void)] hover:bg-[var(--surface-panel)] transition-colors group"
                  >
                    {/* Icon */}
                    <div
                      className={`w-9 h-9 rounded-[var(--radius-btn)] flex items-center justify-center shrink-0 ${
                        event.type === 'created'
                          ? 'bg-[var(--diff-add-bg)]'
                          : 'bg-[var(--accent-amber-dim)]'
                      }`}
                    >
                      {event.type === 'created' ? (
                        <Plus className="h-4 w-4 text-[var(--diff-add-text)]" />
                      ) : (
                        <FileText className="h-4 w-4 text-[var(--accent-amber)]" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-amber)] transition-colors">
                        <span className="font-medium">{event.promptTitle}</span>
                        <span className="text-[var(--text-secondary)] font-normal">
                          {' '}
                          {event.type === 'created' ? 'created' : 'updated'}
                        </span>
                      </p>
                      <p className="text-[11px] text-[var(--text-tertiary)] font-mono mt-0.5 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {formatTime(event.timestamp)}
                        <span className="mx-1">·</span>
                        v{event.versionCount}
                      </p>
                    </div>

                    {/* Badge */}
                    <Badge
                      text={event.type === 'created' ? 'Created' : 'Updated'}
                      variant={event.type === 'created' ? 'green' : 'amber'}
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {events.length > 0 && (
        <p className="text-xs text-[var(--text-tertiary)] font-mono text-center">
          {events.length} event{events.length !== 1 ? 's' : ''} ·{' '}
          {prompts.length} prompt{prompts.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
