import { useState, useEffect, lazy, Suspense } from 'react'
import OverviewChat from './components/OverviewChat'
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

export default function App() {
  const [route, setRoute] = useState(window.location.hash)
  const { user, session, loading } = useAuth()
  const isAuthenticated = !!user

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

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

  // Redirect: unauthenticated users on protected routes → landing
  useEffect(() => {
    if (!isAuthenticated && (isApps || isVault || isOverview || isChat)) {
      window.location.hash = '#/'
    }
  }, [isAuthenticated, isApps, isVault, isOverview, isChat])

  // Show loading while auth initializes
  if (loading) {
    return null
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

  // Public landing page — ephemeral guest chat (no auth required)
  return (
    <div className="home-page">
      <a href="#main-content" className="skip-link">Skip to content</a>

      <main id="main-content">
        <OverviewChat />
      </main>
    </div>
  )
}
