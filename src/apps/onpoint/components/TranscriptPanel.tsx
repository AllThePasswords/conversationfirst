import { useEffect, useRef, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import type { TranscriptEntry } from '../lib/types'
import { formatTimestamp } from '../lib/storage'

interface TranscriptPanelProps {
  entries: TranscriptEntry[]
  isLive: boolean
}

export default function TranscriptPanel({ entries, isLive }: TranscriptPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [entries.length, autoScroll])

  function handleScroll() {
    const el = containerRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60
    setAutoScroll(atBottom)
  }

  if (entries.length === 0) {
    return (
      <div className="op-transcript-panel">
        <div className="op-transcript-panel-header">Transcript</div>
        <div className="op-transcript-empty">
          {isLive ? 'Waiting for speech\u2026' : 'No transcript recorded.'}
        </div>
      </div>
    )
  }

  return (
    <div className="op-transcript-panel">
      <div className="op-transcript-panel-header">Transcript</div>
      <div
        className="op-transcript-scroll"
        ref={containerRef}
        onScroll={handleScroll}
      >
        {entries.map((entry, i) => (
          <div
            key={i}
            className={`op-transcript-entry${entry.speaker === 'them' ? ' op-transcript-entry-them' : ''}`}
          >
            <div className="op-transcript-meta">
              <span className="op-transcript-speaker">
                {entry.speaker === 'you' ? 'You' : entry.speaker === 'them' ? 'Them' : '\u00b7'}
              </span>
              <span className="op-transcript-time">{formatTimestamp(entry.timestamp)}</span>
            </div>
            <p className="op-transcript-text">{entry.text}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {isLive && !autoScroll && (
        <button
          className="op-transcript-scroll-btn"
          onClick={() => {
            setAutoScroll(true)
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
          }}
          aria-label="Scroll to latest"
        >
          <ChevronDownIcon width={14} height={14} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
