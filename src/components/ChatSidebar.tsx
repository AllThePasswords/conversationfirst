import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ChatSidebar({ isOpen, conversations, activeId, onSelect, onNew, onClose, user }) {
  const sidebarRef = useRef(null);
  const { signOut } = useAuth();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    sidebarRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSignOut = async () => {
    await signOut();
    window.location.hash = '#/';
  };

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
          <a href="#/" className="chat-sidebar-home">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Home
          </a>
          <span style={{
            fontSize: 'var(--text-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            fontWeight: 600,
          }}>
            Conversations
          </span>
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

        {user && (
          <div className="chat-sidebar-footer">
            <div className="chat-sidebar-user">
              {user.email}
            </div>
            <button
              className="btn btn-ghost btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
