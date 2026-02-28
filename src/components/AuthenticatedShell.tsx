import { useState, useEffect, useCallback } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { HouseholdCtx, useHouseholdProvider } from '../lib/useHousehold'
import IconRail from './IconRail'
import AppsHomepage from './AppsHomepage'
import VaultPage from './VaultPage'
import ChatPage from './ChatPage'
import PageTransition from './PageTransition'
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

type AppView = 'apps' | 'chat' | 'vault' | 'lifeadmin' | 'fullypresent' | 'onpoint' | 'voicecritique' | 'spritemaker'

const APP_LABELS: Record<string, string> = {
  apps: 'ConversationFirst',
  chat: 'Chat',
  vault: 'Vault',
  lifeadmin: 'LifeAdmin',
  fullypresent: 'FullyPresent',
  onpoint: 'OnPoint',
  voicecritique: 'VoiceCritique',
  spritemaker: 'SpriteMaker',
}

function parseHashRoute(): AppView {
  const hash = window.location.hash
  if (hash === '#/vault') return 'vault'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
    } else if (view === 'chat') {
      window.location.hash = '#/apps/chat'
    } else {
      window.location.hash = `#/apps/${view}`
    }
  }, [])

  const handleAppClick = useCallback((appId: string) => {
    navigate(appId)
  }, [navigate])

  const handleNavigateHome = useCallback(() => {
    navigate('apps')
  }, [navigate])

  const handleSidebarSelect = useCallback((id) => {
    setActiveId(id)
    setSidebarOpen(false)
  }, [setActiveId])

  const handleNewChat = useCallback(() => {
    createConversation()
    setSidebarOpen(false)
  }, [createConversation])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  // Determine which IconRail button is active
  const railView = currentView === 'vault' ? 'vault'
    : currentView === 'chat' ? 'chat'
    : currentView === 'apps' ? 'apps'
    : 'apps' // individual apps highlight home

  const showBackButton = currentView !== 'apps'

  return (
    <HouseholdCtx.Provider value={householdValue}>
      <div className="cf-shell">
        <header className="cf-titlebar">
          {showBackButton && (
            <button
              className="cf-titlebar-back"
              onClick={handleNavigateHome}
              aria-label="Back to home"
            >
              <ArrowLeftIcon aria-hidden="true" />
            </button>
          )}
          <span className="cf-titlebar-title">
            {APP_LABELS[currentView] || 'ConversationFirst'}
          </span>
        </header>
        <IconRail
          currentView={railView}
          onNavigate={navigate}
        />
        <main className="cf-main">
          <div className="cf-main-inner">
            {currentView === 'vault' ? (
              <PageTransition key="vault">
                <VaultPage householdId={householdId} />
              </PageTransition>
            ) : currentView === 'chat' ? (
              <PageTransition key="chat">
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
          </div>
        </main>
      </div>
    </HouseholdCtx.Provider>
  )
}
