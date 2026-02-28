// useChat hook — multi-threaded chat with SSE streaming
// Manages conversation state, thread switching, and message persistence.

import { useState, useRef, useCallback, useEffect } from 'react'
import { supabase } from './supabase'
import { useHousehold } from './useHousehold'
import { fetchThreads, fetchMessages, createThread, saveMessage } from './chat'
import type { ChatThread } from './types'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  tools?: string[]
}

interface UseChatOptions {
  sourceApp?: string
  screenContext?: string | null
  autoLoad?: boolean
}

declare global {
  interface Window {
    __CF_SCREEN_CONTEXT?: string
  }
}

export function useChat(opts: UseChatOptions = {}) {
  const { sourceApp = 'conversationfirst', screenContext, autoLoad = true } = opts
  const { householdId } = useHousehold()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Load threads on mount
  useEffect(() => {
    if (!householdId || !autoLoad) return
    let cancelled = false

    async function init() {
      try {
        const threadList = await fetchThreads(householdId!, { limit: 20 })
        if (cancelled) return
        setThreads(threadList)

        if (threadList.length > 0) {
          const thread = threadList[0]
          setActiveThreadId(thread.id)
          const msgs = await fetchMessages(thread.id)
          if (!cancelled) {
            setMessages(msgs.map(m => ({
              id: m.id,
              role: m.role,
              content: m.content,
              tools: m.tool_calls || undefined,
            })))
          }
        } else {
          const thread = await createThread(householdId!, sourceApp)
          if (!cancelled) {
            setActiveThreadId(thread.id)
            setThreads([thread])
          }
        }
      } catch (err) {
        console.error('Failed to load chat threads:', err)
        setError(err instanceof Error ? err.message : 'Failed to load chat threads')
      }
    }

    init()
    return () => { cancelled = true }
  }, [householdId, autoLoad, sourceApp])

  const loadThread = useCallback(async (threadId: string) => {
    setActiveThreadId(threadId)
    setMessages([])
    setError(null)

    try {
      const msgs = await fetchMessages(threadId)
      setMessages(msgs.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        tools: m.tool_calls || undefined,
      })))
    } catch (err) {
      console.error('Failed to load messages:', err)
      setError(err instanceof Error ? err.message : 'Failed to load messages')
    }
  }, [])

  async function handleThreadChange(threadId: string) {
    if (threadId === activeThreadId || streaming) return
    await loadThread(threadId)
  }

  async function handleNewThread() {
    if (!householdId || streaming) return

    try {
      const thread = await createThread(householdId, sourceApp)
      setThreads(prev => [thread, ...prev])
      setActiveThreadId(thread.id)
      setMessages([])
      setError(null)
      return thread.id
    } catch (err) {
      console.error('Failed to create thread:', err)
      return null
    }
  }

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }, [])

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setStreaming(false)
  }, [])

  const sendMessage = useCallback(async (overrideThreadId?: string) => {
    const text = input.trim()
    if (!text || streaming || !householdId) return null

    const threadId = overrideThreadId || activeThreadId
    if (!threadId) return null

    setInput('')
    setError(null)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    }

    const assistantMsg: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      tools: [],
    }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setStreaming(true)

    // Persist user message
    try {
      const saved = await saveMessage(threadId, householdId, 'user', text)
      userMsg.id = saved.id
    } catch {
      // Non-fatal: message still sent to API
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Not authenticated')
        setStreaming(false)
        return threadId
      }

      const apiMessages = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }))

      const abortController = new AbortController()
      abortRef.current = abortController

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const response = await fetch(`${supabaseUrl}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          messages: apiMessages,
          thread_id: threadId,
          screen_context: window.__CF_SCREEN_CONTEXT || screenContext || undefined,
        }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Chat failed' }))
        throw new Error(errData.error || `HTTP ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const decoder = new TextDecoder()
      let buffer = ''
      let fullContent = ''
      const toolsUsed: string[] = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (!data) continue

          try {
            const event = JSON.parse(data)

            if (event.type === 'text') {
              fullContent += event.text
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantMsg.id
                    ? { ...m, content: m.content + event.text }
                    : m
                )
              )
            }

            if (event.type === 'tool_use') {
              toolsUsed.push(event.name)
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantMsg.id
                    ? { ...m, tools: [...(m.tools || []), event.name] }
                    : m
                )
              )
            }

            if (event.type === 'done') {
              break
            }
          } catch {
            // Skip malformed events
          }
        }
      }

      // Persist assistant message
      try {
        const saved = await saveMessage(
          threadId, householdId, 'assistant', fullContent, toolsUsed
        )
        assistantMsg.id = saved.id
      } catch {
        // Non-fatal
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // User stopped streaming
      } else {
        setError(err instanceof Error ? err.message : 'Chat failed')
        setMessages(prev =>
          prev.filter(m => m.id !== assistantMsg.id || m.content.length > 0)
        )
      }
    } finally {
      setStreaming(false)
      abortRef.current = null
    }

    return threadId
  }, [input, streaming, messages, screenContext, householdId, activeThreadId])

  // Send a message directly without relying on `input` state.
  // Accepts optional contentBlocks for multimodal messages (text + images).
  // Only the text portion is persisted to the DB; contentBlocks are sent to the API only.
  const sendDirect = useCallback(async (
    text: string,
    overrideThreadId?: string,
    contentBlocks?: unknown[]
  ) => {
    if (!text.trim() || streaming || !householdId) return null

    const threadId = overrideThreadId || activeThreadId
    if (!threadId) return null

    setError(null)

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    }

    const assistantMsg: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      tools: [],
    }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setStreaming(true)

    // Persist text-only version to DB
    try {
      const saved = await saveMessage(threadId, householdId, 'user', text)
      userMsg.id = saved.id
    } catch {
      // Non-fatal
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Not authenticated')
        setStreaming(false)
        return threadId
      }

      // Build API messages — use contentBlocks for the latest user message if provided
      const priorMessages = messages.map(m => ({ role: m.role, content: m.content }))
      const latestUserContent = contentBlocks || text
      const apiMessages = [...priorMessages, { role: 'user', content: latestUserContent }]

      const abortController = new AbortController()
      abortRef.current = abortController

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const response = await fetch(`${supabaseUrl}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          messages: apiMessages,
          thread_id: threadId,
          screen_context: window.__CF_SCREEN_CONTEXT || screenContext || undefined,
        }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Chat failed' }))
        throw new Error(errData.error || `HTTP ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const decoder = new TextDecoder()
      let buffer = ''
      let fullContent = ''
      const toolsUsed: string[] = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (!data) continue

          try {
            const event = JSON.parse(data)

            if (event.type === 'text') {
              fullContent += event.text
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantMsg.id
                    ? { ...m, content: m.content + event.text }
                    : m
                )
              )
            }

            if (event.type === 'tool_use') {
              toolsUsed.push(event.name)
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantMsg.id
                    ? { ...m, tools: [...(m.tools || []), event.name] }
                    : m
                )
              )
            }

            if (event.type === 'done') {
              break
            }
          } catch {
            // Skip malformed events
          }
        }
      }

      // Persist assistant response
      try {
        const saved = await saveMessage(
          threadId, householdId, 'assistant', fullContent, toolsUsed
        )
        assistantMsg.id = saved.id
      } catch {
        // Non-fatal
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // User stopped streaming
      } else {
        setError(err instanceof Error ? err.message : 'Chat failed')
        setMessages(prev =>
          prev.filter(m => m.id !== assistantMsg.id || m.content.length > 0)
        )
      }
    } finally {
      setStreaming(false)
      abortRef.current = null
    }

    return threadId
  }, [streaming, messages, screenContext, householdId, activeThreadId])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }, [sendMessage])

  return {
    input,
    setInput,
    messages,
    streaming,
    error,
    threads,
    activeThreadId,
    setActiveThreadId,
    textareaRef,
    messagesEndRef,
    handleInput,
    handleKeyDown,
    sendMessage,
    sendDirect,
    stopStreaming,
    handleThreadChange,
    handleNewThread,
    loadThread,
    householdId,
  }
}
