import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Hero from './components/Hero';
import VoiceRules from './components/VoiceRules';
import ProcessingDemo from './components/ProcessingDemo';
import CitationDemo from './components/CitationDemo';
import ResponseDemo from './components/ResponseDemo';
import InlineFormsDemo from './components/InlineFormsDemo';
import ComponentShowcase from './components/ComponentShowcase';
import Configurator from './components/Configurator';
import Footer from './components/Footer';
import ThemePresetBar from './components/ThemePresetBar';
import ChatInput from './components/ChatInput';
import ChatPage from './components/ChatPage';
import ChatSidebar from './components/ChatSidebar';
import AuthPage from './components/AuthPage';
import PrepPasswordGate from './components/PrepPasswordGate';
import PrepLanding from './components/PrepLanding';
import { useChatHistory } from './hooks/useChatHistory';
import { useChatHistoryDB } from './hooks/useChatHistoryDB';
import { useAuth } from './context/AuthContext';

// Lazy-load prep pages (large content)
const PrepTextcom = lazy(() => import('./components/prep/PrepTextcom'));
const PrepN8n = lazy(() => import('./components/prep/PrepN8n'));
const PrepDeel = lazy(() => import('./components/prep/PrepDeel'));
const PrepIntercom = lazy(() => import('./components/prep/PrepIntercom'));
const PrepBreeze = lazy(() => import('./components/prep/PrepBreeze'));
const PrepMobile = lazy(() => import('./components/prep/PrepMobile'));
const PrepLeadership = lazy(() => import('./components/prep/PrepLeadership'));

const PREP_ROUTES = {
  '#/prep/textcom': PrepTextcom,
  '#/prep/n8n': PrepN8n,
  '#/prep/deel': PrepDeel,
  '#/prep/intercom': PrepIntercom,
  '#/prep/breeze': PrepBreeze,
  '#/prep/mobile': PrepMobile,
  '#/prep/leadership': PrepLeadership,
};

// Home page send: stash message and navigate to chat
function handleHomeSend(text) {
  if (!text.trim()) return;
  sessionStorage.setItem('cf-pending-message', text.trim());
  window.location.hash = '#/chat?new';
}

const MenuButton = ({ onClick, sidebarOpen }) => (
  <button
    className="chat-menu-btn"
    onClick={onClick}
    title={sidebarOpen ? 'Close menu' : 'Menu'}
    aria-label={sidebarOpen ? 'Close conversation list' : 'Open conversation list'}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  </button>
);

const LoginButton = () => (
  <button
    className="chat-menu-btn"
    onClick={() => { window.location.hash = '#/login'; }}
    title="Log in"
    aria-label="Log in"
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  </button>
);

export default function App() {
  const [route, setRoute] = useState(window.location.hash);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, session, loading } = useAuth();
  const isAuthenticated = !!user;

  // Guest mode hooks (localStorage-based)
  const guestHistory = useChatHistory();
  // Authenticated mode hooks (Supabase DB-based)
  const dbHistory = useChatHistoryDB(user?.id);

  // Pick the right hooks based on auth state
  const { conversations, activeId, setActiveId, createConversation, updateTitle, deleteConversation } =
    isAuthenticated ? dbHistory : guestHistory;

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const isChat = route === '#/chat' || route.startsWith('#/chat?');
  const isLogin = route === '#/login';
  const isPrep = route === '#/prep' || route.startsWith('#/prep/');

  // Redirect: if logged in and on login page, go to chat
  useEffect(() => {
    if (isAuthenticated && isLogin) {
      window.location.hash = '#/chat';
    }
  }, [isAuthenticated, isLogin]);

  const handleSidebarSelect = useCallback((id) => {
    setActiveId(id);
    setSidebarOpen(false);
    if (!window.location.hash.startsWith('#/chat')) {
      window.location.hash = '#/chat';
    }
  }, [setActiveId]);

  const handleNewChat = useCallback(() => {
    createConversation();
    setSidebarOpen(false);
    if (!window.location.hash.startsWith('#/chat')) {
      window.location.hash = '#/chat';
    }
  }, [createConversation]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Show loading while auth initializes
  if (loading) {
    return null;
  }

  // Login page
  if (isLogin) {
    return <AuthPage />;
  }

  // Prep pages
  if (isPrep) {
    const PrepComponent = PREP_ROUTES[route];
    return (
      <PrepPasswordGate>
        {PrepComponent ? (
          <Suspense fallback={null}>
            <PrepComponent />
          </Suspense>
        ) : (
          <PrepLanding />
        )}
      </PrepPasswordGate>
    );
  }

  // Chat page
  if (isChat) {
    return (
      <ChatPage
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        toggleSidebar={toggleSidebar}
        conversations={conversations}
        activeId={activeId}
        setActiveId={setActiveId}
        createConversation={createConversation}
        updateTitle={updateTitle}
        deleteConversation={deleteConversation}
        onSidebarSelect={handleSidebarSelect}
        onNewChat={handleNewChat}
        isAuthenticated={isAuthenticated}
        user={user}
        session={session}
      />
    );
  }

  // Home page — public
  return (
    <div className={`home-page ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <ThemePresetBar />
      {isAuthenticated && (
        <ChatSidebar
          isOpen={sidebarOpen}
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSidebarSelect}
          onNew={handleNewChat}
          onClose={() => setSidebarOpen(false)}
          user={user}
        />
      )}

      <header className="chat-header home-header">
        {isAuthenticated ? (
          <MenuButton onClick={toggleSidebar} sidebarOpen={sidebarOpen} />
        ) : (
          <LoginButton />
        )}
      </header>

      <main id="main-content" className="page" style={{ paddingBottom: 120 }}>
        <Hero />
        <VoiceRules />
        <ProcessingDemo />
        <CitationDemo />
        <ResponseDemo />
        <InlineFormsDemo />
        <ComponentShowcase />
        <Configurator />
        <Footer />
      </main>
      <ChatInput onSend={handleHomeSend} variant="floating" />
    </div>
  );
}
