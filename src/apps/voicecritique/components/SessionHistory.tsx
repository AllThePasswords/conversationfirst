import { MicrophoneIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { VCSession } from '../lib/types'
import { formatDuration } from '../lib/storage'

interface SessionHistoryProps {
  sessions: VCSession[]
  onNewRecording: () => void
  onSelectSession: (session: VCSession) => void
  onDeleteSession: (id: string) => void
  hasDeepgramKey: boolean
}

export default function SessionHistory({
  sessions,
  onNewRecording,
  onSelectSession,
  onDeleteSession,
  hasDeepgramKey,
}: SessionHistoryProps) {
  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    onDeleteSession(id)
  }

  return (
    <>
      <div className="vc-history-header">
        <div>
          <span className="vc-history-kicker">Voice to plan</span>
          <h1 className="vc-history-title">VoiceCritique</h1>
          <p className="vc-history-desc">
            Record a voice note critiquing a build or UX. VoiceCritique transcribes it live and structures the
            feedback into an actionable Claude Code plan you can copy in one go.
          </p>
        </div>
        {hasDeepgramKey && (
          <button className="vc-btn-primary" onClick={onNewRecording}>
            <MicrophoneIcon width={14} height={14} aria-hidden="true" />
            New recording
          </button>
        )}
      </div>

      {!hasDeepgramKey && (
        <div className="vc-setup-hint">
          Add your Deepgram API key in the vault to start recording.
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="cf-empty">
          <MicrophoneIcon className="cf-empty-icon" aria-hidden="true" />
          <div className="cf-empty-title">No recordings yet</div>
          <div className="cf-empty-desc">Start a new recording to begin.</div>
        </div>
      ) : (
        <div className="vc-session-table-wrapper">
          <table className="vc-session-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Duration</th>
                <th style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {sessions.map(session => {
                const date = new Date(session.createdAt)
                return (
                  <tr
                    key={session.id}
                    onClick={() => session.status === 'completed' && onSelectSession(session)}
                    style={{ cursor: session.status === 'completed' ? 'pointer' : 'default' }}
                  >
                    <td>
                      <div className="vc-cell-date">
                        <span className="vc-cell-date-day">
                          {date.toLocaleDateString('en-IE', { day: 'numeric', month: 'short' })}
                        </span>
                        <span className="vc-cell-date-time">
                          {date.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="vc-cell-title">{session.title}</span>
                    </td>
                    <td>
                      <span className="vc-cell-mono">{formatDuration(session.durationMs)}</span>
                    </td>
                    <td>
                      <button
                        className="vc-btn-icon vc-delete-btn"
                        onClick={(e) => handleDelete(e, session.id)}
                        aria-label={`Delete session ${session.title}`}
                      >
                        <TrashIcon width={14} height={14} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
