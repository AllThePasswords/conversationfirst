import { useState, useEffect, useRef, useCallback } from 'react'
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  SpeakerWaveIcon,
  SparklesIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/20/solid'
import { supabase } from '../../../lib/supabase'
import CfSelect from '../../../components/CfSelect'
import type { Connection } from '../../../lib/types'

interface WordTiming {
  word: string
  startTime: number
  endTime: number
  charStart: number
  charEnd: number
}

interface Voice {
  id: string
  name: string
  category: string
  previewUrl?: string
}

interface TalkTrackPanelProps {
  value: string
  onChange: (value: string) => void
  slideNumber: number
  totalSlides: number
  slideContent: string
  prevSlideContent: string
  nextSlideContent: string
  apiConnections: Connection[]
}

const AI_PROMPTS = [
  { label: 'Shorter', prompt: 'Make it shorter and more concise' },
  { label: 'Punchy', prompt: 'Make it more punchy and energetic' },
  { label: 'Formal', prompt: 'Make it more formal and professional' },
  { label: 'Add stat', prompt: 'Add a relevant statistic or data point' },
  { label: 'Energy', prompt: 'Add more energy and enthusiasm' },
  { label: 'Simplify', prompt: 'Simplify the language, make it clearer' },
]

export default function TalkTrackPanel({
  value,
  onChange,
  slideNumber,
  totalSlides,
  slideContent,
  prevSlideContent,
  nextSlideContent,
  apiConnections,
}: TalkTrackPanelProps) {
  const [aiStreaming, setAiStreaming] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')
  const [voices, setVoices] = useState<Voice[]>([])
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const [wordTimings, setWordTimings] = useState<WordTiming[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animFrameRef = useRef<number>(0)
  const abortRef = useRef<AbortController | null>(null)

  const hasElevenlabs = apiConnections.some(c => c.provider_name === 'elevenlabs' && c.status === 'active')

  // Fetch voices on mount if ElevenLabs is connected
  useEffect(() => {
    if (!hasElevenlabs) return
    async function loadVoices() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return
        const response = await supabase.functions.invoke('list-voices', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (response.data?.voices) {
          setVoices(response.data.voices)
          if (!selectedVoiceId && response.data.voices.length > 0) {
            setSelectedVoiceId(response.data.voices[0].id)
          }
        }
      } catch {
        // Silently fail -- voices are optional
      }
    }
    loadVoices()
  }, [hasElevenlabs]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0
  const estimatedMinutes = (wordCount / 150).toFixed(1)

  // AI talk track generation
  async function handleAiPrompt(prompt: string) {
    if (aiStreaming) return
    setAiStreaming(true)
    abortRef.current = new AbortController()

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await supabase.functions.invoke('generate-talk-track', {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: {
          prompt,
          currentTalkTrack: value,
          slideContent,
          prevSlideContent,
          nextSlideContent,
        },
      })

      if (response.error) {
        console.error('AI generation failed:', response.error)
        return
      }

      // Edge function returns streamed text as a string
      if (response.data) {
        onChange(typeof response.data === 'string' ? response.data : response.data.text || value)
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('AI generation error:', err)
      }
    } finally {
      setAiStreaming(false)
      abortRef.current = null
    }
  }

  // Voice synthesis
  async function handlePlay() {
    if (!value.trim() || !selectedVoiceId || !hasElevenlabs) return

    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      cancelAnimationFrame(animFrameRef.current)
      return
    }

    setIsSynthesizing(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await supabase.functions.invoke('synthesize-voice', {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { text: value, voiceId: selectedVoiceId },
      })

      if (response.error || !response.data?.audio) {
        console.error('Voice synthesis failed:', response.error)
        return
      }

      const { audio: base64Audio, wordTimings: timings, duration: dur } = response.data
      setWordTimings(timings || [])
      setDuration(dur || 0)

      // Create audio element
      if (audioRef.current) {
        audioRef.current.pause()
      }
      const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`)
      audioRef.current = audio

      audio.onended = () => {
        setIsPlaying(false)
        setCurrentTime(0)
        cancelAnimationFrame(animFrameRef.current)
      }

      audio.play()
      setIsPlaying(true)

      // Track playback time
      function tick() {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime)
          animFrameRef.current = requestAnimationFrame(tick)
        }
      }
      animFrameRef.current = requestAnimationFrame(tick)
    } catch (err) {
      console.error('Synthesis error:', err)
    } finally {
      setIsSynthesizing(false)
    }
  }

  const handleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setIsPlaying(false)
    setCurrentTime(0)
    setWordTimings([])
    cancelAnimationFrame(animFrameRef.current)
  }, [])

  // Build highlighted text from word timings
  function renderHighlightedText() {
    if (!wordTimings.length || !isPlaying) return null

    return (
      <div className="fp-talktrack-highlighted" aria-hidden="true">
        {wordTimings.map((wt, i) => {
          const isActive = currentTime >= wt.startTime && currentTime < wt.endTime
          const isPast = currentTime >= wt.endTime
          return (
            <span
              key={i}
              className={`fp-talktrack-word${isActive ? ' fp-talktrack-word--active' : ''}${isPast ? ' fp-talktrack-word--past' : ''}`}
            >
              {wt.word}{' '}
            </span>
          )
        })}
      </div>
    )
  }

  return (
    <div className="fp-panel">
      <div className="fp-panel-header">
        <span className="fp-panel-title">Talk track</span>
        <span className="fp-panel-meta">
          Slide {slideNumber} of {totalSlides}
        </span>
      </div>
      <div className="fp-panel-body">
        {/* AI quick prompts */}
        <div className="fp-talktrack-ai">
          <div className="fp-talktrack-ai-label">
            <SparklesIcon aria-hidden="true" />
            <span>AI edit</span>
          </div>
          <div className="fp-talktrack-prompts">
            {AI_PROMPTS.map(({ label, prompt }) => (
              <button
                key={label}
                className="fp-talktrack-prompt-btn"
                onClick={() => handleAiPrompt(prompt)}
                disabled={aiStreaming}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="fp-talktrack-custom-input">
            <input
              type="text"
              className="fp-talktrack-custom-field"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customPrompt.trim() && !aiStreaming) {
                  handleAiPrompt(customPrompt.trim())
                  setCustomPrompt('')
                }
              }}
              placeholder="Custom instruction..."
              disabled={aiStreaming}
              aria-label="Custom AI instruction"
            />
            <button
              className="fp-talktrack-custom-send"
              onClick={() => {
                if (customPrompt.trim() && !aiStreaming) {
                  handleAiPrompt(customPrompt.trim())
                  setCustomPrompt('')
                }
              }}
              disabled={aiStreaming || !customPrompt.trim()}
              aria-label="Send instruction"
            >
              <PaperAirplaneIcon aria-hidden="true" />
            </button>
          </div>
          {aiStreaming && (
            <div className="fp-talktrack-ai-status" role="status">
              <span className="fp-loading-cursor" />
              <span>Generating</span>
            </div>
          )}
        </div>

        {/* Textarea */}
        <textarea
          className="fp-talktrack-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write what you will say during this slide"
          aria-label="Talk track for current slide"
        />

        {/* Word highlighting overlay during playback */}
        {renderHighlightedText()}

        {/* Meta info */}
        <div className="fp-talktrack-meta">
          <span>{wordCount} words</span>
          <span>{estimatedMinutes} min</span>
        </div>

        {/* Voice preview */}
        {hasElevenlabs ? (
          <div className="fp-talktrack-voice">
            <div className="fp-talktrack-voice-row">
              <CfSelect
                value={selectedVoiceId}
                onChange={setSelectedVoiceId}
                options={voices.map(v => ({ value: v.id, label: v.name }))}
                aria-label="Voice"
                className="fp-talktrack-voice-cf-select"
              />
              <button
                className="fp-talktrack-play-btn"
                onClick={handlePlay}
                disabled={isSynthesizing || !value.trim()}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isSynthesizing ? (
                  <SpeakerWaveIcon aria-hidden="true" />
                ) : isPlaying ? (
                  <PauseIcon aria-hidden="true" />
                ) : (
                  <PlayIcon aria-hidden="true" />
                )}
              </button>
              {isPlaying && (
                <button
                  className="fp-talktrack-stop-btn"
                  onClick={handleStop}
                  aria-label="Stop"
                >
                  <StopIcon aria-hidden="true" />
                </button>
              )}
            </div>
            {isPlaying && duration > 0 && (
              <div className="fp-talktrack-progress">
                <div
                  className="fp-talktrack-progress-bar"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="fp-talktrack-connect-hint">
            Add an ElevenLabs API connection in the Vault to preview voice.
          </div>
        )}
      </div>
    </div>
  )
}
