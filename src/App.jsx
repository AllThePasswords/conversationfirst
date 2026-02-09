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
    window.location.hash = '#/chat?new';
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

  if (route === '#/chat' || route.startsWith('#/chat?')) {
    return <ChatPage />;
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <nav className="home-nav" aria-label="Chat navigation">
        <a href="#/chat" className="home-nav-btn" title="Chat history" aria-label="Open chat history">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </a>
      </nav>
      <main id="main-content" className="page" style={{ paddingBottom: 120 }}>
        <Hero />
        <VoiceRules />
        <ProcessingDemo />
        <CitationDemo />
        <ComponentShowcase />
        <Configurator />
        <Footer />
      </main>
      <FloatingInput />
    </>
  );
}
