import { useState, useEffect } from 'react'
import {
  ArrowLeftIcon,
  Cog6ToothIcon,
  SparklesIcon,
  PaperClipIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import type { SpriteGame, SpriteAsset, SpriteType } from '../lib/types'
import { SPRITE_TYPES } from '../lib/types'
import { fetchGame, fetchAssets, deleteAsset, deleteGame } from '../lib/queries'

interface GameDetailProps {
  gameId: string
  householdId: string
  hasOpenAiKey: boolean
  onBack: () => void
  onSelectSprite: (spriteId: string) => void
  onEditStyle: () => void
  onGenerate: () => void
  onUpload: () => void
  onRefresh: () => void
}

export default function GameDetail({
  gameId,
  householdId: _householdId,
  hasOpenAiKey,
  onBack,
  onSelectSprite,
  onEditStyle,
  onGenerate,
  onUpload,
  onRefresh,
}: GameDetailProps) {
  const [game, setGame] = useState<SpriteGame | null>(null)
  const [assets, setAssets] = useState<SpriteAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<SpriteType | 'all'>('all')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [g, a] = await Promise.all([
          fetchGame(gameId),
          fetchAssets(gameId),
        ])
        setGame(g)
        setAssets(a)
      } catch (err) {
        console.error('GameDetail load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [gameId])

  const filtered = typeFilter === 'all'
    ? assets
    : assets.filter(a => a.type === typeFilter)

  async function handleDeleteSprite(e: React.MouseEvent, assetId: string) {
    e.stopPropagation()
    try {
      await deleteAsset(assetId)
      setAssets(prev => prev.filter(a => a.id !== assetId))
    } catch (err) {
      console.error('Failed to delete sprite:', err)
    }
  }

  async function handleDeleteGame() {
    if (!game) return
    try {
      await deleteGame(game.id)
      onRefresh()
      onBack()
    } catch (err) {
      console.error('Failed to delete game:', err)
    }
  }

  if (loading || !game) {
    return (
      <div className="sm-page">
        <div className="cf-loading">
          <span className="cf-loading-cursor" aria-hidden="true" />
          <span className="cf-loading-text">Loading&hellip;</span>
        </div>
      </div>
    )
  }

  const sc = game.style_config

  return (
    <div className="sm-page">
      <div className="sm-header">
        <div className="sm-header-left">
          <button className="sm-back-btn" onClick={onBack} aria-label="Back to games">
            <ArrowLeftIcon aria-hidden="true" />
          </button>
          <div>
            <span className="sm-section-label">{sc?.resolution ? `${sc.resolution.width}x${sc.resolution.height}` : 'Game'} · {sc?.perspective || 'no perspective'}</span>
            <h1 className="sm-title">{game.name}</h1>
          </div>
        </div>
        <div className="sm-header-actions">
          <button className="sm-btn sm-btn--muted" onClick={onEditStyle} aria-label="Edit style guide">
            <Cog6ToothIcon aria-hidden="true" />
            <span>Style guide</span>
          </button>
          <button className="sm-btn sm-btn--muted sm-btn--danger" onClick={handleDeleteGame} aria-label="Delete game">
            <TrashIcon aria-hidden="true" />
          </button>
        </div>
      </div>

      {!hasOpenAiKey && (
        <div className="sm-banner sm-banner--warning">
          Add an OpenAI API key in the Vault to enable sprite generation.
        </div>
      )}

      {sc?.artStyle && (
        <div className="sm-style-chips">
          {sc.artStyle && <span className="sm-chip">{sc.artStyle}</span>}
          {sc.perspective && <span className="sm-chip">{sc.perspective}</span>}
          {sc.poseDefinitions?.length > 0 && (
            <span className="sm-chip">{sc.poseDefinitions.length} poses</span>
          )}
          {sc.colorPalette?.length > 0 && (
            <span className="sm-chip">{sc.colorPalette.length} colors</span>
          )}
        </div>
      )}

      <div className="sm-filter-bar">
        <div className="sm-filter-tabs">
          <button
            className={`sm-filter-tab ${typeFilter === 'all' ? 'sm-filter-tab--active' : ''}`}
            onClick={() => setTypeFilter('all')}
          >
            All ({assets.length})
          </button>
          {SPRITE_TYPES.map(t => {
            const count = assets.filter(a => a.type === t).length
            return (
              <button
                key={t}
                className={`sm-filter-tab ${typeFilter === t ? 'sm-filter-tab--active' : ''}`}
                onClick={() => setTypeFilter(t)}
              >
                {t} ({count})
              </button>
            )
          })}
        </div>
        <div className="sm-filter-actions">
          <button className="sm-btn sm-btn--accent" onClick={onGenerate} disabled={!hasOpenAiKey}>
            <SparklesIcon aria-hidden="true" />
            <span>Generate</span>
          </button>
          <button className="sm-btn sm-btn--muted" onClick={onUpload}>
            <PaperClipIcon aria-hidden="true" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="cf-empty">
          <p className="cf-empty-title">
            {assets.length === 0 ? 'No sprites yet' : `No ${typeFilter} sprites`}
          </p>
          <p className="cf-empty-desc">
            {assets.length === 0
              ? 'Generate or upload your first sprite.'
              : 'Try a different filter.'}
          </p>
        </div>
      ) : (
        <div className="sm-sprite-grid">
          {filtered.map(asset => (
            <button
              key={asset.id}
              className="sm-sprite-card"
              onClick={() => onSelectSprite(asset.id)}
            >
              <div className="sm-sprite-card-img">
                {asset.poses.length > 0 && asset.poses[0].url ? (
                  <img
                    src={asset.poses[0].url}
                    alt={asset.name}
                    className="sm-sprite-thumb"
                    loading="lazy"
                  />
                ) : (
                  <span className="sm-sprite-placeholder">{asset.name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="sm-sprite-card-info">
                <span className="sm-sprite-card-name">{asset.name}</span>
                <div className="sm-sprite-card-meta">
                  <span className="sm-type-badge">{asset.type}</span>
                  <span>{asset.poses.length} {asset.poses.length === 1 ? 'pose' : 'poses'}</span>
                </div>
              </div>
              <button
                className="sm-sprite-card-delete"
                onClick={e => handleDeleteSprite(e, asset.id)}
                aria-label={`Delete ${asset.name}`}
              >
                <TrashIcon aria-hidden="true" />
              </button>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
