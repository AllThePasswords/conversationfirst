import {
  HomeIcon,
  ChatBubbleOvalLeftIcon,
  KeyIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline'

interface IconRailProps {
  currentView: string
  onNavigate: (view: string) => void
}

export default function IconRail({ currentView, onNavigate }: IconRailProps) {
  return (
    <nav className="cf-icon-rail" aria-label="Platform navigation">
      <button
        className={`cf-rail-btn${currentView === 'apps' ? ' cf-rail-btn--active' : ''}`}
        onClick={() => onNavigate('apps')}
        aria-label="Home"
      >
        <HomeIcon aria-hidden="true" />
      </button>
      <button
        className={`cf-rail-btn${currentView === 'chat' ? ' cf-rail-btn--active' : ''}`}
        onClick={() => onNavigate('chat')}
        aria-label="Chat"
      >
        <ChatBubbleOvalLeftIcon aria-hidden="true" />
      </button>
      <button
        className={`cf-rail-btn${currentView === 'overview' ? ' cf-rail-btn--active' : ''}`}
        onClick={() => onNavigate('overview')}
        aria-label="Design System"
      >
        <SwatchIcon aria-hidden="true" />
      </button>
      <div className="cf-icon-rail-bottom">
        <button
          className={`cf-rail-btn${currentView === 'vault' ? ' cf-rail-btn--active' : ''}`}
          onClick={() => onNavigate('vault')}
          aria-label="Vault"
        >
          <KeyIcon aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}
