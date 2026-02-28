import { useState, useRef, useCallback, useEffect } from 'react';
import { validateImage, validateImageCount } from '../lib/imageUpload';

export default function ChatInput({ onSend, disabled, stagedImages = [], onAddImages, onRemoveImage, variant = 'bar' }) {
  const [text, setText] = useState('');
  const [dragging, setDragging] = useState(false);
  const [listening, setListening] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);
  const recognitionRef = useRef(null);

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

    recognition.onresult = (event) => {
      // Rebuild the full transcript from ALL results each time.
      // This avoids accumulation bugs — we read the canonical state
      // from the SpeechRecognition results array directly.
      let final = '';
      let interim = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      const spacer = baseText && (final || interim) ? ' ' : '';
      setText(baseText + spacer + final + interim);
      resize();
    };

    recognition.onstart = () => setListening(true);
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = (e) => {
      if (e.error !== 'aborted') setListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [speechSupported, resize]);

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

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
    // Reset so same file can be re-selected
    e.target.value = '';
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
        <button
          className="chat-attach-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          title="Attach image"
          aria-label="Attach image"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          capture="environment"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-hidden="true"
        />

        <div className="chat-input-body">
          {stagedImages.length > 0 && (
            <div className="chat-thumbnails" role="list" aria-label="Attached images">
              {stagedImages.map((img, i) => (
                <div key={img.id} className="chat-thumb" role="listitem">
                  <img src={img.preview} alt={`Attachment ${i + 1}`} />
                  <button
                    className="chat-thumb-remove"
                    onClick={() => onRemoveImage && onRemoveImage(img.id)}
                    aria-label={`Remove image ${i + 1}`}
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
            className={`chat-input-field ${listening ? 'dictating' : ''}`}
            placeholder="Ask a question..."
            aria-label="Message input"
            value={text}
            onChange={(e) => { setText(e.target.value); resize(); }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            disabled={disabled}
            rows={1}
          />
        </div>

        {speechSupported && (
          <button
            className={`chat-mic-btn ${listening ? 'listening' : ''}`}
            onClick={toggleListening}
            disabled={disabled}
            title={listening ? 'Stop listening' : 'Speech to text'}
            aria-label={listening ? 'Stop listening' : 'Speech to text'}
            type="button"
          >
            {listening && (
              <>
                <div className="mic-ripple" />
                <div className="mic-ripple" />
                <div className="mic-ripple" />
              </>
            )}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="1" width="6" height="12" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <line x1="12" y1="17" x2="12" y2="21" />
              <line x1="8" y1="21" x2="16" y2="21" />
            </svg>
          </button>
        )}

        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!canSend}
          title="Send"
          aria-label="Send message"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
