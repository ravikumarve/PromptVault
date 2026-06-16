'use client'

import { PromptVersion } from '@/types'
import Badge from '@/components/ui/badge'
import { Eye, GitCompare } from 'lucide-react'

interface VersionTimelineProps {
  versions: PromptVersion[]
  promptId: string | number
  onViewVersion?: (versionId: number) => void
  onDiffVersions?: (sourceId: number, targetId: number) => void
}

export default function VersionTimeline({
  versions,
  promptId,
  onViewVersion,
  onDiffVersions,
}: VersionTimelineProps) {
  if (versions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-xs text-[var(--text-tertiary)] font-mono">No versions yet</p>
      </div>
    )
  }

  // Sort newest first
  const sorted = [...versions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[var(--border-dim)]" />

      <div className="space-y-0">
        {sorted.map((version, index) => {
          const isLatest = index === 0
          return (
            <VersionItem
              key={version.id}
              version={version}
              isLatest={isLatest}
              onView={() => onViewVersion?.(version.id)}
              onDiff={
                index < sorted.length - 1
                  ? () => onDiffVersions?.(version.id, sorted[index + 1].id)
                  : undefined
              }
            />
          )
        })}
      </div>
    </div>
  )
}

function VersionItem({
  version,
  isLatest,
  onView,
  onDiff,
}: {
  version: PromptVersion
  isLatest: boolean
  onView: () => void
  onDiff?: () => void
}) {
  const timeStr = formatTimeAgo(version.created_at)

  return (
    <div className="relative flex gap-4 py-3 group">
      {/* Timeline dot */}
      <div className="relative z-10 shrink-0">
        <div
          className={`w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 ${
            isLatest
              ? 'border-[var(--accent-amber)] bg-[var(--accent-amber-dim)]'
              : 'border-[var(--border-dim)] bg-[var(--bg-void)]'
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isLatest ? 'bg-[var(--accent-amber)]' : 'bg-[var(--text-tertiary)]'
            }`}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`font-mono text-sm font-medium ${
              isLatest ? 'text-[var(--accent-amber)]' : 'text-[var(--text-primary)]'
            }`}
          >
            v{version.version_number}
          </span>
          {isLatest && <Badge text="Latest" variant="amber" />}
          <span className="text-[11px] text-[var(--text-tertiary)] font-mono ml-auto">
            {timeStr}
          </span>
        </div>

        {version.message && (
          <p className="text-xs text-[var(--text-secondary)] mb-2 leading-relaxed">
            {version.message}
          </p>
        )}

        {version.model_tested && (
          <div className="mb-2">
            <Badge text={version.model_tested} variant="outline" />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onView}
            className="flex items-center gap-1 text-[11px] text-[var(--accent-amber)] hover:text-[var(--accent-hover)] transition-colors font-mono"
          >
            <Eye className="h-3 w-3" />
            View
          </button>
          {onDiff && (
            <>
              <span className="text-[var(--text-tertiary)]">·</span>
              <button
                onClick={onDiff}
                className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-mono"
              >
                <GitCompare className="h-3 w-3" />
                Diff
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function formatTimeAgo(dateStr: string): string {
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
