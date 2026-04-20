'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import Link from 'next/link'
import { ArrowLeft, FileText, Globe, Lock } from 'lucide-react'

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
          Create New Prompt
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Write your prompt and track versions as you iterate.
        </p>
      </div>

      {/* Form */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-950/50 border border-red-800 text-red-300 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] transition-all duration-150"
              placeholder="e.g., Code Review Assistant"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Description
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] transition-all duration-150"
              placeholder="Short description of what this prompt does"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Prompt Content <span className="text-red-400">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              className="w-full bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] transition-all duration-150 resize-y"
              placeholder="You are a helpful assistant that..."
              required
            />
          </div>

          {/* is_public toggle */}
          <div className="flex items-center justify-between bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-md px-4 py-3">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <Globe className="h-4 w-4 text-[var(--accent)]" />
              ) : (
                <Lock className="h-4 w-4 text-[var(--text-muted)]" />
              )}
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  Make public
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {isPublic
                    ? 'Anyone can view this prompt'
                    : 'Only you can view this prompt'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                isPublic ? 'bg-[var(--accent)]' : 'bg-[var(--border-default)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isPublic ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)] rounded-md hover:border-[var(--border-strong)] transition-all duration-150"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-[#09090B] font-medium text-sm px-4 py-2 rounded-md hover:bg-[var(--accent-hover)] hover:shadow-[0_0_16px_rgba(245,158,11,0.4)] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="h-4 w-4" />
              {isLoading ? 'Creating...' : 'Create Prompt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
