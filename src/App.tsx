import { useState, useEffect } from 'react'
import OverviewChat from './components/OverviewChat'
import AuthenticatedShell from './components/AuthenticatedShell'
import { useAuth } from './context/AuthContext'

export default function App() {
  const [route, setRoute] = useState(window.location.hash)
  const { user, session, loading } = useAuth()
  const isAuthenticated = !!user

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

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
