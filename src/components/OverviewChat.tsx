import { useState, useCallback, useRef, useEffect } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { streamResponse } from '../lib/streamResponse'
import OverviewPage from './OverviewPage'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import ChatProcessing from './ChatProcessing'
import MarkdownRenderer from './MarkdownRenderer'

/**
 * OverviewChat — wraps the Design System page with an ephemeral chat.
 * Messages live in React state only — nothing is persisted.
 */
export default function OverviewChat() {
  const [messages, setMessages] = useState<any[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const accumulatorRef = useRef('')
  const citationsRef = useRef<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLElement>(null)

  const chatActive = messages.length > 0 || isStreaming

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  const handleSend = useCallback((text: string) => {
    if (!text.trim()) return

    const userMsg = { role: 'user', content: text.trim(), timestamp: Date.now() }
    const updated = [...messages, userMsg]
    setMessages(updated)

    setIsStreaming(true)
    setStreamingContent('')
    setError(null)
    accumulatorRef.current = ''
    citationsRef.current = []

    const apiMessages = updated.map(m => ({ role: m.role, content: m.content }))

    streamResponse(apiMessages, {
      onChunk(chunk: string) {
        accumulatorRef.current += chunk
        setStreamingContent(accumulatorRef.current)
      },
      onSearchStart() {
        setIsSearching(true)
      },
      onSearchDone(results: any[]) {
        setIsSearching(false)
        if (Array.isArray(results)) {
          for (const r of results) {
            if (r.type === 'web_search_result' && r.url) {
              citationsRef.current.push({ url: r.url, title: r.title || r.url })
            }
          }
        }
      },
      onContentBlock() {},
      onDone() {
        const assistantMsg = {
          role: 'assistant',
          content: accumulatorRef.current,
          citations: citationsRef.current.length > 0 ? citationsRef.current : undefined,
          timestamp: Date.now(),
        }
        setMessages(prev => [...prev, assistantMsg])
        setIsStreaming(false)
        setIsSearching(false)
        setStreamingContent('')
      },
      onError(errMsg: string) {
        setError(errMsg)
        setIsStreaming(false)
        setIsSearching(false)
        setStreamingContent('')
      },
    }, null, [])
  }, [messages])

  const handleClose = useCallback(() => {
    setMessages([])
    setIsStreaming(false)
    setIsSearching(false)
    setStreamingContent('')
    setError(null)
  }, [])

  return (
    <>
      {chatActive ? (
        <div className="chat-page">
          <main className="chat-messages" ref={messagesContainerRef}>
            <div className="chat-messages-inner">
              <div className="chat-inline-header">
                <button
                  className="chat-header-back"
                  onClick={handleClose}
                  aria-label="Back to design system"
                  type="button"
                >
                  <ArrowLeftIcon width={14} height={14} />
                </button>
                <div className="chat-header-title">Design System Chat</div>
              </div>
              {messages.map((m, i) => (
                <ChatMessage key={i} message={m} />
              ))}

              {isStreaming && (
                <div className="chat-bubble streaming">
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
                    <div className="streaming-content">
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
                    onClick={() => setError(null)}
                    aria-label="Dismiss error"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'var(--text-lg)', padding: 'var(--space-1)', lineHeight: 1 }}
                  >
                    ✕
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </main>

          <ChatInput onSend={handleSend} disabled={isStreaming} variant="floating" />
        </div>
      ) : (
        <>
          <OverviewPage />
          <ChatInput onSend={handleSend} variant="floating" />
        </>
      )}
    </>
  )
}
