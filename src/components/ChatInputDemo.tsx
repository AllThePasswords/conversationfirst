import { useState, useRef, useCallback, useEffect } from 'react'
import {
  PlusIcon,
  MicrophoneIcon,
  ArrowUpIcon,
  XMarkIcon,
  CameraIcon,
  PhotoIcon,
  DocumentTextIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline'

/** Simulated waveform matching the live canvas renderer in ChatInput. */
function DemoWaveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    const w = rect.width
    const h = rect.height

    const barWidth = 2
    const barGap = 3
    const barStep = barWidth + barGap
    const numBars = Math.floor(w / barStep)
    const minBarH = 2

    const history = new Float32Array(numBars)
    let writeHead = 0
    let lastPush = 0
    const pushInterval = 50

    const accentColor =
      getComputedStyle(canvas).getPropertyValue('color').trim() || '#1a1a1a'
    const startTime = performance.now()

    const draw = (now: number) => {
      // Generate fake amplitude from layered sine waves
      const t = now / 1000
      const rms =
        0.18 +
        0.12 * Math.sin(t * 2.3) +
        0.08 * Math.sin(t * 5.7 + 1) +
        0.06 * Math.sin(t * 11.3 + 3) +
        0.04 * Math.random()

      if (now - lastPush >= pushInterval) {
        history[writeHead % numBars] = Math.max(0, rms)
        writeHead++
        lastPush = now
      }

      ctx.clearRect(0, 0, w, h)
      const midY = h / 2
      const maxAmp = h * 0.38
      const elapsed = now - startTime
      const fadeIn = Math.min(elapsed / 300, 1)

      for (let i = 0; i < numBars; i++) {
        const idx = ((writeHead - 1 - i) % numBars + numBars) % numBars
        const amp = history[idx]
        const barH = Math.max(minBarH, amp * maxAmp)
        const x = w - i * barStep - barWidth
        if (x < 0) break

        const distFade = 1 - (i / numBars) * 0.6
        ctx.globalAlpha = fadeIn * distFade * 0.7
        ctx.fillStyle = accentColor

        const radius = barWidth / 2
        const top = midY - barH
        const barFullH = barH * 2
        ctx.beginPath()
        ctx.roundRect(x, top, barWidth, barFullH, radius)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="chat-voice-canvas"
      aria-label="Recording voice"
      role="status"
    />
  )
}

/**
 * ChatInputDemo: a self-contained, non-functional replica of the
 * ChatInput component for the Design Spec tab.  Shows all visual
 * states without connecting to real chat logic.
 */
const MULTILINE_SAMPLE = `Compare quarterly revenue trends across our three product lines.

Include year-over-year growth rates, highlight any segments where growth decelerated, and flag products with margins below 40%.

Format as a table with sparklines if possible.`

/** Static multiline demo showing 6 lines of sample content. */
function MultilineDemo() {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [])

  return (
    <div className="chat-input-bar" style={{ position: 'relative' }}>
      <div className="chat-input-inner">
        <div className="chat-input-body">
          <textarea
            ref={ref}
            className="chat-input-field"
            aria-label="Multiline demo input"
            value={MULTILINE_SAMPLE}
            readOnly
            rows={1}
          />
        </div>
        <button className="chat-icon-btn chat-attach-btn" type="button" disabled>
          <PlusIcon width={20} height={20} aria-hidden="true" />
        </button>
        <button className="chat-icon-btn chat-send-btn" type="button">
          <ArrowUpIcon width={20} height={20} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default function ChatInputDemo() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showWaveform, setShowWaveform] = useState(false)
  const [dismissing, setDismissing] = useState(false)
  const [showThumbs, setShowThumbs] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = useCallback(() => setMenuOpen(p => !p), [])
  const startWaveform = useCallback(() => {
    setShowWaveform(true)
    setMenuOpen(false)
  }, [])
  const stopWaveform = useCallback(() => {
    setDismissing(true)
    setMenuOpen(false)
    setTimeout(() => {
      setShowWaveform(false)
      setDismissing(false)
    }, 320)
  }, [])
  const toggleThumbs = useCallback(() => {
    setShowThumbs(p => !p)
    setMenuOpen(false)
  }, [])

  return (
    <div>
      {/* ── Section intro ── */}
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', lineHeight: 'var(--line-height-prose)', marginBottom: 'var(--space-6)' }}>
        The chat input is the primary interaction surface. Shape follows the active design token (<code>--radius-input</code>). Two distinct states: inactive (textarea + attach + mic) and recording (cancel + full-width waveform + send). Icon buttons (send, cancel) follow <code>--radius-icon-btn</code>: circular for rounded/pill, square for square, cut-corner for cut. Every element uses design system tokens.
      </p>

      {/* ── Live demo input ── */}
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <div className="chat-input-bar" style={{ position: 'relative' }}>
          <div className={`chat-input-inner ${showWaveform ? 'recording' : ''} ${dismissing ? 'dismissing' : ''}`}>

            {showWaveform ? (
              <>
                {/* Recording state: [X] [waveform] [send] */}
                <button
                  className="chat-icon-btn chat-cancel-btn"
                  onClick={stopWaveform}
                  disabled={dismissing}
                  title="Cancel recording"
                  aria-label="Cancel recording"
                  type="button"
                >
                  <XMarkIcon width={20} height={20} aria-hidden="true" />
                </button>

                <div className="chat-voice-waveform">
                  <DemoWaveform />
                </div>

                <button
                  className="chat-icon-btn chat-send-btn recording"
                  title="Send"
                  aria-label="Send recording"
                  type="button"
                  onClick={stopWaveform}
                  disabled={dismissing}
                >
                  <ArrowUpIcon width={20} height={20} aria-hidden="true" />
                </button>
              </>
            ) : (
              <>
                {/* Inactive state: [textarea] [+] [mic] */}
                <div className="chat-input-body">
                  {showThumbs && (
                    <div className="chat-thumbnails" role="list" aria-label="Attached files">
                      {[
                        { id: 1, icon: <PhotoIcon width={22} height={22} /> },
                        { id: 2, icon: <DocumentTextIcon width={22} height={22} /> },
                        { id: 3, icon: <PaperClipIcon width={22} height={22} /> },
                      ].map(thumb => (
                        <div key={thumb.id} className="chat-thumb" role="listitem">
                          <div className="chat-thumb-placeholder">
                            {thumb.icon}
                          </div>
                          <button
                            className="chat-thumb-remove"
                            aria-label={`Remove attachment ${thumb.id}`}
                            type="button"
                            onClick={toggleThumbs}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <textarea
                    className="chat-input-field"
                    placeholder="Ask a question about Conversation First..."
                    aria-label="Message input"
                    rows={1}
                    readOnly
                  />
                </div>

                {/* Attach */}
                <div className="chat-attach-wrapper" ref={menuRef}>
                  <button
                    className={`chat-icon-btn chat-attach-btn ${menuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    title={menuOpen ? 'Close menu' : 'Attach'}
                    aria-label={menuOpen ? 'Close attachment menu' : 'Open attachment menu'}
                    type="button"
                  >
                    <PlusIcon width={20} height={20} aria-hidden="true" />
                  </button>

                  {menuOpen && (
                    <div className="chat-attach-menu" role="menu">
                      <button className="chat-attach-menu-item" role="menuitem" onClick={() => setMenuOpen(false)}>
                        <CameraIcon width={18} height={18} aria-hidden="true" />
                        Take photo
                      </button>
                      <button className="chat-attach-menu-item" role="menuitem" onClick={() => setMenuOpen(false)}>
                        <PhotoIcon width={18} height={18} aria-hidden="true" />
                        Photo library
                      </button>
                      <button className="chat-attach-menu-item" role="menuitem" onClick={() => setMenuOpen(false)}>
                        <DocumentTextIcon width={18} height={18} aria-hidden="true" />
                        Document
                      </button>
                    </div>
                  )}
                </div>

                {/* Mic */}
                <button
                  className="chat-icon-btn chat-mic-btn"
                  onClick={startWaveform}
                  title="Voice input"
                  aria-label="Voice input"
                  type="button"
                >
                  <MicrophoneIcon width={20} height={20} aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Multiline auto-grow demo ── */}
      <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Multiline auto-grow</h4>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--line-height-prose)', marginBottom: 'var(--space-4)' }}>
        The textarea expands as you type, up to 10 lines. After 10 lines it scrolls internally.
        In pill mode, corners soften to <code>--radius-lg</code> when multiline to prevent text clipping.
      </p>
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <MultilineDemo />
      </div>

    </div>
  )
}
