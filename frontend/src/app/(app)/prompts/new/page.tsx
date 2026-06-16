'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import Link from 'next/link'
import { ArrowLeft, FileText, Globe, Lock } from 'lucide-react'
import CodeBlock from '@/components/ui/code-block'

export default function NewPromptPage() {
  const { user, loading: authLoading } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!title.trim()) {
      setError('Title is required')
      setIsLoading(false)
      return
    }

    if (!content.trim()) {
      setError('Content is required')
      setIsLoading(false)
      return
    }

    const result = await api.createPrompt(title, content, description || undefined, isPublic)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    window.location.href = '/dashboard'
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-amber)]" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-mono"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
          Create New Prompt
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Write your prompt and track versions as you iterate.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-[var(--error-bg)] border border-[var(--error-border)] rounded-[var(--radius-card)] p-3 text-sm text-[var(--error)] flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 font-mono">
              Title <span className="text-[var(--error)]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[var(--surface-panel)] border border-[var(--border-dim)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] rounded-[var(--radius-btn)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent-amber)] focus:ring-2 focus:ring-[var(--accent-amber-dim)] transition-all"
              placeholder="e.g., Code Review Assistant"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 font-mono">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[var(--surface-panel)] border border-[var(--border-dim)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] rounded-[var(--radius-btn)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent-amber)] focus:ring-2 focus:ring-[var(--accent-amber-dim)] transition-all"
              placeholder="Short description of what this prompt does"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 font-mono">
              Prompt Content <span className="text-[var(--error)]">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              className="w-full bg-[var(--surface-panel)] border border-[var(--border-dim)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] rounded-[var(--radius-btn)] px-3 py-2 text-sm font-mono focus:outline-none focus:border-[var(--accent-amber)] focus:ring-2 focus:ring-[var(--accent-amber-dim)] transition-all resize-y"
              placeholder="You are a helpful assistant that..."
            />
          </div>

          {/* Public/Private toggle */}
          <div className="flex items-center justify-between bg-[var(--surface-panel)] border border-[var(--border-dim)] rounded-[var(--radius-btn)] px-4 py-3">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <Globe className="h-4 w-4 text-[var(--accent-amber)]" />
              ) : (
                <Lock className="h-4 w-4 text-[var(--text-tertiary)]" />
              )}
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Make public</p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {isPublic ? 'Anyone can view this prompt' : 'Only you can view this prompt'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                isPublic ? 'bg-[var(--accent-amber)]' : 'bg-[var(--border-dim)]'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${
                  isPublic ? 'translate-x-[18px]' : 'translate-x-[2px]'
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-dim)] rounded-[var(--radius-btn)] hover:border-[var(--border-hover)] transition-all duration-150"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn btn-primary text-sm !py-2 !px-4 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="h-4 w-4" />
              {isLoading ? 'Creating...' : 'Create Prompt'}
            </button>
          </div>
        </div>

        {/* Right: Live preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Preview
            </h2>
            {content && (
              <span className="text-xs text-[var(--text-tertiary)] font-mono">
                {content.split('\n').length} lines
              </span>
            )}
          </div>

          {content.trim() ? (
            <CodeBlock
              content={content}
              header={title || 'Untitled Prompt'}
              maxHeight="65vh"
            />
          ) : (
            <div className="diff-showcase text-center py-12">
              <FileText className="h-8 w-8 text-[var(--text-tertiary)] mx-auto mb-3" />
              <p className="text-sm text-[var(--text-tertiary)] font-mono">
                No content yet
              </p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                Start typing to see a live preview
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
