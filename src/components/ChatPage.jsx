import { useState, useEffect, useRef, useCallback } from 'react';
import { useChat } from '../hooks/useChat';
import { useChatHistory } from '../hooks/useChatHistory';
import { validateImage, validateImageCount } from '../lib/imageUpload';
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

let nextImageId = 0;

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stagedImages, setStagedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const { conversations, activeId, setActiveId, createConversation, updateTitle, deleteConversation } = useChatHistory();

  // Auto-create conversation: always new if ?new in hash, otherwise fallback
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('?new')) {
      createConversation();
      window.location.hash = '#/chat';
      return;
    }
    if (!activeId && conversations.length === 0) {
      createConversation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { messages, isStreaming, isSearching, isUploading, streamingContent, error, sendMessage, clearError } = useChat(activeId, updateTitle);
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
        const newId = createConversation();
        setTimeout(() => sendMessage(pending), 100);
      } else {
        setTimeout(() => sendMessage(pending), 50);
      }
    }
  }, [activeId, sendMessage, createConversation]);

  // Scroll to bottom only when messages array changes (user sent or response completed)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up staged image previews on unmount or clear
  useEffect(() => {
    return () => {
      stagedImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [stagedImages]);

  const handleNewChat = useCallback(() => {
    createConversation();
    setSidebarOpen(false);
  }, [createConversation]);

  const handleSelectChat = useCallback((id) => {
    setActiveId(id);
    setSidebarOpen(false);
  }, [setActiveId]);

  // Image staging
  const addImages = useCallback((files) => {
    const validFiles = [];
    for (const file of files) {
      const err = validateImage(file);
      if (err) {
        // Skip invalid files silently for drag-drop, could show toast later
        continue;
      }
      validFiles.push(file);
    }

    setStagedImages(prev => {
      const countErr = validateImageCount(prev.length, validFiles.length);
      if (countErr) return prev; // cap at max

      const newImages = validFiles.map(file => ({
        id: ++nextImageId,
        file,
        preview: URL.createObjectURL(file),
      }));
      return [...prev, ...newImages];
    });
  }, []);

  const removeImage = useCallback((id) => {
    setStagedImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter(i => i.id !== id);
    });
  }, []);

  // Wrapped send that includes staged images then clears them
  const handleSend = useCallback((text, imageFiles = []) => {
    sendMessage(text, imageFiles);
    setStagedImages(prev => {
      prev.forEach(img => URL.revokeObjectURL(img.preview));
      return [];
    });
  }, [sendMessage]);

  // Page-level drag and drop
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (dragCounter.current === 1) setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      addImages(files);
    }
  }, [addImages]);

  const inputDisabled = isStreaming || isUploading;

  return (
    <div
      className={`chat-page ${sidebarOpen ? 'sidebar-open' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <a href="#chat-main" className="skip-link">Skip to content</a>
      <ChatSidebar
        isOpen={sidebarOpen}
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelectChat}
        onNew={handleNewChat}
        onClose={() => setSidebarOpen(false)}
      />

      <nav className="chat-nav" aria-label="Chat navigation">
        <button
          className="home-nav-btn"
          onClick={() => setSidebarOpen(prev => !prev)}
          title={sidebarOpen ? 'Close menu' : 'Menu'}
          aria-label={sidebarOpen ? 'Close conversation list' : 'Open conversation list'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      <main id="chat-main" className="chat-messages" ref={messagesContainerRef} style={{ position: 'relative' }}>
        {isDragging && (
          <div className="chat-drop-overlay" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="chat-drop-overlay-text">Drop images here</span>
          </div>
        )}

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

      <ChatInput
        onSend={handleSend}
        disabled={inputDisabled}
        stagedImages={stagedImages}
        onAddImages={addImages}
        onRemoveImage={removeImage}
      />

      {isUploading && (
        <div className="chat-upload-indicator" role="status" aria-live="polite">
          Uploading images...
        </div>
      )}
    </div>
  );
}
