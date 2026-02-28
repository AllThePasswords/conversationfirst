import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import CfSelect from '../../../components/CfSelect'
import type { OnPointSettings } from '../lib/types'

interface SettingsPanelProps {
  open: boolean
  settings: OnPointSettings
  onSave: (settings: OnPointSettings) => void
  onClose: () => void
}

const DEFAULT_SETTINGS: OnPointSettings = {
  sources: [],
  instructions: {
    style: 'Lead with a specific example and outcome. Be concrete, not abstract.',
    tone: 'Confident and direct. No hedging.',
    format: 'short',
  },
}

export function getDefaultSettings(): OnPointSettings {
  return structuredClone(DEFAULT_SETTINGS)
}

export default function SettingsPanel({ open, settings, onSave, onClose }: SettingsPanelProps) {
  const [draft, setDraft] = useState<OnPointSettings>(settings)

  useEffect(() => {
    if (open) setDraft(structuredClone(settings))
  }, [open, settings])

  if (!open) return null

  function handleSave() {
    onSave(draft)
    onClose()
  }

  return (
    <div className="op-settings-overlay">
      <div className="op-settings-panel">
        <div className="op-settings-header">
          <span className="op-settings-title">Settings</span>
          <button className="op-btn-icon" onClick={onClose} aria-label="Close settings">
            <XMarkIcon width={16} height={16} aria-hidden="true" />
          </button>
        </div>

        <div className="op-settings-body">
          <div className="op-settings-section">
            <div className="op-settings-section-title">Answer instructions</div>
            <div className="op-settings-field">
              <label className="op-settings-label" htmlFor="op-style">Style</label>
              <textarea
                id="op-style"
                className="op-settings-textarea"
                rows={3}
                value={draft.instructions.style}
                onChange={e => setDraft(prev => ({
                  ...prev,
                  instructions: { ...prev.instructions, style: e.target.value },
                }))}
                placeholder="How should answers be structured?"
              />
            </div>
            <div className="op-settings-field">
              <label className="op-settings-label" htmlFor="op-tone">Tone</label>
              <textarea
                id="op-tone"
                className="op-settings-textarea"
                rows={2}
                value={draft.instructions.tone}
                onChange={e => setDraft(prev => ({
                  ...prev,
                  instructions: { ...prev.instructions, tone: e.target.value },
                }))}
                placeholder="What tone should answers have?"
              />
            </div>
            <div className="op-settings-field">
              <label className="op-settings-label" htmlFor="op-format">Format</label>
              <CfSelect
                id="op-format"
                value={draft.instructions.format}
                onChange={val => setDraft(prev => ({
                  ...prev,
                  instructions: { ...prev.instructions, format: val as 'short' | 'medium' | 'bullets' },
                }))}
                options={[
                  { value: 'short', label: 'Short (1 sentence lead)' },
                  { value: 'medium', label: 'Medium (2\u20133 sentences)' },
                  { value: 'bullets', label: 'Bullet points' },
                ]}
                size="md"
                aria-label="Format"
              />
            </div>
          </div>
        </div>

        <div className="op-settings-footer">
          <button className="op-btn-save" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  )
}
