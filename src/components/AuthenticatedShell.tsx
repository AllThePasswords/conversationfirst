import { useState, useEffect, useCallback } from 'react'
import { HouseholdCtx, useHouseholdProvider } from '../lib/useHousehold'
import SideNav from './SideNav'
import AppsHomepage from './AppsHomepage'
import VaultPage from './VaultPage'
import ChatPage from './ChatPage'
import PageTransition from './PageTransition'
import OverviewPage from './OverviewPage'
import LifeAdmin from '../apps/lifeadmin/LifeAdmin'
import FullyPresent from '../apps/fullypresent/FullyPresent'
import OnPoint from '../apps/onpoint/OnPoint'
import VoiceCritique from '../apps/voicecritique/VoiceCritique'
import SpriteMaker from '../apps/spritemaker/SpriteMaker'
import { useChatHistory } from '../hooks/useChatHistory'
import { useChatHistoryDB } from '../hooks/useChatHistoryDB'

interface AuthenticatedShellProps {
  user: any
  session: any
}

type AppView = 'apps' | 'chat' | 'vault' | 'overview' | 'lifeadmin' | 'fullypresent' | 'onpoint' | 'voicecritique' | 'spritemaker'

/* Side nav provides all navigation — no titlebar needed */

function parseHashRoute(): AppView {
  const hash = window.location.hash
  if (hash === '#/vault') return 'vault'
  if (hash === '#/apps/overview' || hash === '#/overview') return 'overview'
  if (hash === '#/apps/chat' || hash === '#/chat' || hash.startsWith('#/chat?')) return 'chat'
  if (hash === '#/apps/lifeadmin') return 'lifeadmin'
  if (hash === '#/apps/fullypresent') return 'fullypresent'
  if (hash === '#/apps/onpoint') return 'onpoint'
  if (hash === '#/apps/voicecritique') return 'voicecritique'
  if (hash === '#/apps/spritemaker') return 'spritemaker'
  return 'apps'
}

export default function AuthenticatedShell({ user, session }: AuthenticatedShellProps) {
  const [currentView, setCurrentView] = useState<AppView>(parseHashRoute)
  const householdValue = useHouseholdProvider()
  const { householdId } = householdValue

  // Chat hooks for embedded chat page
  const guestHistory = useChatHistory()
  const dbHistory = useChatHistoryDB(user?.id)
  const useDB = !!user && dbHistory.dbAvailable
  const { conversations, activeId, setActiveId, createConversation, updateTitle, deleteConversation } =
    useDB ? dbHistory : guestHistory

  // Sync hash changes to view
  useEffect(() => {
    function onHash() {
      setCurrentView(parseHashRoute())
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = useCallback((view: string) => {
    if (view === 'apps') {
      window.location.hash = '#/apps'
    } else if (view === 'vault') {
      window.location.hash = '#/vault'
    } else if (view === 'overview') {
      window.location.hash = '#/apps/overview'
    } else if (view === 'chat') {
      window.location.hash = '#/apps/chat'
    } else {
      window.location.hash = `#/apps/${view}`
    }
  }, [])

  const handleAppClick = useCallback((appId: string) => {
    navigate(appId)
  }, [navigate])

  return (
    <HouseholdCtx.Provider value={householdValue}>
      <div className="cf-shell">
        <SideNav
          currentView={currentView}
          onNavigate={navigate}
          user={user}
        />
        <main className="cf-main">
          {currentView === 'overview' ? (
            <PageTransition key="overview">
              <OverviewPage />
            </PageTransition>
          ) : currentView === 'vault' ? (
            <PageTransition key="vault">
              <VaultPage householdId={householdId} />
            </PageTransition>
          ) : currentView === 'chat' ? (
            <PageTransition key="chat">
              <ChatPage
                conversations={conversations}
                activeId={activeId}
                setActiveId={setActiveId}
                createConversation={createConversation}
                updateTitle={updateTitle}
                deleteConversation={deleteConversation}
                isAuthenticated={true}
                useDB={useDB}
                user={user}
                session={session}
              />
            </PageTransition>
          ) : currentView === 'lifeadmin' ? (
            <PageTransition key="lifeadmin">
              <LifeAdmin householdId={householdId} />
            </PageTransition>
          ) : currentView === 'fullypresent' ? (
            <PageTransition key="fullypresent">
              <FullyPresent householdId={householdId} />
            </PageTransition>
          ) : currentView === 'onpoint' ? (
            <PageTransition key="onpoint">
              <OnPoint householdId={householdId} />
            </PageTransition>
          ) : currentView === 'voicecritique' ? (
            <PageTransition key="voicecritique">
              <VoiceCritique householdId={householdId} />
            </PageTransition>
          ) : currentView === 'spritemaker' ? (
            <PageTransition key="spritemaker">
              <SpriteMaker householdId={householdId} />
            </PageTransition>
          ) : (
            <PageTransition key="home" stagger>
              <AppsHomepage onAppClick={handleAppClick} />
            </PageTransition>
          )}
        </main>
      </div>
    </HouseholdCtx.Provider>
  )
}
