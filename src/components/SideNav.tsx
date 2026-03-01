import { useAuth } from '../context/AuthContext'

interface SideNavProps {
  currentView: string
  onNavigate: (view: string) => void
  user: any
}

const NAV_ITEMS = [
  { id: 'overview', label: 'Design System' },
  { id: 'chat', label: 'Chat' },
]

export default function SideNav({ currentView, onNavigate, user }: SideNavProps) {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    window.location.hash = '#/'
  }

  return (
    <nav className="cf-sidenav" aria-label="Platform navigation">
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`cf-nav-item${currentView === item.id ? ' cf-nav-item--active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          {item.label}
        </button>
      ))}

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
