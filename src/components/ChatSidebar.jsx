import { useEffect, useRef } from 'react';

export default function ChatSidebar({ isOpen, conversations, activeId, onSelect, onNew, onClose }) {
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    // Focus the sidebar when it opens
    sidebarRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && <div className="chat-sidebar-overlay" onClick={onClose} />}
      <nav
        ref={sidebarRef}
        className={`chat-sidebar ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Conversation history"
        tabIndex={-1}
      >
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
          <button className="chat-menu-btn" onClick={onClose} title="Close" aria-label="Close conversation list">
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
      </nav>
    </>
  );
}
