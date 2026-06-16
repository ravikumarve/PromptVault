'use client'

interface CodeBlockProps {
  content: string
  header?: string
  maxHeight?: string
  className?: string
}

export default function CodeBlock({ content, header, maxHeight, className = '' }: CodeBlockProps) {
  const lines = content.split('\n')

  return (
    <div className={`code-block ${className}`}>
      {header && (
        <div className="diff-header">
          <span>{header}</span>
          <span className="text-[var(--text-tertiary)] font-mono">
            {lines.length} lines
          </span>
        </div>
      )}
      <div
        className="overflow-auto font-mono text-sm leading-relaxed"
        style={maxHeight ? { maxHeight } : undefined}
      >
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="text-[var(--text-tertiary)] w-10 shrink-0 select-none text-right pr-4 text-[11px]">
              {i + 1}
            </span>
            <span className="text-[var(--text-secondary)] whitespace-pre-wrap break-all">
              {line || ' '}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
