import {
  PaintBrushIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  PlayIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import type { PanelType } from '../lib/types'

interface ToolbarRailProps {
  activePanel: PanelType | null
  onTogglePanel: (panel: PanelType) => void
  onPresent: () => void
}

const buttons: { panel: PanelType; Icon: typeof PaintBrushIcon; label: string }[] = [
  { panel: 'chat', Icon: SparklesIcon, label: 'Assistant' },
  { panel: 'design', Icon: PaintBrushIcon, label: 'Design' },
  { panel: 'talkTrack', Icon: ChatBubbleLeftRightIcon, label: 'Talk track' },
  { panel: 'settings', Icon: Cog6ToothIcon, label: 'Settings' },
]

export default function ToolbarRail({ activePanel, onTogglePanel, onPresent }: ToolbarRailProps) {
  return (
    <div className="fp-toolbar-rail">
      {buttons.map(({ panel, Icon, label }) => (
        <button
          key={panel}
          className={`fp-toolbar-btn${activePanel === panel ? ' fp-toolbar-btn--active' : ''}`}
          onClick={() => onTogglePanel(panel)}
          aria-label={label}
          aria-pressed={activePanel === panel}
          title={label}
        >
          <Icon aria-hidden="true" />
        </button>
      ))}
      <div className="fp-toolbar-divider" />
      <button
        className="fp-toolbar-btn fp-toolbar-btn--present"
        onClick={onPresent}
        aria-label="Present"
        title="Present"
      >
        <PlayIcon aria-hidden="true" />
      </button>
    </div>
  )
}
