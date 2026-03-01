import { useState, useRef, useCallback } from 'react'
import {
  PlusIcon,
  MicrophoneIcon,
  ArrowUpIcon,
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
  const [showThumbs, setShowThumbs] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = useCallback(() => setMenuOpen(p => !p), [])
  const toggleWaveform = useCallback(() => {
    setShowWaveform(p => !p)
    setMenuOpen(false)
  }, [])
  const toggleThumbs = useCallback(() => {
    setShowThumbs(p => !p)
    setMenuOpen(false)
  }, [])

  return (
    <div>
      {/* ── Section intro ── */}
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', lineHeight: 'var(--line-height-prose)', marginBottom: 'var(--space-6)' }}>
        The chat input is the primary interaction surface. Every element uses design system tokens. No inline SVGs — Heroicons only.
      </p>

      {/* ── Interactive controls ── */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
        <button className="btn btn-ghost" onClick={toggleMenu} style={{ fontSize: 'var(--text-sm)' }}>
          {menuOpen ? 'Close menu' : 'Open attach menu'}
        </button>
        <button className="btn btn-ghost" onClick={toggleWaveform} style={{ fontSize: 'var(--text-sm)' }}>
          {showWaveform ? 'Stop recording' : 'Show waveform'}
        </button>
        <button className="btn btn-ghost" onClick={toggleThumbs} style={{ fontSize: 'var(--text-sm)' }}>
          {showThumbs ? 'Remove thumbnails' : 'Show thumbnails'}
        </button>
      </div>

      {/* ── Live demo input ── */}
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <div className="chat-input-bar" style={{ position: 'relative' }}>
          <div className="chat-input-inner">
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

              {showWaveform ? (
                <div className="chat-voice-waveform" aria-label="Recording voice" role="status">
                  <div className="voice-bar" />
                  <div className="voice-bar" />
                  <div className="voice-bar" />
                  <div className="voice-bar" />
                  <div className="voice-bar" />
                </div>
              ) : (
                <textarea
                  className="chat-input-field"
                  placeholder="Ask a question..."
                  aria-label="Message input"
                  rows={1}
                  readOnly
                />
              )}
            </div>

            {/* Mic */}
            <button
              className={`chat-icon-btn chat-mic-btn ${showWaveform ? 'listening' : ''}`}
              onClick={toggleWaveform}
              title={showWaveform ? 'Stop recording' : 'Voice input'}
              aria-label={showWaveform ? 'Stop recording' : 'Voice input'}
              type="button"
            >
              <MicrophoneIcon width={20} height={20} aria-hidden="true" />
            </button>

            {/* Send */}
            <button
              className="chat-icon-btn chat-send-btn"
              disabled
              title="Send"
              aria-label="Send message"
              type="button"
            >
              <ArrowUpIcon width={20} height={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Anatomy ── */}
      <div className="section-label">Anatomy</div>
      <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', background: 'var(--code-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', overflow: 'auto', marginBottom: 'var(--space-8)' }}>{`┌─────────────────────────────────────────────────────┐
│  [+]  │  textarea (auto-grows)           │  [🎤] [↑] │
│       │  ┌──────────────────────────────┐ │           │
│       │  │ attachment thumbnails (if any)│ │           │
│       │  └──────────────────────────────┘ │           │
└─────────────────────────────────────────────────────┘`}</pre>

      {/* ── Icon buttons ── */}
      <div className="section-label">Icon buttons</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        {[
          { label: 'Attach', icon: <PlusIcon width={20} height={20} />, desc: 'PlusIcon 24/outline, --text-muted, 44×44px. Rotates 45° to ✕ when menu open.' },
          { label: 'Mic', icon: <MicrophoneIcon width={20} height={20} />, desc: 'MicrophoneIcon 24/outline, --text-muted, 44×44px. Pulses --accent when active.' },
          { label: 'Send', icon: <ArrowUpIcon width={20} height={20} />, desc: 'ArrowUpIcon 24/outline, white on --accent, 44×44px. Disabled at 0.4 opacity.' },
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
          ['Attach menu', 'PlusIcon rotates 45° to become ✕. Menu animates up from bottom-left with translateY(8px) → 0. Contains Camera, Photo Library, Document.'],
          ['Thumbnails', '56×56px previews above the textarea. Each has a remove button (18px circle, top-right). Strip scrolls horizontally.'],
          ['Voice waveform', '5 bars, 3px wide, --accent fill, staggered 0s/0.15s/0.3s/0.45s/0.6s delays. Oscillate 4px → 24px height over 1.2s. Replaces textarea.'],
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
            ['Spacing', '--space-2 (inner padding), --space-3 (button padding)'],
            ['Radius', '--radius-lg (container), --radius-md (buttons, thumbnails)'],
            ['Colour', '--surface (bg), --border (stroke), --accent (focus, send)'],
            ['Shadow', '--shadow-lg (container)'],
            ['Motion', '--duration-fast, --duration-base, --ease-out, --ease-spring'],
            ['Icons', 'Heroicons 24/outline only — no inline SVGs'],
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
