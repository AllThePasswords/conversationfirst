import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  SpeakerWaveIcon,
  StopIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import MarkdownRenderer from './MarkdownRenderer';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { supabase } from '../lib/supabase';

const MAX_VISIBLE_SOURCES = 3;

/* ── Voice list cache (shared across all ResponseActions instances) ── */
type Voice = { id: string; name: string; category: string };
let voiceCache: Voice[] | null = null;
let voiceFetchPromise: Promise<Voice[]> | null = null;

const VOICE_STORAGE_KEY = 'cf-tts-voice';
const DEFAULT_VOICE: Voice = { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', category: 'premade' };

function getSavedVoice(): Voice {
  try {
    const raw = localStorage.getItem(VOICE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return DEFAULT_VOICE;
}

function saveVoice(voice: Voice) {
  localStorage.setItem(VOICE_STORAGE_KEY, JSON.stringify(voice));
}

async function fetchVoices(): Promise<Voice[]> {
  if (voiceCache) return voiceCache;
  if (voiceFetchPromise) return voiceFetchPromise;

  voiceFetchPromise = (async () => {
    try {
      const headers: Record<string, string> = {};
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) headers['Authorization'] = `Bearer ${session.access_token}`;
      } catch { /* no auth */ }

      const res = await fetch('/api/voices', { headers });
      if (!res.ok) return [DEFAULT_VOICE];
      const data = await res.json();
      voiceCache = data.voices || [DEFAULT_VOICE];
      return voiceCache;
    } catch {
      return [DEFAULT_VOICE];
    } finally {
      voiceFetchPromise = null;
    }
  })();

  return voiceFetchPromise;
}

/** Deduplicate citations by hostname, keeping the first occurrence. */
function dedupeCitations(citations) {
  const seen = new Set();
  return citations.filter(c => {
    try {
      const host = new URL(c.url).hostname;
      if (seen.has(host)) return false;
      seen.add(host);
      return true;
    } catch {
      return true;
    }
  });
}

/** Strip markdown to plain text for clipboard. */
function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, m => m.replace(/```\w*\n?/g, '').replace(/```/g, ''))
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '- ')
    .replace(/^\s*\d+\.\s+/gm, m => m)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Convert markdown to narration-friendly text for TTS.
 *  Describes structural elements instead of reading raw data. */
