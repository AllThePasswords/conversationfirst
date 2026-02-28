import AppCard from './AppCard'

const apps = [
  {
    id: 'fullypresent',
    name: 'FullyPresent',
    kicker: 'AI presentations',
    body: 'Create and deliver presentations powered by AI. Write a prompt, get a deck. Edit slides conversationally. Present with confidence.',
    iconLetter: 'FP',
    status: 'Published',
  },
  {
    id: 'onpoint',
    name: 'OnPoint',
    kicker: 'Interview coach',
    body: 'Real-time interview coaching. OnPoint listens for questions during calls, matches them to your best examples, and surfaces punchy, outcome-led answers.',
    iconLetter: 'OP',
    status: 'Published',
  },
  {
    id: 'lifeadmin',
    name: 'LifeAdmin',
    kicker: 'Bills & finances',
    body: 'Connect your accounts, track every bill, get reminders before anything is overdue. Your financial life in one view, always current.',
    iconLetter: 'LA',
    status: 'Published',
  },
  {
    id: 'voicecritique',
    name: 'VoiceCritique',
    kicker: 'Voice to plan',
    body: 'Record a voice note critiquing a build or UX. VoiceCritique transcribes it live and structures the feedback into an actionable Claude Code plan.',
    iconLetter: 'VC',
    status: 'Published',
  },
  {
    id: 'spritemaker',
    name: 'SpriteMaker',
    kicker: 'Game sprite generator',
    body: 'Generate consistent, style-locked animated sprites for your games. Define a visual style guide per game, then generate or upload sprites that match.',
    iconLetter: 'SM',
    status: 'Published',
  },
  {
    id: 'chat',
    name: 'Chat',
    kicker: 'AI assistant',
    body: 'Chat with an AI assistant that has access to your vault connections, memories, and app context. Multi-threaded conversations with tool use.',
    iconLetter: 'CH',
    status: 'Published',
  },
]

interface AppsHomepageProps {
  onAppClick: (appId: string) => void
}

export default function AppsHomepage({ onAppClick }: AppsHomepageProps) {
  return (
    <>
      <div className="cf-section-header">
        <div className="cf-section-top">
          <div>
            <span className="cf-section-label">Platform</span>
            <h1 className="cf-section-title">Your apps</h1>
          </div>
        </div>
        <p className="cf-section-desc">
          Apps powered by the ConversationFirst platform. Each app connects to the Vault for secure API and account access.
        </p>
      </div>

      <div className="cf-app-grid">
        {apps.map((app) => (
          <AppCard
            key={app.id}
            {...app}
            onClick={() => onAppClick(app.id)}
          />
        ))}
      </div>
    </>
  )
}
