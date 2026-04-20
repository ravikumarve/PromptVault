'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { Plus, BookOpen, History, Tag, AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { Prompt } from '@/types'

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

  const getUniqueTagsCount = () => {
    // Placeholder - tags would come from a separate API endpoint
    // For now, we'll assume some prompts have tags
    const tagCount = prompts.length > 0 ? Math.min(prompts.length, 5) : 0
    return tagCount
  }

  const getTotalVersions = () => {
    return prompts.reduce((sum, p) => sum + (p.version_count || 0), 0)
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-[var(--text-secondary)] mt-2">
          Manage your AI prompts and track versions with ease.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--accent-muted)] rounded-md">
              <BookOpen className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Total Prompts</p>
              {loading ? (
                <div className="animate-pulse bg-[var(--bg-subtle)] rounded h-7 w-12"></div>
              ) : (
                <p className="text-2xl font-semibold text-[var(--text-primary)] font-mono">
                  {prompts.length}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--accent-muted)] rounded-md">
              <History className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Total Versions</p>
              {loading ? (
                <div className="animate-pulse bg-[var(--bg-subtle)] rounded h-7 w-12"></div>
              ) : (
                <p className="text-2xl font-semibold text-[var(--text-primary)] font-mono">
                  {getTotalVersions()}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--accent-muted)] rounded-md">
              <Tag className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Unique Tags</p>
              {loading ? (
                <div className="animate-pulse bg-[var(--bg-subtle)] rounded h-7 w-12"></div>
              ) : (
                <p className="text-2xl font-semibold text-[var(--text-primary)] font-mono">
                  {getUniqueTagsCount()}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--accent-muted)] rounded-md">
              <Plus className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Ready to create</p>
              <p className="text-2xl font-semibold text-[var(--text-primary)] font-mono">
                —
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-[var(--error-bg)] border border-[var(--error-border)] rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-[var(--error)]" />
            <div>
              <p className="text-sm font-medium text-[var(--error)]">Error fetching data</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{error}</p>
            </div>
            <button
              onClick={fetchPrompts}
              className="ml-auto flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && !error && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-12 text-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)] mb-4"></div>
            <p className="text-[var(--text-secondary)]">Loading your prompts...</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && prompts.length === 0 && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-[var(--accent-muted)] rounded-full flex items-center justify-center mb-6">
            <BookOpen className="h-8 w-8 text-[var(--accent)]" />
          </div>
          
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            No prompts yet
          </h2>
          
          <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
            Get started by creating your first prompt. Track versions, add tags, and manage your AI prompts like code.
          </p>
          
          <Link
            href="/prompts/new"
            className="inline-flex items-center gap-2 bg-[var(--accent)] text-[#09090B] font-medium text-sm px-6 py-3 rounded-md hover:bg-[var(--accent-hover)] hover:shadow-[0_0_16px_rgba(245,158,11,0.4)] transition-all duration-150"
          >
            <Plus className="h-4 w-4" />
            Create your first prompt
          </Link>
        </div>
      )}

      {/* Prompts list */}
      {!loading && !error && prompts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Your Prompts ({prompts.length})
            </h3>
            <Link
              href="/prompts/new"
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-[#09090B] font-medium text-sm px-4 py-2 rounded-md hover:bg-[var(--accent-hover)] transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Prompt
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.slice(0, 6).map((prompt) => (
              <Link
                key={prompt.id}
                href={`/prompts/${prompt.id}`}
                className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6 hover:border-[var(--accent)] hover:shadow-lg transition-all duration-200"
              >
                <h4 className="font-semibold text-[var(--text-primary)] mb-2 truncate">
                  {prompt.title}
                </h4>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">
                  {prompt.description || prompt.latest_content?.slice(0, 100)}...
                </p>
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span>{new Date(prompt.created_at).toLocaleDateString()}</span>
                  <span className="font-mono">#{prompt.id}</span>
                </div>
              </Link>
            ))}
          </div>

          {prompts.length > 6 && (
            <div className="text-center">
              <Link
                href="/prompts"
                className="text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm font-medium"
              >
                View all {prompts.length} prompts →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Recent activity */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Recent Activity
        </h3>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-[var(--bg-subtle)] rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-[var(--bg-subtle)] rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : prompts.length > 0 ? (
          <div className="space-y-4">
            {prompts.slice(0, 3).map((prompt) => (
              <div key={prompt.id} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[var(--accent)] rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--text-primary)]">
                    Created <strong>{prompt.title}</strong>
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {new Date(prompt.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[var(--text-secondary)]">
              No recent activity yet. Create your first prompt to see activity here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
