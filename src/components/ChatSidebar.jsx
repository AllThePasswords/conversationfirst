export default function ChatSidebar({ isOpen, conversations, activeId, onSelect, onNew, onClose }) {
  return (
    <>
      {isOpen && <div className="chat-sidebar-overlay" onClick={onClose} />}
      <div className={`chat-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="chat-sidebar-header">
          <span style={{
            fontSize: 'var(--text-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            fontWeight: 600,
          }}>
            Conversations
          </span>
          <button className="chat-menu-btn" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        <button
          className="btn btn-primary btn-sm"
          style={{ width: '100%', marginBottom: 'var(--space-4)', justifyContent: 'center' }}
          onClick={onNew}
        >
          + New chat
        </button>

        <div className="chat-sidebar-list">
          {conversations.map(c => (
            <button
              key={c.id}
              className={`nav-item ${c.id === activeId ? 'active' : ''}`}
              onClick={() => onSelect(c.id)}
            >
              {c.title || 'New conversation'}
            </button>
          ))}
          {conversations.length === 0 && (
            <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
              No conversations yet.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
