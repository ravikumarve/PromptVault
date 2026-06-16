'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Prompt, PromptVersion } from '@/types'
import { ArrowLeft, Edit, FileText, Globe, Lock, Calendar, Layers, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Badge from '@/components/ui/badge'
import CodeBlock from '@/components/ui/code-block'
import VersionTimeline from '@/components/prompts/version-timeline'

export default function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [versions, setVersions] = useState<PromptVersion[]>([])
  const [selectedVersion, setSelectedVersion] = useState<PromptVersion | null>(null)
  const [loading, setLoading] = useState(true)
  const [versionsLoading, setVersionsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPrompt()
    fetchVersions()
  }, [id])

  const fetchPrompt = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getPrompt(id)
      if (response.error) {
        setError(response.error)
      } else if (response.data) {
        setPrompt(response.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prompt')
    } finally {
      setLoading(false)
    }
  }

  const fetchVersions = async () => {
    try {
      setVersionsLoading(true)
      const response = await api.getVersions(id)
      if (!response.error && response.data) {
        setVersions(response.data)
        // Select the latest version by default
        const sorted = [...response.data].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        if (sorted.length > 0) {
          setSelectedVersion(sorted[0])
        }
      }
    } catch (_err) {
      // Silently handle — versions are secondary content
    } finally {
      setVersionsLoading(false)
    }
  }

  const handleViewVersion = (versionId: number) => {
    const v = versions.find((v) => v.id === versionId)
    if (v) setSelectedVersion(v)
  }

  const handleDiffVersions = (sourceId: number, targetId: number) => {
    router.push(`/prompts/${id}/diff?from=${targetId}&to=${sourceId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-amber)]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto pt-12 text-center">
        <div className="w-14 h-14 rounded-full bg-[var(--error-bg)] flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-7 w-7 text-[var(--error)]" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Failed to load prompt</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">{error}</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={fetchPrompt} className="btn btn-outline text-sm !py-2 !px-4 gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
          <Link href="/prompts" className="btn btn-outline text-sm !py-2 !px-4">
            Back to Prompts
          </Link>
        </div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="max-w-2xl mx-auto pt-12 text-center">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Prompt not found</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">This prompt may have been deleted.</p>
        <Link href="/prompts" className="btn btn-outline text-sm !py-2 !px-4">
          Back to Prompts
        </Link>
      </div>
    )
  }

  const displayVersion = selectedVersion || versions[0]
  const displayContent = displayVersion?.content || prompt.latest_content || ''

  return (
    <div className="space-y-5">
      {/* Back link */}
      <Link
        href="/prompts"
        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-mono"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Prompts
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl font-semibold tracking-tight text-[var(--text-primary)] truncate">
              {prompt.title}
            </h1>
            {displayVersion && (
              <Badge text={`v${displayVersion.version_number}`} variant="amber" />
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)] font-mono">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {new Date(prompt.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="h-3 w-3" />
              {prompt.version_count} version{prompt.version_count !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1.5">
              {prompt.is_public ? (
                <><Globe className="h-3 w-3" /> Public</>
              ) : (
                <><Lock className="h-3 w-3" /> Private</>
              )}
            </span>
          </div>
        </div>

        <Link
          href={`/prompts/${id}/edit`}
          className="btn btn-outline text-sm !py-2 !px-3 gap-2 shrink-0"
        >
          <Edit className="h-3.5 w-3.5" />
          Edit
        </Link>
      </div>

      {/* Description */}
      {prompt.description && (
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          {prompt.description}
        </p>
      )}

      {/* 70/30 Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-5">
        {/* Left Panel — Content */}
        <div className="space-y-4">
          {/* Version selector tabs */}
          {versions.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[...versions]
                .sort((a, b) => b.version_number - a.version_number)
                .slice(0, 10)
                .map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleViewVersion(v.id)}
                    className={`px-2.5 py-1 rounded-[var(--radius-btn)] text-xs font-mono transition-all duration-150 whitespace-nowrap ${
                      selectedVersion?.id === v.id
                        ? 'bg-[var(--accent-amber-dim)] text-[var(--accent-amber)] border border-[rgba(245,158,11,0.2)]'
                        : 'bg-[var(--surface-panel)] text-[var(--text-secondary)] border border-[var(--border-dim)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]'
                    }`}
                  >
                    v{v.version_number}
                  </button>
                ))}
              {versions.length > 10 && (
                <span className="text-xs text-[var(--text-tertiary)] font-mono ml-1">
                  +{versions.length - 10} more
                </span>
              )}
            </div>
          )}

          {/* Content block */}
          <div>
            {displayVersion?.message && (
              <div className="text-xs text-[var(--text-secondary)] mb-2 font-mono">
                &ldquo;{displayVersion.message}&rdquo;
              </div>
            )}
            <CodeBlock
              content={displayContent || 'No content'}
              header={
                displayVersion
                  ? `v${displayVersion.version_number} — ${new Date(displayVersion.created_at).toLocaleString()}`
                  : 'Content'
              }
              maxHeight="60vh"
            />
          </div>
        </div>

        {/* Right Panel — Version Timeline */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Layers className="h-4 w-4 text-[var(--accent-amber)]" />
            Version History
          </h2>

          {versionsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex gap-3">
                  <div className="w-5 h-5 bg-[var(--border-dim)] rounded-full shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-[var(--border-dim)] rounded w-1/2 mb-1" />
                    <div className="h-2 bg-[var(--border-dim)] rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <VersionTimeline
              versions={versions}
              promptId={id}
              onViewVersion={handleViewVersion}
              onDiffVersions={handleDiffVersions}
            />
          )}
        </div>
      </div>
    </div>
  )
}
