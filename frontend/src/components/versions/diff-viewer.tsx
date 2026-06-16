'use client'

interface DiffViewerProps {
  diff: string
  oldLabel?: string
  newLabel?: string
  maxHeight?: string
}

type DiffLineType = 'header' | 'chunk' | 'context' | 'add' | 'remove'

interface ParsedLine {
  type: DiffLineType
  content: string
  lineNumber: number
}

function parseDiff(diff: string): ParsedLine[] {
  const lines = diff.split('\n')
  const result: ParsedLine[] = []
  let lineNum = 0

  for (const raw of lines) {
    // Skip trailing empty line
    if (raw === '' && result.length === 0) continue

    lineNum++

    if (raw.startsWith('--- ') || raw.startsWith('+++ ')) {
      result.push({ type: 'header', content: raw, lineNumber: lineNum })
    } else if (raw.startsWith('@@')) {
      result.push({ type: 'chunk', content: raw, lineNumber: lineNum })
    } else if (raw.startsWith('-')) {
      result.push({ type: 'remove', content: raw, lineNumber: lineNum })
    } else if (raw.startsWith('+')) {
      result.push({ type: 'add', content: raw, lineNumber: lineNum })
    } else {
      result.push({ type: 'context', content: raw, lineNumber: lineNum })
    }
  }

  return result
}

export default function DiffViewer({
  diff,
  oldLabel,
  newLabel,
  maxHeight,
}: DiffViewerProps) {
  if (!diff || diff.trim() === '') {
    return (
      <div className="diff-showcase text-center py-8">
        <p className="text-sm text-[var(--text-tertiary)] font-mono">No differences found</p>
        <p className="text-xs text-[var(--text-tertiary)] mt-1">The two versions are identical.</p>
      </div>
    )
  }

  const parsedLines = parseDiff(diff.trimEnd())

  const headerLabel =
    oldLabel && newLabel ? `${oldLabel} → ${newLabel}` : 'Diff'

  return (
    <div className="diff-showcase" style={maxHeight ? { maxHeight, overflow: 'auto' } : undefined}>
      {/* Header */}
      <div className="diff-header">
        <span>Unified Diff</span>
        <span>{headerLabel}</span>
      </div>

      {/* Diff lines */}
      <div className="font-mono text-sm leading-relaxed">
        {parsedLines.map((line) => {
          if (line.type === 'header') {
            return (
              <div key={line.lineNumber} className="diff-line text-[var(--text-tertiary)] italic text-[11px]">
                <span className="diff-num">{line.lineNumber}</span>
                <span>{line.content}</span>
              </div>
            )
          }

          if (line.type === 'chunk') {
            return (
              <div key={line.lineNumber} className="diff-line text-[var(--accent-amber)] text-[11px] font-medium">
                <span className="diff-num">{line.lineNumber}</span>
                <span>{line.content}</span>
              </div>
            )
          }

          if (line.type === 'remove') {
            return (
              <div key={line.lineNumber} className="diff-line remove">
                <span className="diff-num">{line.lineNumber}</span>
                <span>{line.content}</span>
              </div>
            )
          }

          if (line.type === 'add') {
            return (
              <div key={line.lineNumber} className="diff-line add">
                <span className="diff-num">{line.lineNumber}</span>
                <span>{line.content}</span>
              </div>
            )
          }

          // Context
          return (
            <div key={line.lineNumber} className="diff-line text-[var(--text-secondary)]">
              <span className="diff-num">{line.lineNumber}</span>
              <span>{line.content}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
