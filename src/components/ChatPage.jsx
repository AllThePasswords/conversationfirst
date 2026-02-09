import { useState, useEffect, useRef, useCallback } from 'react';
import { useChat } from '../hooks/useChat';
import { useChatHistory } from '../hooks/useChatHistory';
import ChatMessage from './ChatMessage';
import ChatProcessing from './ChatProcessing';
import ChatInput from './ChatInput';
import ChatSidebar from './ChatSidebar';
import MarkdownRenderer from './MarkdownRenderer';

const SUGGESTIONS = [
  'Write me a system prompt that follows the 7 voice rules',
  'How do I set up the typography tokens?',
  'Show me how the citation system works',
  'What are the 5 processing state tiers?',
  'Help me configure dark mode with the colour tokens',
  'What components are in the framework?',
];

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { conversations, activeId, setActiveId, createConversation, updateTitle, deleteConversation } = useChatHistory();

  // Auto-create first conversation if none exists
  useEffect(() => {
    if (!activeId && conversations.length === 0) {
      createConversation();
    }
  }, [activeId, conversations.length, createConversation]);

  const { messages, isStreaming, isSearching, streamingContent, error, sendMessage, clearError } = useChat(activeId, updateTitle);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const pendingSentRef = useRef(false);

  // Send pending message from landing page floating input
  useEffect(() => {
    if (!activeId || pendingSentRef.current) return;
    const pending = sessionStorage.getItem('cf-pending-message');
    if (pending) {
      sessionStorage.removeItem('cf-pending-message');
      pendingSentRef.current = true;

      // Check if current conversation already has messages
      const existing = localStorage.getItem(`cf-chat-${activeId}`);
      const hasMessages = existing && JSON.parse(existing).length > 0;

      if (hasMessages) {
        // Create a fresh conversation for this new question
        const newId = createConversation();
        setTimeout(() => sendMessage(pending), 100);
      } else {
        // Reuse the current empty conversation
        setTimeout(() => sendMessage(pending), 50);
      }
    }
  }, [activeId, sendMessage, createConversation]);

  // Auto-scroll when new content arrives
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingContent]);

  const handleNewChat = useCallback(() => {
    createConversation();
    setSidebarOpen(false);
  }, [createConversation]);

  const handleSelectChat = useCallback((id) => {
    setActiveId(id);
    setSidebarOpen(false);
  }, [setActiveId]);

  return (
    <div className="chat-page">
      <a href="#chat-main" className="skip-link">Skip to content</a>
      <ChatSidebar
        isOpen={sidebarOpen}
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelectChat}
        onNew={handleNewChat}
        onClose={() => setSidebarOpen(false)}
      />

      <header className="chat-header">
        <button className="chat-menu-btn" onClick={() => setSidebarOpen(true)} title="Conversations" aria-label="Open conversation list">
          ☰
        </button>
        <div className="chat-header-title">
          <a href="#/">Conversation First</a>
        </div>
        <button className="chat-menu-btn" onClick={handleNewChat} title="New chat" aria-label="Start new conversation">
          +
        </button>
      </header>

      <main id="chat-main" className="chat-messages" ref={messagesContainerRef}>
        <div className="chat-messages-inner">
          {messages.length === 0 && !isStreaming ? (
            <div className="chat-welcome">
              <div className="welcome-header">
                <h2>Conversation First</h2>
                <p className="welcome-subtitle">
                  The AI is a computer. Not a person, not an assistant, not a helper.
                </p>
              </div>

              <div className="welcome-section">
                <div className="welcome-section-label">What this chat does</div>
                <p className="welcome-desc">
                  This assistant knows the entire Conversation First framework. It helps you apply the method — voice rules, design tokens, citation system, processing states, and components — to your own AI products.
                </p>
              </div>

              <div className="welcome-section">
                <div className="welcome-section-label">Try asking</div>
                <div className="welcome-suggestions">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      className="welcome-suggestion"
                      onClick={() => sendMessage(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="welcome-rules">
                <div className="welcome-section-label">The 7 rules this chat follows</div>
                <div className="welcome-rules-grid">
                  {[
                    ['1', 'Answer first', 'Direct answer in the first sentence'],
                    ['2', 'Cite everything', 'Every claim has a source'],
                    ['3', 'Give examples', 'Code, data, or before/after'],
                    ['4', 'Stop when done', 'No padding or summaries'],
                    ['5', 'No emotion', 'Facts, not feelings'],
                    ['6', 'Short sentences', 'One idea per sentence'],
                    ['7', 'No filler', 'Every word earns its place'],
                  ].map(([num, title, desc]) => (
                    <div key={num} className="welcome-rule">
                      <span className="welcome-rule-num">{num}</span>
                      <div>
                        <strong>{title}.</strong>{' '}
                        <span className="welcome-rule-desc">{desc}.</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <ChatMessage key={i} message={m} />
              ))}

              {isStreaming && (
                <div className="chat-bubble">
                  <div className="bubble-label">Assistant</div>
                  {isSearching && (
                    <div className="search-indicator" role="status" aria-live="polite">
                      <div className="processing-status">
                        <div className="processing-cursor" aria-hidden="true" />
                        <span className="processing-text">
                          Searching the web<span className="dot" aria-hidden="true">.</span><span className="dot" aria-hidden="true">.</span><span className="dot" aria-hidden="true">.</span>
                        </span>
                      </div>
                    </div>
                  )}
                  {streamingContent ? (
                    <div>
                      <MarkdownRenderer content={streamingContent} />
                      <span className="streaming-cursor" />
                    </div>
                  ) : !isSearching ? (
                    <ChatProcessing />
                  ) : null}
                </div>
              )}

              {error && (
                <div className="alert alert-destructive" role="alert">
                  <div style={{ flex: 1 }}><strong>Error:</strong> {error}</div>
                  <button
                    onClick={clearError}
                    aria-label="Dismiss error"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'var(--text-lg)', padding: 'var(--space-1)', lineHeight: 1 }}
                  >
                    ✕
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </main>

      <ChatInput onSend={sendMessage} disabled={isStreaming} />
    </div>
  );
}
