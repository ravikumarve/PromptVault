'use client'

import { useState, useEffect, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Prompt, PromptVersion } from '@/types'
import { ArrowLeft, ArrowLeftRight, AlertCircle, RefreshCw } from 'lucide-react'
import Badge from '@/components/ui/badge'
import DiffViewer from '@/components/versions/diff-viewer'

export default function DiffPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()

  const fromParam = searchParams.get('from')
  const toParam = searchParams.get('to')

  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [versions, setVersions] = useState<PromptVersion[]>([])
  const [sourceId, setSourceId] = useState<number | null>(null)
  const [targetId, setTargetId] = useState<number | null>(null)
  const [diffData, setDiffData] = useState<{
    diff: string
    sourceVersion: PromptVersion | null
    targetVersion: PromptVersion | null
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [id])

  useEffect(() => {
    if (versions.length > 0) {
      // Set initial source/target from query params or defaults
      const sorted = [...versions].sort((a, b) => b.version_number - a.version_number)
      const initialSource = toParam
        ? versions.find((v) => v.id === Number(toParam))
        : sorted[0]
      const initialTarget = fromParam
        ? versions.find((v) => v.id === Number(fromParam))
        : sorted[1] || sorted[0]

      if (initialSource && initialTarget) {
        setSourceId(initialSource.id)
        setTargetId(initialTarget.id)
      }
    }
  }, [versions, fromParam, toParam])

  useEffect(() => {
    if (sourceId !== null && targetId !== null) {
      fetchDiff()
    }
  }, [sourceId, targetId])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [promptRes, versionsRes] = await Promise.all([
        api.getPrompt(id),
        api.getVersions(id),
      ])

      if (promptRes.error) {
        setError(promptRes.error)
        return
      }
      if (promptRes.data) {
        setPrompt(promptRes.data)
      }
      if (versionsRes.data) {
        setVersions(versionsRes.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const fetchDiff = async () => {
    if (sourceId === null || targetId === null) return

    try {
      const res = await api.compareVersions(id, sourceId, targetId)
      if (res.data) {
        setDiffData({
          diff: res.data.diff,
          sourceVersion: res.data.versions.source,
          targetVersion: res.data.versions.target,
        })
      } else if (res.error) {
        setError(res.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compute diff')
    }
  }

  const handleSwap = () => {
    setSourceId((prev) => {
      setTargetId(targetId)
      return targetId
    })
    setTargetId(sourceId)
  }

  const sortedVersions = [...versions].sort(
    (a, b) => b.version_number - a.version_number
  )

  const selectedSource = versions.find((v) => v.id === sourceId)
  const selectedTarget = versions.find((v) => v.id === targetId)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-amber)]" />
      </div>
    )
  }

  if (error && !prompt) {
    return (
      <div className="max-w-2xl mx-auto pt-12 text-center">
        <div className="w-14 h-14 rounded-full bg-[var(--error-bg)] flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-7 w-7 text-[var(--error)]" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Failed to load diff</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">{error}</p>
        <button onClick={fetchData} className="btn btn-outline text-sm !py-2 !px-4 gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
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
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
          Comparing Versions
        </h1>
        {prompt && (
          <p className="text-sm text-[var(--text-secondary)] mt-1 font-mono">
            {prompt.title}
            <span className="mx-2 text-[var(--text-tertiary)]">·</span>
            {new Date(prompt.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        )}
      </div>

      {/* Version selectors */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* From (target / older) */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-[var(--text-tertiary)] font-mono shrink-0">From:</label>
          <select
            value={targetId ?? ''}
            onChange={(e) => setTargetId(Number(e.target.value))}
            className="bg-[var(--surface-panel)] border border-[var(--border-dim)] text-[var(--text-primary)] rounded-[var(--radius-btn)] px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-[var(--accent-amber)] focus:ring-2 focus:ring-[var(--accent-amber-dim)] transition-all"
          >
            {sortedVersions.map((v) => (
              <option key={v.id} value={v.id}>
                v{v.version_number} {v.message ? `— ${v.message.slice(0, 30)}` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Swap button */}
        <button
          onClick={handleSwap}
          className="flex items-center gap-1.5 text-xs text-[var(--accent-amber)] hover:text-[var(--accent-hover)] transition-colors px-2 py-1.5 border border-[var(--border-dim)] rounded-[var(--radius-btn)] bg-[var(--surface-panel)]"
          title="Swap versions"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          Swap
        </button>

        {/* To (source / newer) */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-[var(--text-tertiary)] font-mono shrink-0">To:</label>
          <select
            value={sourceId ?? ''}
            onChange={(e) => setSourceId(Number(e.target.value))}
            className="bg-[var(--surface-panel)] border border-[var(--border-dim)] text-[var(--text-primary)] rounded-[var(--radius-btn)] px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-[var(--accent-amber)] focus:ring-2 focus:ring-[var(--accent-amber-dim)] transition-all"
          >
            {sortedVersions.map((v) => (
              <option key={v.id} value={v.id}>
                v{v.version_number} {v.message ? `— ${v.message.slice(0, 30)}` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Badge */}
        {selectedSource && selectedTarget && (
          <Badge
            text={`v${selectedTarget.version_number} → v${selectedSource.version_number}`}
            variant="amber"
          />
        )}
      </div>

      {/* Diff content */}
      {diffData && (
        <DiffViewer
          diff={diffData.diff}
          oldLabel={
            diffData.targetVersion
              ? `v${diffData.targetVersion.version_number}`
              : undefined
          }
          newLabel={
            diffData.sourceVersion
              ? `v${diffData.sourceVersion.version_number}`
              : undefined
          }
          maxHeight="70vh"
        />
      )}
    </div>
  )
}
