import { useState, useRef, useCallback, useEffect } from 'react';
import {
  PlusIcon,
  MicrophoneIcon,
  ArrowUpIcon,
  CameraIcon,
  PhotoIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function ChatInput({ onSend, disabled, stagedImages = [], onAddImages, onRemoveImage, variant = 'bar' }) {
  const [text, setText] = useState('');
  const [dragging, setDragging] = useState(false);
  const [listening, setListening] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const docInputRef = useRef(null);
  const dragCounter = useRef(0);
  const recognitionRef = useRef(null);
  const menuRef = useRef(null);

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
      setListening(false);
      recognitionRef.current = null;
      // Auto-send: dispatch the transcribed text directly
      const fullText = (baseText + (baseText && finalTranscript ? ' ' : '') + finalTranscript).trim();
      if (fullText) {
        // Defer to next tick so state settles
        setTimeout(() => {
          onSend(fullText, []);
          setText('');
          if (textareaRef.current) textareaRef.current.style.height = 'auto';
        }, 100);
      }
    };
    recognition.onerror = (e) => {
      if (e.error !== 'aborted') setListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [speechSupported, resize, onSend]);

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

  return (
    <div className={variant === 'floating' ? 'chat-input-floating' : 'chat-input-bar'}>
      <div
        className={`chat-input-inner ${dragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Attach button — rotates to ✕ when menu open */}
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

        <div className="chat-input-body">
          {stagedImages.length > 0 && (
            <div className="chat-thumbnails" role="list" aria-label="Attached files">
              {stagedImages.map((img, i) => (
                <div key={img.id} className="chat-thumb" role="listitem">
                  <img src={img.preview} alt={`Attachment ${i + 1}`} />
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

          {listening ? (
            <div className="chat-voice-waveform" aria-label="Recording voice" role="status">
              <div className="voice-bar" />
              <div className="voice-bar" />
              <div className="voice-bar" />
              <div className="voice-bar" />
              <div className="voice-bar" />
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              className="chat-input-field"
              placeholder="Ask a question..."
              aria-label="Message input"
              value={text}
              onChange={(e) => { setText(e.target.value); resize(); }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              disabled={disabled}
              rows={1}
            />
          )}
        </div>

        {speechSupported && (
          <button
            className={`chat-icon-btn chat-mic-btn ${listening ? 'listening' : ''}`}
            onClick={toggleListening}
            disabled={disabled}
            title={listening ? 'Stop recording' : 'Voice input'}
            aria-label={listening ? 'Stop recording' : 'Voice input'}
            type="button"
          >
            <MicrophoneIcon width={20} height={20} aria-hidden="true" />
          </button>
        )}

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
      </div>
    </div>
  );
}
