import { useState, useRef, useEffect } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/20/solid'
import { supabase } from '../../../lib/supabase'
import { useSlides, useActions } from '../lib/presentationStore'
import type { Slide } from '../lib/types'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

function buildPresentationContext(slides: Slide[]): string {
  return slides.map((slide, i) => {
    const hasTalkTrack = slide.talkTrack?.trim()
    const hasContent = slide.canvasJson && slide.canvasJson.length > 100
    return `Slide ${i + 1}: ${hasContent ? 'Has visual content' : 'Empty'}${hasTalkTrack ? ` | Talk track: "${slide.talkTrack!.slice(0, 200)}"` : ' | No talk track'}`
  }).join('\n')
}

export default function GlobalChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const slides = useSlides()
  const actions = useActions()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    if (!input.trim() || isStreaming) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsStreaming(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Not authenticated. Sign in to use the AI assistant.',
        }])
        return
      }

      const context = buildPresentationContext(slides)

      const promptText = [
        `You are the FullyPresent AI assistant. The user is building a presentation with ${slides.length} slides.`,
        '',
        'Current presentation state:',
        context,
        '',
        `The user says: "${userMessage.content}"`,
        '',
        'Instructions:',
        '- If the user asks to create slides, respond with the talk tracks for each slide, numbered.',
        '- If the user asks to modify talk tracks, respond with the updated versions.',
        '- If the user gives a topic or overview, generate an outline with talk tracks for each slide.',
        '- Use the format "SLIDE N: [talk track text]" when providing talk tracks so they can be applied.',
        '- Be concise and direct in your responses.',
      ].join('\n')

      const response = await supabase.functions.invoke('generate-talk-track', {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: {
          prompt: promptText,
          currentTalkTrack: '',
          slideContent: context,
          prevSlideContent: '',
          nextSlideContent: '',
        },
      })

      if (response.error) {
        throw new Error(response.error.message || 'Generation failed')
      }

      const responseText = typeof response.data === 'string' ? response.data : response.data?.text || 'No response generated.'

      // Parse response for SLIDE N: patterns and apply talk tracks
      const slidePattern = /SLIDE\s+(\d+):\s*([\s\S]*?)(?=SLIDE\s+\d+:|$)/gi
      let match
      let appliedCount = 0

      while ((match = slidePattern.exec(responseText)) !== null) {
        const slideNum = parseInt(match[1], 10)
        const talkTrack = match[2].trim()
        const slideIndex = slideNum - 1

        if (slideIndex >= 0 && talkTrack) {
          // Create slides if they don't exist yet
          while (slideIndex >= slides.length + appliedCount) {
            actions.addSlide()
            appliedCount++
          }
          actions.setSlideTalkTrack(slideIndex, talkTrack)
        }
      }

      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: responseText,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Error: ${(err as Error).message}`,
      }])
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <div className="fp-panel fp-chat-panel">
      <div className="fp-panel-header">
        <span className="fp-panel-title">Assistant</span>
        <span className="fp-panel-meta">{slides.length} {slides.length === 1 ? 'slide' : 'slides'}</span>
      </div>
      <div className="fp-chat-messages">
        {messages.length === 0 && (
          <div className="fp-chat-empty">
            <p>Describe your presentation and the assistant will create slides with talk tracks.</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`fp-chat-msg fp-chat-msg--${msg.role}`}>
            <div className="fp-chat-msg-bubble">
              {msg.content}
            </div>
          </div>
        ))}
        {isStreaming && (
          <div className="fp-chat-msg fp-chat-msg--assistant">
            <div className="fp-chat-msg-bubble">
              <span className="cf-loading-cursor" />
              <span className="fp-chat-streaming-text">Generating</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="fp-chat-input-bar">
        <input
          type="text"
          className="fp-chat-input-field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Describe your presentation..."
          disabled={isStreaming}
          aria-label="Chat with assistant"
        />
        <button
          className="fp-chat-send-btn"
          onClick={handleSend}
          disabled={isStreaming || !input.trim()}
          aria-label="Send"
        >
          <PaperAirplaneIcon aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
