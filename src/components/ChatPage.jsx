import { useState, useEffect, useRef, useCallback } from 'react';
import { useChat } from '../hooks/useChat';
import { useChatHistory } from '../hooks/useChatHistory';
import ChatMessage from './ChatMessage';
import ChatProcessing from './ChatProcessing';
import ChatInput from './ChatInput';
import ChatSidebar from './ChatSidebar';
import MarkdownRenderer from './MarkdownRenderer';

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { conversations, activeId, setActiveId, createConversation, updateTitle, deleteConversation } = useChatHistory();

  // Auto-create first conversation if none exists
  useEffect(() => {
    if (!activeId && conversations.length === 0) {
      createConversation();
    }
  }, [activeId, conversations.length, createConversation]);

  const { messages, isStreaming, streamingContent, error, sendMessage, clearError } = useChat(activeId, updateTitle);
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
      <ChatSidebar
        isOpen={sidebarOpen}
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelectChat}
        onNew={handleNewChat}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="chat-header">
        <button className="chat-menu-btn" onClick={() => setSidebarOpen(true)} title="Conversations">
          ☰
        </button>
        <div className="chat-header-title">
          <a href="#/">Conversation First</a>
        </div>
        <button className="chat-menu-btn" onClick={handleNewChat} title="New chat">
          +
        </button>
      </div>

      <div className="chat-messages" ref={messagesContainerRef}>
        <div className="chat-messages-inner">
          {messages.length === 0 && !isStreaming ? (
            <div className="chat-welcome">
              <h2>Conversation First</h2>
              <p>The AI is a computer. Ask a question.</p>
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <ChatMessage key={i} message={m} />
              ))}

              {isStreaming && (
                <div className="chat-bubble">
                  <div className="bubble-label">Assistant</div>
                  {streamingContent ? (
                    <div>
                      <MarkdownRenderer content={streamingContent} />
                      <span className="streaming-cursor" />
                    </div>
                  ) : (
                    <ChatProcessing />
                  )}
                </div>
              )}

              {error && (
                <div className="alert alert-destructive" style={{ cursor: 'pointer' }} onClick={clearError}>
                  <div><strong>Error:</strong> {error}</div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      <ChatInput onSend={sendMessage} disabled={isStreaming} />
    </div>
  );
}
