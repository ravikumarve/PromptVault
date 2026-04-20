'use client'

import { useAuth } from '@/lib/auth'
import { Plus, Search, Filter, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

export default function PromptsPage() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
      </div>
    )
  }

  // Mock data for now - will be replaced with real API calls
  const prompts: Array<{
    id: string
    title: string
    description?: string
    current_version: string
    tags: string[]
    updated_at: string
  }> = []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            Prompts
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Manage your AI prompts and track version history
          </p>
        </div>
        
        <Link
          href="/prompts/new"
          className="inline-flex items-center gap-2 bg-[var(--accent)] text-[#09090B] font-medium text-sm px-4 py-2 rounded-md hover:bg-[var(--accent-hover)] hover:shadow-[0_0_16px_rgba(245,158,11,0.4)] transition-all duration-150"
        >
          <Plus className="h-4 w-4" />
          New Prompt
        </Link>
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search prompts..."
            className="w-full bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] rounded-md pl-10 pr-4 py-2 text-sm font-mono focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] transition-all duration-150"
          />
        </div>
        
        <button className="flex items-center gap-2 border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] px-3 py-2 rounded-md text-sm transition-all duration-150">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Empty state */}
      {prompts.length === 0 && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-[var(--accent-muted)] rounded-full flex items-center justify-center mb-6">
            <Plus className="h-8 w-8 text-[var(--accent)]" />
          </div>
          
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            No prompts yet
          </h2>
          
          <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
            Create your first prompt to start tracking versions and collaborating with your team.
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
      {prompts.length > 0 && (
        <div className="grid gap-4">
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6 hover:border-[var(--border-strong)] hover:shadow-[var(--accent-glow)] transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    {prompt.title}
                  </h3>
                  
                  {prompt.description && (
                    <p className="text-[var(--text-secondary)] mb-4">
                      {prompt.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                    <span className="font-mono text-xs bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--border-glow)] px-2 py-0.5 rounded">
                      v{prompt.current_version}
                    </span>
                    
                    {prompt.tags && prompt.tags.length > 0 && (
                      <div className="flex items-center gap-2">
                        {prompt.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="bg-[var(--bg-subtle)] text-[var(--text-secondary)] px-2 py-0.5 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {prompt.tags.length > 3 && (
                          <span className="text-[var(--text-muted)] text-xs">
                            +{prompt.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    <span className="text-[var(--text-muted)]">
                      Updated {new Date(prompt.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button className="p-2 hover:bg-[var(--bg-hover)] rounded-md transition-colors">
                  <MoreHorizontal className="h-4 w-4 text-[var(--text-secondary)]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
