import { useEffect, useRef, useCallback, useState } from 'react';
import { useChat } from '../../hooks/useChat';
import ChatMessage from '../ChatMessage';
import ChatProcessing from '../ChatProcessing';
import MarkdownRenderer from '../MarkdownRenderer';

export default function PrepChat({ companyId, placeholder }) {
  const conversationId = `prep-${companyId}`;
  const { messages, isStreaming, isSearching, streamingContent, error, sendMessage, clearError } =
    useChat(conversationId, null);

  const messagesEndRef = useRef(null);
  const [text, setText] = useState('');
  const textareaRef = useRef(null);
  const lastMessageRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, []);

  const handleSend = useCallback(() => {
    if (!text.trim() || isStreaming) return;
    lastMessageRef.current = text;
    sendMessage(text);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [text, isStreaming, sendMessage]);

  const handleRetry = useCallback(() => {
    // Remove the last user message that failed (no assistant response follows it)
    const stored = JSON.parse(localStorage.getItem(`cf-chat-${conversationId}`) || '[]');
    if (stored.length > 0 && stored[stored.length - 1].role === 'user') {
      const lastText = typeof stored[stored.length - 1].content === 'string'
        ? stored[stored.length - 1].content
        : '';
      stored.pop();
      localStorage.setItem(`cf-chat-${conversationId}`, JSON.stringify(stored));
      clearError();
      // Re-send the message
      if (lastText) {
        setTimeout(() => sendMessage(lastText), 50);
      }
    }
  }, [conversationId, clearError, sendMessage]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleClear = useCallback(() => {
    localStorage.removeItem(`cf-chat-${conversationId}`);
    window.location.reload();
  }, [conversationId]);

  const canSend = !isStreaming && text.trim();

  return (
    <div className="prep-chat">
      <div className="prep-chat-header">
        <h3>Ask about this prep</h3>
        {messages.length > 0 && (
          <button
            className="prep-chat-clear"
            onClick={handleClear}
            title="Clear conversation"
            type="button"
          >
            Clear
          </button>
        )}
      </div>

      {messages.length === 0 && !isStreaming && !error && (
        <div className="prep-chat-empty">
          {placeholder || 'Ask a question about this company, your talking points, or practice an answer.'}
        </div>
      )}

      {messages.length > 0 && (
        <div className="prep-chat-messages">
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}

          {isStreaming && streamingContent && (
            <div className="chat-bubble">
              <div className="bubble-label">Assistant</div>
              <MarkdownRenderer content={streamingContent} />
              <span className="streaming-cursor" />
            </div>
          )}

          {isStreaming && !streamingContent && (
            <ChatProcessing />
          )}

          {isSearching && (
            <div className="prep-chat-searching">Searching the web...</div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {error && (
        <div className="prep-chat-error">
          <span>Something went wrong. Try again or clear the conversation.</span>
          <div className="prep-chat-error-actions">
            <button onClick={handleRetry} type="button">Retry</button>
            <button onClick={handleClear} type="button">Clear</button>
            <button onClick={clearError} type="button">Dismiss</button>
          </div>
        </div>
      )}

      <div className="prep-chat-input">
        <div className="chat-input-inner">
          <div className="chat-input-body">
            <textarea
              ref={textareaRef}
              className="chat-input-field"
              placeholder={placeholder || 'Ask a question...'}
              aria-label="Message input"
              value={text}
              onChange={(e) => { setText(e.target.value); resize(); }}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
              rows={1}
            />
          </div>
          <button
            className="chat-send-btn"
            onClick={handleSend}
            disabled={!canSend}
            title="Send"
            aria-label="Send message"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
