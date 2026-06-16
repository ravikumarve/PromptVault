'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Prompt, PromptVersion } from '@/types'
import { ArrowLeft, Save, FileText, Globe, Lock, AlertCircle } from 'lucide-react'
import DiffViewer from '@/components/versions/diff-viewer'

function computeSimpleDiff(oldContent: string, newContent: string): string {
  const oldLines = oldContent.split('\n')
  const newLines = newContent.split('\n')
  const maxLen = Math.max(oldLines.length, newLines.length)
  const result: string[] = []

  for (let i = 0; i < maxLen; i++) {
    if (i >= oldLines.length) {
      result.push(`+${newLines[i]}`)
    } else if (i >= newLines.length) {
      result.push(`-${oldLines[i]}`)
    } else if (oldLines[i] !== newLines[i]) {
      result.push(`-${oldLines[i]}`)
      result.push(`+${newLines[i]}`)
    } else {
      result.push(` ${oldLines[i]}`)
    }
  }

  return result.join('\n')
}

export default function EditPromptPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [latestVersion, setLatestVersion] = useState<PromptVersion | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [commitMessage, setCommitMessage] = useState('')

  useEffect(() => {
    fetchPromptData()
  }, [id])

  const fetchPromptData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [promptRes, latestRes] = await Promise.all([
        api.getPrompt(id),
        api.getLatestVersion(id),
      ])

      if (promptRes.error) {
        setError(promptRes.error)
        return
      }

      if (promptRes.data) {
        setPrompt(promptRes.data)
        setTitle(promptRes.data.title)
        setDescription(promptRes.data.description || '')
        setIsPublic(promptRes.data.is_public)
      }

      if (latestRes.data) {
        setLatestVersion(latestRes.data)
        setContent(latestRes.data.content)
      } else if (promptRes.data?.latest_content) {
        setContent(promptRes.data.latest_content)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prompt')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    try {
      setSaving(true)
      setError(null)
      const res = await api.updatePrompt(id, title, content, description || undefined, isPublic)

      if (res.error) {
        setError(res.error)
        return
      }

      router.push(`/prompts/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  // Compute live diff
  const latestContent = latestVersion?.content || prompt?.latest_content || ''
  const hasChanges = content !== latestContent
  const diffOutput =
    hasChanges && latestContent
      ? computeSimpleDiff(latestContent, content)
      : ''

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-amber)]" />
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="max-w-2xl mx-auto pt-12 text-center">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Prompt not found</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">This prompt may have been deleted.</p>
        <Link href="/prompts" className="btn btn-outline text-sm !py-2 !px-4">Back to Prompts</Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Back link */}
      <Link
        href={`/prompts/${id}`}
        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-mono"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Prompt
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
            Edit Prompt
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1 font-mono">
            {prompt.title}
            {latestVersion && (
              <>
                <span className="mx-2 text-[var(--text-tertiary)]">·</span>
                v{latestVersion.version_number}
              </>
            )}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary text-sm !py-2 !px-4 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-[var(--error-bg)] border border-[var(--error-border)] rounded-[var(--radius-card)] p-3 text-sm text-[var(--error)] flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
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
              placeholder="Prompt title"
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
              placeholder="Brief description of this prompt"
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
                <p className="text-sm font-medium text-[var(--text-primary)]">Public prompt</p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {isPublic ? 'Anyone can view' : 'Only you can view'}
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
              placeholder="Enter your prompt content..."
            />
          </div>

          {/* Commit message */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 font-mono">
              Commit Message
            </label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              className="w-full bg-[var(--surface-panel)] border border-[var(--border-dim)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] rounded-[var(--radius-btn)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent-amber)] focus:ring-2 focus:ring-[var(--accent-amber-dim)] transition-all"
              placeholder="Describe what changed in this update..."
            />
          </div>
        </div>

        {/* Right: Live diff preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Live Diff Preview
            </h2>
            {hasChanges && (
              <span className="text-xs text-[var(--diff-add-text)] font-mono">
                Changes detected
              </span>
            )}
          </div>

          {hasChanges ? (
            <DiffViewer
              diff={diffOutput}
              oldLabel={`v${latestVersion?.version_number || '?'} (current)`}
              newLabel="Your changes"
              maxHeight="65vh"
            />
          ) : (
            <div className="diff-showcase text-center py-12">
              <FileText className="h-8 w-8 text-[var(--text-tertiary)] mx-auto mb-3" />
              <p className="text-sm text-[var(--text-tertiary)] font-mono">
                No changes yet
              </p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                Edit the content above to see a live diff preview
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
