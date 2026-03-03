import { useState, useRef, useCallback } from 'react'
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

/**
 * ChatInputDemo — a self-contained, non-functional replica of the
 * ChatInput component for the Design Spec tab.  Shows all visual
 * states without connecting to real chat logic.
 */
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

  const waveformBars = 30

  return (
    <div>
      {/* ── Section intro ── */}
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', lineHeight: 'var(--line-height-prose)', marginBottom: 'var(--space-6)' }}>
        The chat input is the primary interaction surface. Pill-shaped container with two distinct states: inactive (textarea + attach + mic) and recording (cancel + full-width waveform + send). Every element uses design system tokens. No inline SVGs — Heroicons only.
      </p>

      {/* ── Interactive controls ── */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
        <button className="btn btn-ghost" onClick={toggleMenu} style={{ fontSize: 'var(--text-sm)' }}>
          {menuOpen ? 'Close menu' : 'Open attach menu'}
        </button>
        <button className="btn btn-ghost" onClick={showWaveform ? stopWaveform : startWaveform} style={{ fontSize: 'var(--text-sm)' }}>
          {showWaveform ? 'Stop recording' : 'Show waveform'}
        </button>
        <button className="btn btn-ghost" onClick={toggleThumbs} style={{ fontSize: 'var(--text-sm)' }}>
          {showThumbs ? 'Remove thumbnails' : 'Show thumbnails'}
        </button>
      </div>

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

                <div className="chat-voice-waveform" aria-label="Recording voice" role="status" style={{ gap: 3 }}>
                  {Array.from({ length: waveformBars }, (_, i) => (
                    <div key={i} className="voice-bar" style={{ animationDelay: `${(i * 0.07) % 1.2}s` }} />
                  ))}
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

    </div>
  )
}
