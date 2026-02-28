import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import type { SpriteGame } from '../lib/types'
import { DEFAULT_STYLE_CONFIG } from '../lib/types'
import { createGame } from '../lib/queries'

interface GameListProps {
  games: SpriteGame[]
  loading: boolean
  householdId: string
  onSelectGame: (gameId: string) => void
  onRefresh: () => void
}

export default function GameList({ games, loading, householdId, onSelectGame, onRefresh }: GameListProps) {
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [creating, setCreating] = useState(false)

  async function handleCreate() {
    if (!newName.trim()) return
    setCreating(true)
    try {
      await createGame(householdId, newName.trim(), newDesc.trim(), DEFAULT_STYLE_CONFIG)
      setNewName('')
      setNewDesc('')
      setShowCreate(false)
      onRefresh()
    } catch (err) {
      console.error('Failed to create game:', err)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="sm-page">
      <div className="sm-header">
        <div>
          <span className="sm-section-label">Game assets</span>
          <h1 className="sm-title">Sprite Maker</h1>
        </div>
        <button
          className="sm-btn sm-btn--accent"
          onClick={() => setShowCreate(!showCreate)}
          aria-label="Create game"
        >
          <PlusIcon aria-hidden="true" />
          <span>Create game</span>
        </button>
      </div>

      {showCreate && (
        <div className="sm-create-form">
          <div className="sm-create-form-inner">
            <label className="sm-label" htmlFor="sm-game-name">Game name</label>
            <input
              id="sm-game-name"
              className="sm-input"
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="e.g. CRM Wars"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
            />
            <label className="sm-label" htmlFor="sm-game-desc">Description</label>
            <input
              id="sm-game-desc"
              className="sm-input"
              type="text"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Isometric RTS with pixel art sprites"
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
            />
            <div className="sm-create-form-actions">
              <button className="sm-btn sm-btn--muted" onClick={() => setShowCreate(false)}>Cancel</button>
              <button
                className="sm-btn sm-btn--accent"
                onClick={handleCreate}
                disabled={!newName.trim() || creating}
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="sm-empty">
          <span className="sm-loading-text">Loading games...</span>
        </div>
      ) : games.length === 0 ? (
        <div className="sm-empty">
          <span className="sm-empty-icon">SM</span>
          <p className="sm-empty-text">No games yet. Create one to start generating sprites.</p>
        </div>
      ) : (
        <div className="sm-game-grid">
          {games.map(game => (
            <button
              key={game.id}
              className="sm-game-card"
              onClick={() => onSelectGame(game.id)}
            >
              <div className="sm-game-card-thumbs">
                <span className="sm-game-card-icon">{game.name.slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="sm-game-card-info">
                <span className="sm-game-card-name">{game.name}</span>
                {game.description && (
                  <span className="sm-game-card-desc">{game.description}</span>
                )}
                <span className="sm-game-card-meta">
                  {game.style_config?.resolution
                    ? `${game.style_config.resolution.width}x${game.style_config.resolution.height}`
                    : 'No style set'}
                  {' · '}
                  {new Date(game.updated_at).toLocaleDateString()}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
