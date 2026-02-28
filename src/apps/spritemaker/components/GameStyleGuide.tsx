import { useState, useEffect } from 'react'
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import type { SpriteGame, StyleConfig } from '../lib/types'
import { DEFAULT_STYLE_CONFIG } from '../lib/types'
import { fetchGame, updateGame } from '../lib/queries'
import ColorPaletteEditor from './ColorPaletteEditor'

interface GameStyleGuideProps {
  gameId: string
  onBack: () => void
  onSaved: () => void
}

export default function GameStyleGuide({ gameId, onBack, onSaved }: GameStyleGuideProps) {
  const [game, setGame] = useState<SpriteGame | null>(null)
  const [config, setConfig] = useState<StyleConfig>(DEFAULT_STYLE_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newPose, setNewPose] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const g = await fetchGame(gameId)
      if (g) {
        setGame(g)
        setConfig({ ...DEFAULT_STYLE_CONFIG, ...g.style_config })
      }
      setLoading(false)
    }
    load()
  }, [gameId])

  function updateConfig<K extends keyof StyleConfig>(key: K, value: StyleConfig[K]) {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  function addPose() {
    const pose = newPose.trim().toLowerCase().replace(/\s+/g, '-')
    if (!pose || config.poseDefinitions.includes(pose)) return
    updateConfig('poseDefinitions', [...config.poseDefinitions, pose])
    setNewPose('')
  }

  function removePose(pose: string) {
    updateConfig('poseDefinitions', config.poseDefinitions.filter(p => p !== pose))
  }

  async function handleSave() {
    if (!game) return
    setSaving(true)
    try {
      await updateGame(game.id, { style_config: config })
      onSaved()
      onBack()
    } catch (err) {
      console.error('Failed to save style guide:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="sm-page">
        <div className="sm-empty">
          <span className="sm-loading-text">Loading style guide...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="sm-page">
      <div className="sm-header">
        <div className="sm-header-left">
          <button className="sm-back-btn" onClick={onBack} aria-label="Back to game">
            <ArrowLeftIcon aria-hidden="true" />
          </button>
          <div>
            <span className="sm-section-label">Style guide</span>
            <h1 className="sm-title">{game?.name}</h1>
          </div>
        </div>
        <button
          className="sm-btn sm-btn--accent"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="sm-form">
        <div className="sm-form-section">
          <h2 className="sm-form-heading">Resolution</h2>
          <div className="sm-form-row">
            <div className="sm-form-field">
              <label className="sm-label" htmlFor="sm-res-w">Width (px)</label>
              <input
                id="sm-res-w"
                className="sm-input"
                type="number"
                min={1}
                value={config.resolution.width}
                onChange={e => updateConfig('resolution', { ...config.resolution, width: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="sm-form-field">
              <label className="sm-label" htmlFor="sm-res-h">Height (px)</label>
              <input
                id="sm-res-h"
                className="sm-input"
                type="number"
                min={1}
                value={config.resolution.height}
                onChange={e => updateConfig('resolution', { ...config.resolution, height: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>
        </div>

        <div className="sm-form-section">
          <h2 className="sm-form-heading">Perspective</h2>
          <div className="sm-perspective-group">
            {(['isometric', 'top-down', 'side-view'] as const).map(p => (
              <button
                key={p}
                className={`sm-perspective-btn ${config.perspective === p ? 'sm-perspective-btn--active' : ''}`}
                onClick={() => updateConfig('perspective', p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="sm-form-section">
          <h2 className="sm-form-heading">Art style</h2>
          <textarea
            className="sm-textarea"
            value={config.artStyle}
            onChange={e => updateConfig('artStyle', e.target.value)}
            placeholder="e.g. Retro pixel art, Command & Conquer aesthetic, clean outlines, limited palette"
            rows={3}
          />
        </div>

        <div className="sm-form-section">
          <h2 className="sm-form-heading">Color palette</h2>
          <ColorPaletteEditor
            colors={config.colorPalette}
            onChange={colors => updateConfig('colorPalette', colors)}
          />
        </div>

        <div className="sm-form-section">
          <h2 className="sm-form-heading">Background</h2>
          <div className="sm-perspective-group">
            <button
              className={`sm-perspective-btn ${config.background === 'transparent' ? 'sm-perspective-btn--active' : ''}`}
              onClick={() => updateConfig('background', 'transparent')}
            >
              Transparent
            </button>
            <button
              className={`sm-perspective-btn ${config.background !== 'transparent' ? 'sm-perspective-btn--active' : ''}`}
              onClick={() => updateConfig('background', '#000000')}
            >
              Solid color
            </button>
          </div>
          {config.background !== 'transparent' && (
            <input
              type="color"
              value={config.background}
              onChange={e => updateConfig('background', e.target.value)}
              className="sm-color-input"
              aria-label="Background color"
            />
          )}
        </div>

        <div className="sm-form-section">
          <h2 className="sm-form-heading">Pose definitions</h2>
          <p className="sm-form-hint">Each sprite will be generated once per pose. Add the poses your game requires.</p>
          <div className="sm-pose-chips">
            {config.poseDefinitions.map(pose => (
              <span key={pose} className="sm-pose-chip">
                {pose}
                <button
                  className="sm-pose-chip-remove"
                  onClick={() => removePose(pose)}
                  aria-label={`Remove pose ${pose}`}
                >
                  <XMarkIcon aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
          <div className="sm-form-row">
            <input
              className="sm-input"
              type="text"
              value={newPose}
              onChange={e => setNewPose(e.target.value)}
              placeholder="e.g. walk-north"
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addPose())}
            />
            <button className="sm-btn sm-btn--muted" onClick={addPose} disabled={!newPose.trim()}>
              Add pose
            </button>
          </div>
        </div>

        <div className="sm-form-section">
          <h2 className="sm-form-heading">Master prompt</h2>
          <p className="sm-form-hint">This prompt is prepended to every sprite generation request. Describe the overall visual style, constraints, and rules for sprites in this game.</p>
          <textarea
            className="sm-textarea sm-textarea--tall"
            value={config.masterPrompt}
            onChange={e => updateConfig('masterPrompt', e.target.value)}
            placeholder="e.g. Retro isometric pixel art character for a CRM-themed RTS game. 64x64 pixels, transparent background, clean outlines, limited color palette. Characters should look like stylized office workers..."
            rows={8}
          />
        </div>
      </div>
    </div>
  )
}
