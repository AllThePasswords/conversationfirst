import { useState, useEffect, useRef, useCallback } from 'react'
import { CheckIcon } from '@heroicons/react/20/solid'
import WaveformVisualizer from './WaveformVisualizer'
import { formatDuration } from '../lib/storage'

interface RecordingViewProps {
  deepgramKey: string
  onComplete: (rawTranscript: string, durationMs: number) => void
  onCancel: () => void
}

export default function RecordingView({ deepgramKey, onComplete, onCancel }: RecordingViewProps) {
  const [listening, setListening] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [transcript, setTranscript] = useState('')
  const [interim, setInterim] = useState('')
  const [elapsed, setElapsed] = useState(0)

  const socketRef = useRef<WebSocket | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const transcriptRef = useRef('')
  const startTimeRef = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll transcript
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcript, interim])

  // Duration timer
  useEffect(() => {
    if (!listening) return
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current)
    }, 1000)
    return () => clearInterval(interval)
  }, [listening])

  const stopListening = useCallback(() => {
    const s = streamRef.current
    streamRef.current = null

    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
    }
    if (socketRef.current) {
      socketRef.current.close()
      socketRef.current = null
    }
    if (s) {
      s.getTracks().forEach(track => track.stop())
    }
    setListening(false)
  }, [])

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      startTimeRef.current = Date.now()

      const dgUrl =
        'wss://api.deepgram.com/v1/listen?' +
        'model=nova-3&' +
        'punctuate=true&' +
        'interim_results=true&' +
        'utterance_end_ms=1500&' +
        'smart_format=true'

      const socket = new WebSocket(dgUrl, ['token', deepgramKey])
      socketRef.current = socket

      socket.onopen = () => {
        setListening(true)
        setErrorMsg(null)

        const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
        recorderRef.current = recorder
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data)
          }
        }
        recorder.start(250)
      }

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        const alt = data.channel?.alternatives?.[0]
        const text = alt?.transcript as string | undefined

        if (text) {
          if (data.is_final && text.trim().length > 0) {
            const finalText = text.trim()
            transcriptRef.current += (transcriptRef.current ? ' ' : '') + finalText
            setTranscript(transcriptRef.current)
            setInterim('')
          } else if (!data.is_final) {
            setInterim(text.trim())
          }
        }
      }

      socket.onerror = () => {
        setErrorMsg('Connection error. Check your API key and internet connection.')
      }

      socket.onclose = () => {
        if (streamRef.current?.active) {
          setTimeout(() => {
            if (streamRef.current?.active) startListening()
          }, 3000)
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setErrorMsg('Microphone access denied. Allow mic access in System Settings \u203a Privacy \u203a Microphone.')
      } else {
        setErrorMsg(`Error: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
  }, [deepgramKey])

  // Auto-start on mount
  useEffect(() => {
    startListening()
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
      socketRef.current?.close()
      if (recorderRef.current?.state !== 'inactive') recorderRef.current?.stop()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleDone() {
    const finalTranscript = transcriptRef.current
    const duration = Date.now() - startTimeRef.current
    stopListening()
    onComplete(finalTranscript, duration)
  }

  function handleCancel() {
    stopListening()
    onCancel()
  }

  return (
    <div className="vc-recording">
      <div className="vc-waveform-container">
        <WaveformVisualizer stream={streamRef.current} active={listening} />
      </div>

      <div className="vc-recording-timer">{formatDuration(elapsed)}</div>

      {errorMsg && <div className="vc-error-msg">{errorMsg}</div>}

      <div className="vc-recording-transcript" ref={scrollRef}>
        {transcript || interim ? (
          <>
            <p className="vc-transcript-final">{transcript}</p>
            {interim && <span className="vc-transcript-interim"> {interim}</span>}
          </>
        ) : (
          <p className="vc-transcript-placeholder">Start speaking\u2026</p>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="vc-recording-actions">
        <button className="vc-btn-cancel" onClick={handleCancel}>Cancel</button>
        <button
          className="vc-btn-done"
          onClick={handleDone}
          disabled={!transcript.trim()}
        >
          <CheckIcon width={16} height={16} aria-hidden="true" />
          Done
        </button>
      </div>
    </div>
  )
}
