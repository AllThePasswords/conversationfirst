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

  // Public landing page: ephemeral guest chat (no auth required)
  return (
    <div className="home-page">
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* Hidden SVG filters for hand-drawn effects (Sagmeister theme) */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          {/* Strong displacement for icons — sketchy, wobbly outlines */}
          <filter id="handmade-icon" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="turbulence" baseFrequency="0.035" numOctaves="4" seed="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          {/* Subtle displacement for body text — each character is slightly
              unique based on screen position (spatially-varying noise).
              This is key to principle 5: no two characters look identical. */}
          <filter id="handmade-text" x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="3" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.7" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <main id="main-content">
        <OverviewChat />
      </main>
    </div>
  )
}
