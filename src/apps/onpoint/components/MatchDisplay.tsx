import { useState } from 'react'
import type { SessionQuestion } from '../lib/types'
import { formatTimestamp } from '../lib/storage'
import AudioVisualizer from './AudioVisualizer'

interface MatchDisplayProps {
  questions: SessionQuestion[]
  isLive: boolean
  stream?: MediaStream | null
}

function FullQuestion({ q }: { q: SessionQuestion }) {
  return (
    <div className="op-match">
      <div className="op-question">{q.text}</div>
      <div className="op-lead">
        {q.match
          ? q.match.example.lead
          : 'No strong match \u2014 speak freely, lead with an outcome.'}
      </div>
      {q.match && (
        <div className="op-source-panel">
          <div className="op-source-header">
            <span className="op-badge">{q.match.example.category.replace(/-/g, ' ')}</span>
            <span className="op-source-id">{q.match.example.sourceFile || q.match.example.id}</span>
          </div>
          {q.match.example.metrics && (
            <div className="op-source-metrics">{q.match.example.metrics}</div>
          )}
          {q.match.example.context && (
            <div className="op-source-context">{q.match.example.context}</div>
          )}
        </div>
      )}
      {q.runnerUp && (
        <div className="op-runner-up">
          <div className="op-runner-up-label">Also consider</div>
          <div className="op-runner-up-lead">{q.runnerUp.example.lead}</div>
          <div className="op-runner-up-meta">
            <span className="op-badge op-badge-muted">
              {q.runnerUp.example.category.replace(/-/g, ' ')}
            </span>
            <span className="op-source-id">{q.runnerUp.example.id}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function CompactQuestion({ q, onExpand }: { q: SessionQuestion; onExpand: () => void }) {
  return (
    <button className="op-question-previous" onClick={onExpand} type="button">
      <div className="op-question-previous-header">
        <span className="op-question-previous-q">{q.text}</span>
        <span className="op-transcript-time">{formatTimestamp(q.detectedAt)}</span>
      </div>
      <div className="op-question-previous-lead">
        {q.match ? q.match.example.lead : 'No match'}
      </div>
      {q.match && (
        <span className="op-badge op-badge-muted">{q.match.example.category.replace(/-/g, ' ')}</span>
      )}
    </button>
  )
}

export default function MatchDisplay({ questions, isLive, stream }: MatchDisplayProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (questions.length === 0) {
    if (!isLive) return null
    return (
      <div className="op-waiting">
        <AudioVisualizer stream={stream ?? null} active={isLive} />
        <div className="op-waiting-text">Listening for questions&hellip;</div>
      </div>
    )
  }

  const latest = questions[questions.length - 1]
  const previous = questions.slice(0, -1).reverse()

  return (
    <div className="op-questions-list">
      <div className="op-question-latest">
        <FullQuestion q={latest} />
      </div>

      {previous.map(q =>
        expandedId === q.id ? (
          <div key={q.id} className="op-question-expanded">
            <button
              className="op-question-collapse-btn"
              onClick={() => setExpandedId(null)}
              type="button"
            >
              Collapse
            </button>
            <FullQuestion q={q} />
          </div>
        ) : (
          <CompactQuestion
            key={q.id}
            q={q}
            onExpand={() => setExpandedId(q.id)}
          />
        )
      )}
    </div>
  )
}
