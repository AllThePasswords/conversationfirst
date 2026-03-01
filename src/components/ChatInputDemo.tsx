import { useState, useRef, useCallback } from 'react'
import {
  PlusIcon,
  MicrophoneIcon,
  ArrowUpIcon,
  XMarkIcon,
  CameraIcon,
  PhotoIcon,
  DocumentTextIcon,
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

                <div className="chat-voice-waveform" aria-label="Recording voice" role="status">
                  {Array.from({ length: waveformBars }, (_, i) => (
                    <div key={i} className="voice-bar" style={{ animationDelay: `${(i * 0.08) % 1.2}s` }} />
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
                      {[1, 2, 3].map(i => (
                        <div key={i} className="chat-thumb" role="listitem">
                          <div style={{ width: 56, height: 56, background: 'var(--accent-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                            {i}
                          </div>
                          <button
                            className="chat-thumb-remove"
                            aria-label={`Remove attachment ${i}`}
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
                    placeholder="How can I help?"
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

      {/* ── Anatomy ── */}
      <div className="section-label">Anatomy</div>
      <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', background: 'var(--code-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', overflow: 'auto', marginBottom: 'var(--space-8)' }}>{`Inactive state (pill shape):
╭──────────────────────────────────────────────────────╮
│  How can I help?                          [+]  [🎤]  │
╰──────────────────────────────────────────────────────╯

Recording state (pill shape):
╭──────────────────────────────────────────────────────╮
│  (✕)  ···|||·||·|||···||·|||··||·||···|||·  (➤)  │
╰──────────────────────────────────────────────────────╯

• Inactive: textarea → attach (+) → mic (🎤)
• Has content: textarea → attach (+) → send (↑)
• Recording: cancel (✕) → full-width waveform → send (➤)
• Cancel & send buttons use dark filled circles in recording mode`}</pre>

      {/* ── Icon buttons ── */}
      <div className="section-label">Icon buttons</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        {[
          { label: 'Attach', icon: <PlusIcon width={20} height={20} />, desc: 'PlusIcon 24/outline, --text-muted, 44×44px pill. Rotates 45° to ✕ when menu open.' },
          { label: 'Mic', icon: <MicrophoneIcon width={20} height={20} />, desc: 'MicrophoneIcon 24/outline, --text-muted, 44×44px pill. Visible when no text to send.' },
          { label: 'Cancel', icon: <XMarkIcon width={20} height={20} />, desc: 'XMarkIcon 24/outline, --bg on --text, 44×44px dark circle. Recording state only.' },
          { label: 'Send', icon: <ArrowUpIcon width={20} height={20} />, desc: 'ArrowUpIcon 24/outline, --bg on --text, 44×44px dark circle. Replaces mic when text present.' },
        ].map(b => (
          <div key={b.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-3)', color: 'var(--text-muted)' }}>
              {b.icon}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>{b.label}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.4 }}>{b.desc}</div>
          </div>
        ))}
      </div>

      {/* ── Behaviour rules ── */}
      <div className="section-label">Behaviour</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        {[
          ['Inactive state', 'Pill container with textarea, attach (+) and mic buttons on the right. Placeholder: "How can I help?"'],
          ['Has content', 'Mic button swaps to send button (dark circle with arrow). Attach button remains.'],
          ['Recording state', 'Full layout swap. Cancel (✕) on left, waveform fills center, send (➤) on right. Both circle buttons use --text bg with --bg color.'],
          ['Waveform', '30 bars, 2.5px wide, --text fill, staggered animation delays. Spans full width between cancel and send. Oscillates 4px → 22px height over 1.2s.'],
          ['Attach menu', 'PlusIcon rotates 45° to become ✕. Menu animates up from bottom-right with translateY(8px) → 0. Contains Camera, Photo Library, Document.'],
          ['Thumbnails', '56×56px previews above the textarea. Each has a remove button (18px circle, top-right). Strip scrolls horizontally.'],
          ['Auto-send', 'When recording stops, transcribed text sends immediately. No review step.'],
          ['Drag & drop', 'Input-level: border turns --accent, bg turns --accent-subtle. Page-level: full overlay with mic icon bounce.'],
          ['Keyboard', 'Enter sends. Shift+Enter inserts newline. Escape closes attach menu.'],
        ].map(([title, desc]) => (
          <div key={title} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 600, flexShrink: 0, minWidth: 120 }}>{title}</span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</span>
          </div>
        ))}
      </div>

      {/* ── Token compliance ── */}
      <div className="section-label">Token compliance</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ textAlign: 'left', padding: 'var(--space-2) var(--space-3)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Property</th>
            <th style={{ textAlign: 'left', padding: 'var(--space-2) var(--space-3)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Token</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Font', '--font-body (textarea), --font-mono (status)'],
            ['Text size', '--text-base (input), --text-sm (menu items)'],
            ['Spacing', '--space-1 (inner padding), --space-4 (textarea padding)'],
            ['Radius', '--radius-full (container pill, icon buttons), --radius-md (thumbnails)'],
            ['Colour', '--surface (bg), --border (stroke), --text (send/cancel fill), --bg (send/cancel icon)'],
            ['Shadow', '--shadow-lg (container)'],
            ['Motion', '--duration-fast, --duration-base, --ease-out, --ease-spring'],
            ['Icons', 'Heroicons 24/outline only — PlusIcon, MicrophoneIcon, XMarkIcon, ArrowUpIcon'],
          ].map(([prop, token]) => (
            <tr key={prop} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: 'var(--space-2) var(--space-3)', fontWeight: 500 }}>{prop}</td>
              <td style={{ padding: 'var(--space-2) var(--space-3)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{token}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
