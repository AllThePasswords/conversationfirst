import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Canvas, FabricObject } from 'fabric'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/20/solid'
import { extractVideoFromCanvasJson, calculateVideoOverlayStyle } from '../lib/videoUtils'
import { supabase } from '../../../lib/supabase'
import type { VideoInfo } from '../lib/videoUtils'
import type { Slide, PresentationSettings } from '../lib/types'
import type { Connection } from '../../../lib/types'

const CANVAS_WIDTH = 1920
const CANVAS_HEIGHT = 1080
const BROADCAST_CHANNEL = 'fp-present-sync'

type PresentModeType = 'manual' | 'automatic'

interface PresentModeProps {
  slides: Slide[]
  initialSlideIndex: number
  settings: PresentationSettings
  apiConnections: Connection[]
  onExit: () => void
}

export default function PresentMode({
  slides,
  initialSlideIndex,
  settings,
  apiConnections,
  onExit,
}: PresentModeProps) {
  const [mode, setMode] = useState<PresentModeType | null>(null)
  const [currentIndex, setCurrentIndex] = useState(initialSlideIndex)
  const [canvasScale, setCanvasScale] = useState(1)
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Auto mode state
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [autoProgress, setAutoProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animFrameRef = useRef<number>(0)

  // Pop-out state
  const popoutRef = useRef<Window | null>(null)
  const channelRef = useRef<BroadcastChannel | null>(null)

  const canvasRef = useRef<Canvas | null>(null)
  const canvasElRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const currentSlide = slides[currentIndex]
  const hasElevenlabs = apiConnections.some(
    c => c.provider_name === 'elevenlabs' && c.status === 'active'
  )

  // BroadcastChannel for pop-out sync
  useEffect(() => {
    const channel = new BroadcastChannel(BROADCAST_CHANNEL)
    channelRef.current = channel

    channel.onmessage = (e) => {
      const { type, index } = e.data
      if (type === 'slide-change' && typeof index === 'number') {
        setCurrentIndex(index)
      } else if (type === 'exit') {
        onExit()
      }
    }

    return () => {
      channel.close()
      channelRef.current = null
    }
  }, [onExit])

  // Broadcast slide changes to pop-out window
  const broadcastSlideChange = useCallback((index: number) => {
    channelRef.current?.postMessage({ type: 'slide-change', index })
  }, [])

  // Navigation helpers
  const goToSlide = useCallback((index: number) => {
    if (index < 0 || index >= slides.length) return
    setCurrentIndex(index)
    broadcastSlideChange(index)
  }, [slides.length, broadcastSlideChange])

  const goNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      goToSlide(currentIndex + 1)
    }
  }, [currentIndex, slides.length, goToSlide])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1)
    }
  }, [currentIndex, goToSlide])

  // Initialize canvas
  useEffect(() => {
    if (!canvasElRef.current || !mode) return

    const canvas = new Canvas(canvasElRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      selection: false,
      renderOnAddRemove: true,
    })

    canvas.getObjects().forEach((obj: FabricObject) => {
      obj.set({ selectable: false, evented: false })
    })

    canvasRef.current = canvas
    return () => {
      canvas.dispose()
      canvasRef.current = null
    }
  }, [mode])

  // Load slide content
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !currentSlide) return

    setIsTransitioning(true)

    async function loadSlide() {
      try {
        if (currentSlide.canvasJson) {
          const json = JSON.parse(currentSlide.canvasJson)
          await canvas!.loadFromJSON(json)
          canvas!.getObjects().forEach((obj: FabricObject) => {
            obj.set({ selectable: false, evented: false })
          })
          canvas!.renderAll()
        } else {
          canvas!.clear()
          canvas!.backgroundColor = '#ffffff'
          canvas!.renderAll()
        }

        setVideoInfo(extractVideoFromCanvasJson(currentSlide.canvasJson))
      } catch {
        canvas!.clear()
        canvas!.backgroundColor = '#ffffff'
        canvas!.renderAll()
      } finally {
        setIsTransitioning(false)
      }
    }

    loadSlide()
  }, [currentSlide])

  // Resize handler
  useEffect(() => {
    if (!mode) return
    function updateScale() {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const scaleX = rect.width / CANVAS_WIDTH
      const scaleY = rect.height / CANVAS_HEIGHT
      setCanvasScale(Math.min(scaleX, scaleY))
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [mode])

  // Keyboard navigation
  useEffect(() => {
    if (!mode) return
    function handleKey(e: KeyboardEvent) {
      switch (e.key) {
        case 'Escape':
          onExit()
          break
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          if (currentIndex < slides.length - 1) goToSlide(currentIndex + 1)
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (currentIndex > 0) goToSlide(currentIndex - 1)
          break
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [mode, currentIndex, slides.length, onExit, goToSlide])

  // Auto mode: synthesize and play talk track
  useEffect(() => {
    if (mode !== 'automatic' || !currentSlide?.talkTrack?.trim()) return
    if (!hasElevenlabs || !settings.selectedVoiceId) return

    let cancelled = false

    async function playSlideAudio() {
      setIsAutoPlaying(true)
      setAutoProgress(0)

      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session || cancelled) return

        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ text: currentSlide.talkTrack, voiceId: settings.selectedVoiceId }),
        })

        const data = await res.json()
        if (cancelled || !res.ok || !data?.audio) return

        const { audio: base64Audio, duration: dur } = data
        const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`)
        audioRef.current = audio

        audio.onended = () => {
          if (cancelled) return
          setIsAutoPlaying(false)
          setAutoProgress(1)
          // Advance to next slide after a short pause
          setTimeout(() => {
            if (!cancelled && currentIndex < slides.length - 1) {
              goToSlide(currentIndex + 1)
            }
          }, 800)
        }

        audio.play()

        // Track progress
        function tick() {
          if (audioRef.current && dur > 0) {
            setAutoProgress(audioRef.current.currentTime / dur)
            animFrameRef.current = requestAnimationFrame(tick)
          }
        }
        animFrameRef.current = requestAnimationFrame(tick)
      } catch {
        setIsAutoPlaying(false)
      }
    }

    playSlideAudio()

    return () => {
      cancelled = true
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [mode, currentIndex, currentSlide, hasElevenlabs, settings.selectedVoiceId, slides.length, goToSlide])

  // Cleanup pop-out on exit
  useEffect(() => {
    return () => {
      if (popoutRef.current && !popoutRef.current.closed) {
        popoutRef.current.close()
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  // Pop-out speaker notes
  const handlePopout = useCallback(() => {
    if (popoutRef.current && !popoutRef.current.closed) {
      popoutRef.current.focus()
      return
    }

    const popup = window.open('', 'fp-speaker-notes', 'width=480,height=360,menubar=no,toolbar=no,location=no,status=no')
    if (!popup) return
    popoutRef.current = popup

    // Build the popup document using DOM manipulation
    buildSpeakerNotesPopup(popup, currentSlide, currentIndex, slides.length, BROADCAST_CHANNEL)
  }, [currentSlide, currentIndex, slides.length])

  // Update pop-out content when slide changes
  useEffect(() => {
    if (!popoutRef.current || popoutRef.current.closed) return

    const channel = channelRef.current
    if (channel) {
      channel.postMessage({
        type: 'slide-update',
        talkTrack: currentSlide?.talkTrack || '',
        slideNumber: currentIndex + 1,
        totalSlides: slides.length,
      })
    }

    // Also update button data-index for popup navigation
    try {
      const prevBtn = popoutRef.current.document.getElementById('prev-btn') as HTMLButtonElement | null
      const nextBtn = popoutRef.current.document.getElementById('next-btn') as HTMLButtonElement | null
      if (prevBtn) {
        prevBtn.dataset.index = String(currentIndex)
        prevBtn.disabled = currentIndex <= 0
      }
      if (nextBtn) {
        nextBtn.dataset.index = String(currentIndex)
        nextBtn.disabled = currentIndex >= slides.length - 1
      }
    } catch {
      // popup may have been closed
    }
  }, [currentIndex, currentSlide, slides.length])

  // Click to advance (manual mode only)
  const handleClick = useCallback(() => {
    if (mode === 'manual' && currentIndex < slides.length - 1) {
      goToSlide(currentIndex + 1)
    }
  }, [mode, currentIndex, slides.length, goToSlide])

  // Video overlay style
  const videoStyle = videoInfo
    ? calculateVideoOverlayStyle(videoInfo, canvasScale)
    : null

  // -------- Mode selection screen --------
  if (!mode) {
    return createPortal(
      <div className="fp-present-overlay fp-present-mode-select" onClick={(e) => e.stopPropagation()}>
        <div className="fp-mode-select-card">
          <div className="fp-mode-select-title">Present</div>
          <div className="fp-mode-select-options">
            <button
              className="fp-mode-option"
              onClick={() => setMode('manual')}
            >
              <span className="fp-mode-option-name">Manual</span>
              <span className="fp-mode-option-desc">You control the slides and read the talk track</span>
            </button>
            <button
              className="fp-mode-option"
              onClick={() => setMode('automatic')}
              disabled={!hasElevenlabs || !settings.selectedVoiceId}
            >
              <span className="fp-mode-option-name">Automatic</span>
              <span className="fp-mode-option-desc">
                {hasElevenlabs && settings.selectedVoiceId
                  ? 'ElevenLabs reads the talk track and advances slides'
                  : 'Requires ElevenLabs connection and voice selection'}
              </span>
            </button>
          </div>
          <button className="fp-mode-select-cancel" onClick={onExit}>
            Cancel
          </button>
        </div>
      </div>,
      document.body,
    )
  }

  // -------- Presentation view --------
  return createPortal(
    <div className="fp-present-overlay" onClick={handleClick} ref={containerRef}>
      <div
        className="fp-present-canvas-wrapper"
        style={{
          width: CANVAS_WIDTH * canvasScale,
          height: CANVAS_HEIGHT * canvasScale,
        }}
      >
        <canvas
          ref={canvasElRef}
          style={{
            width: CANVAS_WIDTH * canvasScale,
            height: CANVAS_HEIGHT * canvasScale,
          }}
        />

        {/* Video overlay for slides with embedded video */}
        {videoInfo && videoStyle && (
          <video
            ref={videoRef}
            src={videoInfo.videoUrl}
            autoPlay={videoInfo.autoplay}
            loop={videoInfo.loop}
            muted
            playsInline
            style={{
              position: 'absolute',
              left: videoStyle.left,
              top: videoStyle.top,
              width: videoStyle.width,
              height: videoStyle.height,
              borderRadius: videoStyle.borderRadius,
              objectFit: 'cover',
            }}
          />
        )}

        {isTransitioning && (
          <div className="fp-present-transition" />
        )}
      </div>

      {/* ESC hint */}
      <div className="fp-present-hint">
        ESC to exit
      </div>

      {/* Auto mode progress bar */}
      {mode === 'automatic' && isAutoPlaying && (
        <div className="fp-present-auto-progress">
          <div
            className="fp-present-auto-progress-bar"
            style={{ width: `${autoProgress * 100}%` }}
          />
        </div>
      )}

      {/* Speaker notes card (always visible in manual mode) */}
      {mode === 'manual' && (
        <div
          className="fp-speaker-notes"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="fp-speaker-notes-header">
            <span className="fp-speaker-notes-counter">
              {currentIndex + 1} of {slides.length}
            </span>
            <button
              className="fp-speaker-notes-popout"
              onClick={handlePopout}
              aria-label="Pop out speaker notes"
              title="Pop out to separate window"
            >
              <ArrowTopRightOnSquareIcon aria-hidden="true" />
            </button>
          </div>
          <div className="fp-speaker-notes-body">
            {currentSlide?.talkTrack || <span className="fp-speaker-notes-empty">No talk track for this slide</span>}
          </div>
          <div className="fp-speaker-notes-nav">
            <button
              className="fp-speaker-notes-nav-btn"
              onClick={goPrev}
              disabled={currentIndex === 0}
              aria-label="Previous slide"
            >
              <ArrowLeftIcon aria-hidden="true" />
            </button>
            <button
              className="fp-speaker-notes-nav-btn"
              onClick={goNext}
              disabled={currentIndex === slides.length - 1}
              aria-label="Next slide"
            >
              <ArrowRightIcon aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Slide counter for auto mode */}
      {mode === 'automatic' && (
        <div className="fp-present-counter">
          {currentIndex + 1} / {slides.length}
        </div>
      )}
    </div>,
    document.body,
  )
}

/**
 * Builds the pop-out speaker notes window using safe DOM manipulation.
 */
function buildSpeakerNotesPopup(
  popup: Window,
  currentSlide: Slide | undefined,
  currentIndex: number,
  totalSlides: number,
  broadcastChannelName: string,
): void {
  const doc = popup.document

  // Add styles
  const style = doc.createElement('style')
  style.textContent = [
    '* { margin: 0; padding: 0; box-sizing: border-box; }',
    'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #1c1c1a; color: #f0ede8; display: flex; flex-direction: column; height: 100vh; -webkit-font-smoothing: antialiased; }',
    '.header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #2a2a28; flex-shrink: 0; }',
    '.counter { font-family: "JetBrains Mono", monospace; font-size: 13px; color: #8a8884; }',
    '.body { flex: 1; overflow-y: auto; padding: 16px; font-size: 15px; line-height: 1.6; color: #f0ede8; }',
    '.empty { color: #8a8884; font-style: italic; }',
    '.nav { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid #2a2a28; flex-shrink: 0; }',
    '.nav button { flex: 1; padding: 8px; background: #242422; border: none; color: #c0bdb8; font-family: "JetBrains Mono", monospace; font-size: 13px; cursor: pointer; clip-path: polygon(6px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 6px); }',
    '.nav button:hover:not(:disabled) { color: #4a8070; }',
    '.nav button:disabled { opacity: 0.4; cursor: not-allowed; }',
  ].join('\n')
  doc.head.appendChild(style)
  doc.title = 'Speaker Notes'

  // Clear body safely
  while (doc.body.firstChild) {
    doc.body.removeChild(doc.body.firstChild)
  }

  // Header
  const header = doc.createElement('div')
  header.className = 'header'
  const counter = doc.createElement('span')
  counter.className = 'counter'
  counter.id = 'notes-counter'
  counter.textContent = `${currentIndex + 1} of ${totalSlides}`
  header.appendChild(counter)
  doc.body.appendChild(header)

  // Body
  const body = doc.createElement('div')
  body.className = 'body'
  body.id = 'notes-text'
  if (currentSlide?.talkTrack) {
    body.textContent = currentSlide.talkTrack
  } else {
    const emptySpan = doc.createElement('span')
    emptySpan.className = 'empty'
    emptySpan.textContent = 'No talk track for this slide'
    body.appendChild(emptySpan)
  }
  doc.body.appendChild(body)

  // Nav
  const nav = doc.createElement('div')
  nav.className = 'nav'
  const prevBtn = doc.createElement('button')
  prevBtn.id = 'prev-btn'
  prevBtn.dataset.index = String(currentIndex)
  prevBtn.textContent = 'Prev'
  if (currentIndex <= 0) prevBtn.disabled = true
  const nextBtn = doc.createElement('button')
  nextBtn.id = 'next-btn'
  nextBtn.dataset.index = String(currentIndex)
  nextBtn.textContent = 'Next'
  if (currentIndex >= totalSlides - 1) nextBtn.disabled = true
  nav.appendChild(prevBtn)
  nav.appendChild(nextBtn)
  doc.body.appendChild(nav)

  // Set up BroadcastChannel in popup via script
  const script = doc.createElement('script')
  script.textContent = [
    `var channel = new BroadcastChannel('${broadcastChannelName}');`,
    'channel.onmessage = function(e) {',
    '  if (e.data.type === "slide-update") {',
    '    document.getElementById("notes-text").textContent = e.data.talkTrack || "";',
    '    document.getElementById("notes-counter").textContent = e.data.slideNumber + " of " + e.data.totalSlides;',
    '    document.getElementById("prev-btn").disabled = e.data.slideNumber <= 1;',
    '    document.getElementById("next-btn").disabled = e.data.slideNumber >= e.data.totalSlides;',
    '  }',
    '};',
    'document.getElementById("prev-btn").addEventListener("click", function() {',
    '  channel.postMessage({ type: "slide-change", index: parseInt(this.dataset.index) - 1 });',
    '});',
    'document.getElementById("next-btn").addEventListener("click", function() {',
    '  channel.postMessage({ type: "slide-change", index: parseInt(this.dataset.index) + 1 });',
    '});',
    'window.addEventListener("beforeunload", function() { channel.close(); });',
    'document.addEventListener("keydown", function(e) {',
    '  if (e.key === "ArrowRight" || e.key === " ") {',
    '    e.preventDefault();',
    '    var next = document.getElementById("next-btn");',
    '    if (!next.disabled) channel.postMessage({ type: "slide-change", index: parseInt(next.dataset.index) });',
    '  }',
    '  if (e.key === "ArrowLeft") {',
    '    e.preventDefault();',
    '    var prev = document.getElementById("prev-btn");',
    '    if (!prev.disabled) channel.postMessage({ type: "slide-change", index: parseInt(prev.dataset.index) });',
    '  }',
    '  if (e.key === "Escape") {',
    '    channel.postMessage({ type: "exit" });',
    '    window.close();',
    '  }',
    '});',
  ].join('\n')
  doc.body.appendChild(script)
}
