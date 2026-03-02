import { useState, useRef, useCallback, useEffect } from 'react';
import {
  PlusIcon,
  MicrophoneIcon,
  ArrowUpIcon,
  XMarkIcon,
  CameraIcon,
  PhotoIcon,
  DocumentTextIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';

export default function ChatInput({ onSend, disabled, stagedImages = [], onAddImages, onRemoveImage, variant = 'bar' }) {
  const [text, setText] = useState('');
  const [dragging, setDragging] = useState(false);
  const [listening, setListening] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const docInputRef = useRef(null);
  const dragCounter = useRef(0);
  const recognitionRef = useRef(null);
  const menuRef = useRef(null);
  const cancelledRef = useRef(false);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const maxH = listening ? 320 : 200;
    el.style.height = Math.min(el.scrollHeight, maxH) + 'px';
  }, [listening]);

  const speechSupported = typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const toggleListening = useCallback(() => {
    if (!speechSupported) return;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // Capture whatever text exists before speech starts
    const baseText = textareaRef.current?.value || '';
    let finalTranscript = '';

    recognition.onresult = (event) => {
      let final = '';
      let interim = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      finalTranscript = final;
      const spacer = baseText && (final || interim) ? ' ' : '';
      setText(baseText + spacer + final + interim);
      resize();
    };

    recognition.onstart = () => setListening(true);
    recognition.onend = () => {
      recognitionRef.current = null;
      const isCancelled = cancelledRef.current;
      cancelledRef.current = false;

      // Animate out before clearing
      setDismissing(true);

      const fullText = (baseText + (baseText && finalTranscript ? ' ' : '') + finalTranscript).trim();
      setTimeout(() => {
        setListening(false);
        setDismissing(false);
        if (!isCancelled && fullText) {
          onSend(fullText, []);
        }
        setText('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
      }, 320);
    };
    recognition.onerror = (e) => {
      if (e.error !== 'aborted') {
        setListening(false);
        setDismissing(false);
      }
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [speechSupported, resize, onSend]);

  const handleCancelRecording = useCallback(() => {
    cancelledRef.current = true;
    recognitionRef.current?.stop();
  }, []);

  const handleSendRecording = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Close menu on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  const handleSend = useCallback(() => {
    if ((!text.trim() && stagedImages.length === 0) || disabled) return;
    onSend(text, stagedImages.map(img => img.file));
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [text, stagedImages, disabled, onSend]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // File selection via picker
  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && onAddImages) {
      onAddImages(files);
    }
    e.target.value = '';
    setMenuOpen(false);
  }, [onAddImages]);

  // Drag and drop on input area
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (dragCounter.current === 1) setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0 && onAddImages) {
      onAddImages(files);
    }
  }, [onAddImages]);

  // Paste images from clipboard
  const handlePaste = useCallback((e) => {
    const items = Array.from(e.clipboardData?.items || []);
    const imageFiles = items
      .filter(item => item.type.startsWith('image/'))
      .map(item => item.getAsFile())
      .filter(Boolean);
    if (imageFiles.length > 0 && onAddImages) {
      onAddImages(imageFiles);
    }
  }, [onAddImages]);

  const canSend = !disabled && (text.trim() || stagedImages.length > 0);

  const waveformBars = 30;

  return (
    <div className={variant === 'floating' ? 'chat-input-floating' : 'chat-input-bar'}>
      <div
        className={`chat-input-inner ${dragging ? 'dragging' : ''} ${(listening || dismissing) ? 'recording' : ''} ${dismissing ? 'dismissing' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Hidden file inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
        <input
          ref={docInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.md"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-hidden="true"
        />

        {(listening || dismissing) ? (
          <>
            {/* Recording state: [X] [waveform] [send] */}
            <button
              className="chat-icon-btn chat-cancel-btn"
              onClick={handleCancelRecording}
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
              onClick={handleSendRecording}
              disabled={dismissing}
              title="Send"
              aria-label="Send recording"
              type="button"
            >
              <ArrowUpIcon width={20} height={20} aria-hidden="true" />
            </button>
          </>
        ) : (
          <>
            {/* Inactive/typing state: [textarea] [+] [mic] */}
            <div className="chat-input-body">
              {stagedImages.length > 0 && (
                <div className="chat-thumbnails" role="list" aria-label="Attached files">
                  {stagedImages.map((img, i) => (
                    <div key={img.id} className="chat-thumb" role="listitem">
                      {img.preview ? (
                        <img src={img.preview} alt={`Attachment ${i + 1}`} />
                      ) : (
                        <div className="chat-thumb-placeholder">
                          {img.file?.type?.startsWith('image/')
                            ? <PhotoIcon width={22} height={22} />
                            : img.file?.name?.match(/\.(pdf|doc|docx|txt|md)$/i)
                              ? <DocumentTextIcon width={22} height={22} />
                              : <PaperClipIcon width={22} height={22} />}
                        </div>
                      )}
                      <button
                        className="chat-thumb-remove"
                        onClick={() => onRemoveImage && onRemoveImage(img.id)}
                        aria-label={`Remove attachment ${i + 1}`}
                        type="button"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <textarea
                ref={textareaRef}
                className="chat-input-field"
                placeholder="How can I help?"
                aria-label="Message input"
                value={text}
                onChange={(e) => { setText(e.target.value); resize(); }}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                disabled={disabled}
                rows={1}
              />
            </div>

            {/* Attach button */}
            <div className="chat-attach-wrapper" ref={menuRef}>
              <button
                className={`chat-icon-btn chat-attach-btn ${menuOpen ? 'active' : ''}`}
                onClick={() => setMenuOpen(prev => !prev)}
                disabled={disabled}
                title={menuOpen ? 'Close menu' : 'Attach'}
                aria-label={menuOpen ? 'Close attachment menu' : 'Open attachment menu'}
                aria-expanded={menuOpen}
                type="button"
              >
                <PlusIcon width={20} height={20} aria-hidden="true" />
              </button>

              {menuOpen && (
                <div className="chat-attach-menu" role="menu">
                  <button
                    className="chat-attach-menu-item"
                    role="menuitem"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    <CameraIcon width={18} height={18} aria-hidden="true" />
                    Take photo
                  </button>
                  <button
                    className="chat-attach-menu-item"
                    role="menuitem"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <PhotoIcon width={18} height={18} aria-hidden="true" />
                    Photo library
                  </button>
                  <button
                    className="chat-attach-menu-item"
                    role="menuitem"
                    onClick={() => docInputRef.current?.click()}
                  >
                    <DocumentTextIcon width={18} height={18} aria-hidden="true" />
                    Document
                  </button>
                </div>
              )}
            </div>

            {/* Mic button — visible when no text to send */}
            {speechSupported && !canSend && (
              <button
                className="chat-icon-btn chat-mic-btn"
                onClick={toggleListening}
                disabled={disabled}
                title="Voice input"
                aria-label="Voice input"
                type="button"
              >
                <MicrophoneIcon width={20} height={20} aria-hidden="true" />
              </button>
            )}

            {/* Send button — visible only when there's content to send */}
            {canSend && (
              <button
                className="chat-icon-btn chat-send-btn"
                onClick={handleSend}
                disabled={!canSend}
                title="Send"
                aria-label="Send message"
                type="button"
              >
                <ArrowUpIcon width={20} height={20} aria-hidden="true" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
