import { useState, useEffect, useRef, useCallback } from 'react';
import Hero from './components/Hero';
import VoiceRules from './components/VoiceRules';
import ProcessingDemo from './components/ProcessingDemo';
import CitationDemo from './components/CitationDemo';
import ComponentShowcase from './components/ComponentShowcase';
import Configurator from './components/Configurator';
import Footer from './components/Footer';
import ChatPage from './components/ChatPage';

function FloatingInput() {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, []);

  const handleSend = useCallback(() => {
    if (!text.trim()) return;
    sessionStorage.setItem('cf-pending-message', text.trim());
    window.location.hash = '#/chat';
  }, [text]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="chat-input-floating">
      <div className="chat-input-inner">
        <textarea
          ref={textareaRef}
          className="chat-input-field"
          placeholder="Ask a question..."
          aria-label="Message input"
          value={text}
          onChange={(e) => { setText(e.target.value); resize(); }}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!text.trim()}
          title="Send"
          aria-label="Send message"
        >
          ↑
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (route === '#/chat') {
    return <ChatPage />;
  }

  return (
    <>
      <div className="page" style={{ paddingBottom: 120 }}>
        <Hero />
        <VoiceRules />
        <ProcessingDemo />
        <CitationDemo />
        <ComponentShowcase />
        <Configurator />
        <Footer />
      </div>
      <FloatingInput />
    </>
  );
}
