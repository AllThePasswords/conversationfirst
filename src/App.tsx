import { useState, useEffect, lazy, Suspense } from 'react'
import OverviewPage from './components/OverviewPage'
import ChatInput from './components/ChatInput'
import AuthPage from './components/AuthPage'
import AuthenticatedShell from './components/AuthenticatedShell'
import PrepPasswordGate from './components/PrepPasswordGate'
import PrepLanding from './components/PrepLanding'
import { useAuth } from './context/AuthContext'

// Lazy-load prep pages (large content)
const PrepTextcom = lazy(() => import('./components/prep/PrepTextcom'))
const PrepN8n = lazy(() => import('./components/prep/PrepN8n'))
const PrepDeel = lazy(() => import('./components/prep/PrepDeel'))
const PrepIntercom = lazy(() => import('./components/prep/PrepIntercom'))
const PrepBreeze = lazy(() => import('./components/prep/PrepBreeze'))
const PrepMobile = lazy(() => import('./components/prep/PrepMobile'))
const PrepLeadership = lazy(() => import('./components/prep/PrepLeadership'))

const PREP_ROUTES: Record<string, React.LazyExoticComponent<any>> = {
  '#/prep/textcom': PrepTextcom,
  '#/prep/n8n': PrepN8n,
  '#/prep/deel': PrepDeel,
  '#/prep/intercom': PrepIntercom,
  '#/prep/breeze': PrepBreeze,
  '#/prep/mobile': PrepMobile,
  '#/prep/leadership': PrepLeadership,
}

// Home page send: stash message and navigate to chat
function handleHomeSend(text: string) {
  if (!text.trim()) return
  sessionStorage.setItem('cf-pending-message', text.trim())
  window.location.hash = '#/apps/chat?new'
}

const LoginButton = () => (
  <button
    className="chat-menu-btn"
    onClick={() => { window.location.hash = '#/login' }}
    title="Log in"
    aria-label="Log in"
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  </button>
)

export default function App() {
  const [route, setRoute] = useState(window.location.hash)
  const { user, session, loading } = useAuth()
  const isAuthenticated = !!user

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const isLogin = route === '#/login'
  const isPrep = route === '#/prep' || route.startsWith('#/prep/')
  const isApps = route === '#/apps' || route.startsWith('#/apps/')
  const isVault = route === '#/vault'
  const isOverview = route === '#/overview'
  const isChat = route === '#/chat' || route.startsWith('#/chat?')
  const isLanding = !route || route === '#/' || route === '#'

  // Redirect: authenticated users on landing → Design System
  useEffect(() => {
    if (isAuthenticated && isLanding) {
      window.location.hash = '#/apps/overview'
    }
  }, [isAuthenticated, isLanding])

  // Redirect: authenticated users on login → Design System
  useEffect(() => {
    if (isAuthenticated && isLogin) {
      window.location.hash = '#/apps/overview'
    }
  }, [isAuthenticated, isLogin])

  // Show loading while auth initializes
  if (loading) {
    return null
  }

  // Login page
  if (isLogin) {
    return <AuthPage />
  }

  // Prep pages (always accessible)
  if (isPrep) {
    const PrepComponent = PREP_ROUTES[route]
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
    )
  }

  // Authenticated platform shell: apps, vault, chat
  if (isAuthenticated && (isApps || isVault || isOverview || isChat)) {
    return <AuthenticatedShell user={user} session={session} />
  }

  // Public landing page
  return (
    <div className="home-page">
      <a href="#main-content" className="skip-link">Skip to content</a>

      <header className="chat-header home-header">
        <LoginButton />
      </header>

      <main id="main-content">
        <OverviewPage />
      </main>
      <ChatInput onSend={handleHomeSend} variant="floating" />
    </div>
  )
}
