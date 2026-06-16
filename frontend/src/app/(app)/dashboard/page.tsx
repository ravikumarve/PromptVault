'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { Plus, BookOpen, History, Clock, Activity, FileText, TrendingUp, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Prompt } from '@/types'
import KpiCard from '@/components/ui/kpi-card'
import Badge from '@/components/ui/badge'
import EmptyState from '@/components/ui/empty-state'
import Avatar from '@/components/ui/avatar'

export default function DashboardPage() {
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

  const totalVersions = prompts.reduce((sum, p) => sum + (p.version_count || 0), 0)

  const editedToday = prompts.filter((p) => {
    const updated = new Date(p.updated_at)
    const now = new Date()
    return (
      updated.getDate() === now.getDate() &&
      updated.getMonth() === now.getMonth() &&
      updated.getFullYear() === now.getFullYear()
    )
  }).length

  const recentPrompts = [...prompts]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)

  const recentActivity = [...prompts]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            Dashboard
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Welcome back, {user?.name || 'there'}
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

      {/* Error state */}
      {error && (
        <div className="bg-[var(--error-bg)] border border-[var(--error-border)] rounded-[var(--radius-card)] p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-[var(--error)] shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--error)]">Error fetching data</p>
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

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          value={prompts.length}
          label="Total Prompts"
          loading={loading}
        />
        <KpiCard
          value={totalVersions}
          label="Total Versions"
          loading={loading}
        />
        <KpiCard
          value={editedToday}
          label="Edited Today"
          loading={loading}
          delta={editedToday > 0 ? 100 : undefined}
        />
        <KpiCard
          value={prompts.length > 0 ? '--' : '--'}
          label="Success Rate"
          loading={loading}
        />
      </div>

      {/* Main content area */}
      <div className="bento-grid">
        {/* Recent Prompts - col-span-8 */}
        <div className="bento-cell col-span-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <FileText className="h-4 w-4 text-[var(--accent-amber)]" />
              Recent Prompts
            </h2>
            {prompts.length > 0 && (
              <Link
                href="/prompts"
                className="text-xs text-[var(--accent-amber)] hover:text-[var(--accent-hover)] flex items-center gap-1 transition-colors"
              >
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-[var(--border-dim)] rounded-[var(--radius-btn)]" />
                </div>
              ))}
            </div>
          ) : recentPrompts.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="h-6 w-6" />}
              title="No prompts yet"
              description="Create your first prompt to start tracking versions and see it here."
              action={
                <Link
                  href="/prompts/new"
                  className="btn btn-primary text-sm !py-2 !px-4 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Prompt
                </Link>
              }
            />
          ) : (
            <div className="space-y-2">
              {recentPrompts.map((prompt) => (
                <Link
                  key={prompt.id}
                  href={`/prompts/${prompt.id}`}
                  className="flex items-center justify-between py-3 px-3 rounded-[var(--radius-btn)] hover:bg-[var(--surface-panel)] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-[var(--radius-btn)] bg-[var(--accent-amber-dim)] flex items-center justify-center shrink-0">
                      <FileText className="h-3.5 w-3.5 text-[var(--accent-amber)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--accent-amber)] transition-colors">
                        {prompt.title}
                      </p>
                      <p className="text-[11px] text-[var(--text-tertiary)] font-mono mt-0.5">
                        {new Date(prompt.updated_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge text={`v${prompt.version_count}`} variant="amber" />
                    <ChevronRight className="h-3.5 w-3.5 text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed - col-span-4 */}
        <div className="bento-cell col-span-4">
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2">
            <Activity className="h-4 w-4 text-[var(--accent-amber)]" />
            Activity
          </h2>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex gap-3">
                  <div className="w-2 h-2 bg-[var(--border-dim)] rounded-full mt-1" />
                  <div className="flex-1">
                    <div className="h-3 bg-[var(--border-dim)] rounded w-3/4 mb-1" />
                    <div className="h-2 bg-[var(--border-dim)] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <EmptyState
              icon={<Clock className="h-6 w-6" />}
              title="No activity yet"
              description="Your recent changes will appear here."
            />
          ) : (
            <div className="space-y-4">
              {recentActivity.map((prompt) => (
                <Link
                  key={prompt.id}
                  href={`/prompts/${prompt.id}`}
                  className="flex items-start gap-3 group"
                >
                  <div className="w-2 h-2 bg-[var(--accent-amber)] rounded-full mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-amber)] transition-colors">
                      <span className="font-medium">{prompt.title}</span>
                    </p>
                    <p className="text-[11px] text-[var(--text-tertiary)] font-mono mt-0.5">
                      {new Date(prompt.updated_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Version Activity Chart Placeholder - col-span-12 */}
        <div className="bento-cell col-span-12">
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[var(--accent-amber)]" />
            Version Activity
          </h2>
          <div className="h-48 rounded-[var(--radius-card)] bg-[var(--surface-panel)] border border-[var(--border-dim)] flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-[var(--text-tertiary)] mx-auto mb-2" />
              <p className="text-sm text-[var(--text-tertiary)]">Version activity chart coming soon</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">Track version creation over time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
