import { useAuth } from '../context/AuthContext'
import { TrashIcon, SwatchIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'

interface Conversation {
  id: string
  title: string
  updatedAt: number
}

interface SideNavProps {
  currentView: string
  onNavigate: (view: string) => void
  user: any
  conversations: Conversation[]
  onSelectConversation: (id: string) => void
  onNewChat: () => void
  onDeleteConversation: (id: string) => void
  activeConversationId: string | null
}

const NAV_ITEMS = [
  { id: 'overview', label: 'Design System', icon: SwatchIcon },
  { id: 'new-chat', label: 'New Chat', icon: ChatBubbleLeftIcon },
]

export default function SideNav({
  currentView,
  onNavigate,
  user,
  conversations,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  activeConversationId,
}: SideNavProps) {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    window.location.hash = '#/'
  }

  return (
    <nav className="cf-sidenav" aria-label="Platform navigation">
      <div className="cf-nav-section">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          const isNewChat = item.id === 'new-chat'
          return (
            <button
              key={item.id}
              className={`cf-nav-item${!isNewChat && currentView === item.id ? ' cf-nav-item--active' : ''}`}
              onClick={() => isNewChat ? onNewChat() : onNavigate(item.id)}
            >
              <Icon width={16} height={16} aria-hidden="true" />
              {item.label}
            </button>
          )
        })}
      </div>

      <hr className="cf-nav-divider" />

      <div className="cf-nav-history">
        <div className="cf-nav-history-header">
          <span className="cf-nav-history-label">History</span>
        </div>

        <div className="cf-nav-history-list">
          {conversations.length === 0 ? (
            <div className="cf-nav-history-empty">No conversations yet</div>
          ) : (
            conversations.map(c => (
              <button
                key={c.id}
                className={`cf-nav-history-item${
                  currentView === 'chat' && activeConversationId === c.id
                    ? ' cf-nav-history-item--active'
                    : ''
                }`}
                onClick={() => onSelectConversation(c.id)}
                title={c.title || 'New conversation'}
              >
                <span className="cf-nav-history-title">
                  {c.title || 'New conversation'}
                </span>
                <button
                  className="cf-nav-history-delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteConversation(c.id)
                  }}
                  aria-label={`Delete ${c.title || 'conversation'}`}
                >
                  <TrashIcon width={12} height={12} aria-hidden="true" />
                </button>
              </button>
            ))
          )}
        </div>
      </div>

      {user && (
        <div className="cf-nav-footer">
          <div className="cf-nav-email">{user.email}</div>
          <button className="cf-nav-signout" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      )}
    </nav>
  )
}