function toNarrationText(md: string): string {
  let text = md;

  // Replace fenced code blocks with a description
  text = text.replace(/```(\w*)\n[\s\S]*?```/g, (_match, lang) => {
    const label = lang ? ` ${lang}` : '';
    return `\n(A${label} code example is shown here.)\n`;
  });

  // Replace markdown tables with a description.
  // Detect tables: lines starting with | ... | on consecutive lines
  text = text.replace(
    /((?:^\|.+\|[ \t]*\n){2,})/gm,
    (_match) => {
      // Try to extract a header row for a better description
      const firstRow = _match.split('\n')[0];
      const cells = firstRow
        .split('|')
        .map(c => c.trim())
        .filter(Boolean)
        .filter(c => !/^[-:]+$/.test(c)); // skip separator rows
      if (cells.length > 0) {
        return `\n(A table is shown with columns: ${cells.join(', ')}.)\n`;
      }
      return '\n(A table is shown here.)\n';
    }
  );

  // Remove inline code backticks
  text = text.replace(/`([^`]+)`/g, '$1');

  // Strip markdown formatting
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/#{1,6}\s+/g, '');

  // Convert links to just their label
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Strip bare URLs
  text = text.replace(/https?:\/\/\S+/g, '');

  // Convert bullet lists to flowing sentences
  text = text.replace(/^\s*[-*+]\s+/gm, '');

  // Convert numbered lists. Keep the numbers for flow
  text = text.replace(/^\s*(\d+)\.\s+/gm, '$1. ');

  // Collapse excessive whitespace
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

/** Render user text with preserved line breaks. Splits on double-newline for
 *  paragraphs and single-newline for soft breaks within a paragraph. */
function UserTextBlock({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/);
  return (
    <>
      {paragraphs.map((para, i) => {
        const lines = para.split('\n');
        return (
          <p key={i} style={{ marginBottom: i < paragraphs.length - 1 ? '0.5em' : 0 }}>
            {lines.map((line, j) => (
              <span key={j}>
                {j > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

export default function ChatMessage({ message, showPlayAction = false }) {
  const displayContent = typeof message.content === 'string'
    ? message.content
    : Array.isArray(message.content)
      ? message.content.filter(b => b.type === 'text').map(b => b.text).join('')
      : '';

  const isAssistant = message.role !== 'user';

  return (
    <div className={`chat-bubble ${message.role === 'user' ? 'user' : ''}`}>
      {message.role === 'user' ? (
        <div>
          {Array.isArray(message.content) ? (
            <>
              {message.content.filter(b => b.type === 'image').map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={`Uploaded image ${i + 1}`}
                  className="chat-user-image"
                  loading="lazy"
                />
              ))}
              {message.content.filter(b => b.type === 'text').map((b, i) => (
                <UserTextBlock key={i} text={b.text} />
              ))}
            </>
          ) : (
            <UserTextBlock text={message.content} />
          )}
        </div>
      ) : (
        <>
          <MarkdownRenderer content={displayContent} />
          {message.citations && message.citations.length > 0 && (
            <CitationFooter citations={message.citations} />
          )}
          {isAssistant && displayContent && (
            <ResponseActions
              content={displayContent}
              showPlay={showPlayAction}
            />
          )}
        </>
      )}
    </div>
  );
}

function ResponseActions({ content, showPlay }: { content: string; showPlay: boolean }) {
  const [copied, setCopied] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<Voice>(getSavedVoice);
  const [menuOpen, setMenuOpen] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const tts = useTextToSpeech();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  // Close menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [menuOpen]);

  const handleCopy = useCallback(() => {
    const plainText = stripMarkdown(content);
    navigator.clipboard.writeText(plainText).then(() => {
      setCopied(true);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    });
  }, [content]);

  const handlePlay = useCallback(() => {
    if (tts.state === 'idle') {
      const narration = toNarrationText(content);
      tts.play(narration, selectedVoice.id);
    } else {
      tts.stop();
    }
  }, [content, tts, selectedVoice]);

  const handleToggleMenu = useCallback(() => {
    setMenuOpen(prev => {
      const opening = !prev;
      if (opening && voices.length === 0 && !loadingVoices) {
        setLoadingVoices(true);
        fetchVoices().then(v => {
          setVoices(v);
          setLoadingVoices(false);
        });
      }
      return opening;
    });
  }, [voices.length, loadingVoices]);

  const handleSelectVoice = useCallback((voice: Voice) => {
    setSelectedVoice(voice);
    saveVoice(voice);
    setMenuOpen(false);
  }, []);

  return (
    <div className="response-actions">
      <button
        className="response-action-btn"
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Copied' : 'Copy response'}
      >
        {copied ? (
          <ClipboardDocumentCheckIcon className="response-action-icon" aria-hidden="true" />
        ) : (
          <ClipboardDocumentIcon className="response-action-icon" aria-hidden="true" />
        )}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>

      {showPlay && (
        <div className="voice-play-group" ref={menuRef}>
          <button
            className={`response-action-btn${tts.state !== 'idle' ? ' active' : ''}`}
            type="button"
            onClick={handlePlay}
            aria-label={
              tts.state === 'playing' ? 'Stop playback'
                : tts.state === 'loading' ? 'Cancel'
                : `Read aloud with ${selectedVoice.name}`
            }
          >
            {tts.state === 'loading' ? (
              <span className="response-action-spinner" aria-hidden="true" />
            ) : tts.state === 'playing' ? (
              <StopIcon className="response-action-icon" aria-hidden="true" />
            ) : (
              <SpeakerWaveIcon className="response-action-icon" aria-hidden="true" />
            )}
            <span>
              {tts.state === 'playing' ? 'Stop' : selectedVoice.name}
            </span>
          </button>

          <button
            className={`voice-chevron-btn${menuOpen ? ' active' : ''}`}
            type="button"
            onClick={handleToggleMenu}
            aria-label="Choose voice"
            aria-expanded={menuOpen}
          >
            <ChevronDownIcon className="voice-chevron-icon" aria-hidden="true" />
          </button>

          {menuOpen && (
            <div className="voice-menu" role="listbox" aria-label="Available voices">
              {loadingVoices ? (
                <div className="voice-menu-loading">Loading voices...</div>
              ) : voices.length === 0 ? (
                <div className="voice-menu-loading">No voices available</div>
              ) : (
                voices.map(v => (
                  <button
                    key={v.id}
                    className={`voice-menu-item${v.id === selectedVoice.id ? ' selected' : ''}`}
                    type="button"
                    role="option"
                    aria-selected={v.id === selectedVoice.id}
                    onClick={() => handleSelectVoice(v)}
                  >
                    <span className="voice-menu-name">{v.name}</span>
                    <span className="voice-menu-category">{v.category}</span>
                    {v.id === selectedVoice.id && (
                      <CheckIcon className="voice-menu-check" aria-hidden="true" />
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CitationFooter({ citations }) {
  const [expanded, setExpanded] = useState(false);
  const unique = useMemo(() => dedupeCitations(citations), [citations]);
  const visible = expanded ? unique : unique.slice(0, MAX_VISIBLE_SOURCES);
  const hiddenCount = unique.length - MAX_VISIBLE_SOURCES;

  return (
    <div className="cite-footer">
      <div className="cite-footer-title">Sources</div>
      <ul className="cite-footer-list">
        {visible.map((c, i) => (
          <li key={i} className="cite-footer-item">
            <a
              className="cite-footer-link"
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="cite-inline">{i + 1}</span>
              {c.title}
              <span className="cite-footer-source">· {new URL(c.url).hostname}</span>
            </a>
          </li>
        ))}
      </ul>
      {hiddenCount > 0 && !expanded && (
        <button
          className="cite-footer-toggle"
          onClick={() => setExpanded(true)}
        >
          Show {hiddenCount} more source{hiddenCount !== 1 ? 's' : ''}
        </button>
      )}
    </div>
  );
}
