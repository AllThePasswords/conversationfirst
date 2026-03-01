import { ChatBubbleOvalLeftIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'

interface ChatHistoryProps {
  conversations: Array<{ id: string; title: string; updatedAt: number }>
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
}

export default function ChatHistory({ conversations, onSelect, onNew, onDelete }: ChatHistoryProps) {
  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    onDelete(id)
  }

  return (
    <div className="ch-history">
      <div className="ch-history-header">
        <div>
          <span className="ch-history-kicker">AI assistant</span>
          <h1 className="ch-history-title">Chat</h1>
          <p className="ch-history-desc">
            Multi-threaded conversations with the ConversationFirst AI.
            Ask about voice rules, design tokens, processing states, and components.
          </p>
        </div>
        <button className="ch-btn-primary" onClick={onNew}>
          <PlusIcon width={14} height={14} aria-hidden="true" />
          New chat
        </button>
      </div>

      {conversations.length === 0 ? (
        <div className="ch-table-wrapper">
          <div className="cf-empty">
            <ChatBubbleOvalLeftIcon className="cf-empty-icon" aria-hidden="true" />
            <div className="cf-empty-title">No conversations yet</div>
            <div className="cf-empty-desc">Start a new chat to begin.</div>
          </div>
        </div>
      ) : (
        <div className="ch-table-wrapper">
          <table className="ch-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Last updated</th>
                <th style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {conversations.map(c => {
                const date = new Date(c.updatedAt)
                return (
                  <tr key={c.id} onClick={() => onSelect(c.id)}>
                    <td>
                      <span className="ch-cell-title">{c.title || 'New conversation'}</span>
                    </td>
                    <td>
                      <div className="ch-cell-date">
                        <span className="ch-cell-date-day">
                          {date.toLocaleDateString('en-IE', { day: 'numeric', month: 'short' })}
                        </span>
                        <span className="ch-cell-date-time">
                          {date.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td>
                      <button
                        className="ch-btn-icon ch-delete-btn"
                        onClick={(e) => handleDelete(e, c.id)}
                        aria-label={`Delete conversation ${c.title || 'New conversation'}`}
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
    </div>
  )
}
