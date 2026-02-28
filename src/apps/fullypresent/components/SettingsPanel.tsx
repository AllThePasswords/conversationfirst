import { useRef } from 'react'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import type { PresentationSettings } from '../lib/types'

interface SettingsPanelProps {
  settings: PresentationSettings
  onUpdate: (settings: Partial<PresentationSettings>) => void
}

export default function SettingsPanel({ settings, onUpdate }: SettingsPanelProps) {
  const logoInputRef = useRef<HTMLInputElement>(null)

  function handleLogoUpload(files: FileList) {
    const file = files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      onUpdate({
        logoUrl: reader.result as string,
        logoFileName: file.name,
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="fp-panel">
      <div className="fp-panel-header">
        <span className="fp-panel-title">Settings</span>
      </div>
      <div className="fp-panel-body">
        <div className="fp-settings-section">
          <span className="fp-settings-label">Logo</span>
          {settings.logoUrl ? (
            <div className="fp-settings-logo">
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="fp-settings-logo-img"
              />
              <div className="fp-settings-logo-info">
                <span className="fp-settings-logo-name">
                  {settings.logoFileName || 'Logo'}
                </span>
                <button
                  className="fp-settings-logo-remove"
                  onClick={() => onUpdate({ logoUrl: undefined, logoFileName: undefined })}
                  aria-label="Remove logo"
                >
                  <XMarkIcon aria-hidden="true" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              className="fp-settings-upload-btn"
              onClick={() => logoInputRef.current?.click()}
            >
              <PhotoIcon aria-hidden="true" />
              <span>Upload logo</span>
            </button>
          )}
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*,.svg"
            onChange={(e) => {
              if (e.target.files) handleLogoUpload(e.target.files)
              e.target.value = ''
            }}
            className="fp-sr-only"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>

        <div className="fp-settings-section">
          <label className="fp-settings-checkbox">
            <input
              type="checkbox"
              checked={settings.showLogoOnSlides}
              onChange={(e) => onUpdate({ showLogoOnSlides: e.target.checked })}
            />
            <span>Show logo on slides</span>
          </label>
        </div>
      </div>
    </div>
  )
}
