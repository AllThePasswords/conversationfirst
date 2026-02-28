interface AppCardProps {
  name: string
  kicker: string
  body: string
  iconLetter: string
  status: string
  onClick?: () => void
}

export default function AppCard({ name, kicker, body, iconLetter, status, onClick }: AppCardProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }

  return (
    <div
      className="cf-app-card"
      role="button"
      tabIndex={0}
      aria-label={`Open ${name}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div className="cf-app-card-body">
        <div className="cf-app-card-text">
          <span className="cf-app-kicker">{kicker}</span>
          <span className="cf-app-name">{name}</span>
        </div>
        <div className="cf-app-icon">
          {iconLetter}
        </div>
      </div>

      <p className="cf-app-body">{body}</p>

      <div className="cf-app-meta">{status}</div>
    </div>
  )
}
