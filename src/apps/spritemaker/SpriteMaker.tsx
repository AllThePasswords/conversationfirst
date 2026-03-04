import { useState, useEffect } from 'react'
import { fetchConnections } from '../../lib/connections'
import type { Connection } from '../../lib/types'
import { fetchGames } from './lib/queries'
import type { SpriteGame, SpriteView } from './lib/types'
import GameList from './components/GameList'
import GameDetail from './components/GameDetail'
import SpritePreview from './components/SpritePreview'
import GameStyleGuide from './components/GameStyleGuide'
import SpriteGenerateForm from './components/SpriteGenerateForm'
import SpriteUploadForm from './components/SpriteUploadForm'

interface SpriteMakerProps {
  householdId: string | null
}

export default function SpriteMaker({ householdId }: SpriteMakerProps) {
  const [view, setView] = useState<SpriteView>({ kind: 'games-list' })
  const [games, setGames] = useState<SpriteGame[]>([])
  const [loading, setLoading] = useState(true)
  const [connections, setConnections] = useState<Connection[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  const hasOpenAiKey = connections.some(
    c => c.provider_type === 'api' && c.provider_name === 'openai' && c.status === 'active'
  )

  useEffect(() => {
    if (!householdId) return

    async function load() {
      setLoading(true)
      try {
        const [g, conns] = await Promise.all([
          fetchGames(householdId!),
          fetchConnections(householdId!),
        ])
        setGames(g)
        setConnections(conns)
      } catch (err) {
        console.error('SpriteMaker load error:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [householdId, refreshKey])

  // Screen context for sidebar chat
  useEffect(() => {
    const ctx: Record<string, unknown> = { view: view.kind }
    if (view.kind === 'game-detail' || view.kind === 'style-guide' || view.kind === 'generate' || view.kind === 'upload') {
      const game = games.find(g => g.id === view.gameId)
      if (game) ctx.gameName = game.name
    }
    ctx.summary = `Sprite Maker: ${view.kind}. ${games.length} games.`
    ;(window as unknown as Record<string, unknown>).__CF_SCREEN_CONTEXT = ctx
  }, [view, games])

  function refresh() {
    setRefreshKey(k => k + 1)
  }

  if (!householdId) {
    return (
      <div className="cf-loading">
        <span className="cf-loading-cursor" aria-hidden="true" />
        <span className="cf-loading-text">Loading&hellip;</span>
      </div>
    )
  }

  return (
    <div className="sm-container">
      {view.kind === 'games-list' && (
        <GameList
          games={games}
          loading={loading}
          householdId={householdId}
          onSelectGame={gameId => setView({ kind: 'game-detail', gameId })}
          onRefresh={refresh}
        />
      )}

      {view.kind === 'game-detail' && (
        <GameDetail
          gameId={view.gameId}
          householdId={householdId}
          hasOpenAiKey={hasOpenAiKey}
          onBack={() => setView({ kind: 'games-list' })}
          onSelectSprite={spriteId => setView({ kind: 'sprite-preview', gameId: view.gameId, spriteId })}
          onEditStyle={() => setView({ kind: 'style-guide', gameId: view.gameId })}
          onGenerate={() => setView({ kind: 'generate', gameId: view.gameId })}
          onUpload={() => setView({ kind: 'upload', gameId: view.gameId })}
          onRefresh={refresh}
        />
      )}

      {view.kind === 'sprite-preview' && (
        <SpritePreview
          spriteId={view.spriteId}
          onBack={() => setView({ kind: 'game-detail', gameId: view.gameId })}
          onRefresh={refresh}
        />
      )}

      {view.kind === 'style-guide' && (
        <GameStyleGuide
          gameId={view.gameId}
          onBack={() => setView({ kind: 'game-detail', gameId: view.gameId })}
          onSaved={refresh}
        />
      )}

      {view.kind === 'generate' && (
        <SpriteGenerateForm
          gameId={view.gameId}
          householdId={householdId}
          onBack={() => setView({ kind: 'game-detail', gameId: view.gameId })}
          onCreated={() => {
            refresh()
            setView({ kind: 'game-detail', gameId: view.gameId })
          }}
        />
      )}

      {view.kind === 'upload' && (
        <SpriteUploadForm
          gameId={view.gameId}
          householdId={householdId}
          onBack={() => setView({ kind: 'game-detail', gameId: view.gameId })}
          onUploaded={() => {
            refresh()
            setView({ kind: 'game-detail', gameId: view.gameId })
          }}
        />
      )}
    </div>
  )
}
