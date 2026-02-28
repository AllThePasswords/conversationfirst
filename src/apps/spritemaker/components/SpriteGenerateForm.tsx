import { useState, useEffect } from 'react'
import { ArrowLeftIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { supabase } from '../../../lib/supabase'
import type { SpriteGame, SpriteType, SpritePose, GeneratedPose } from '../lib/types'
import { SPRITE_TYPES } from '../lib/types'
import { fetchGame, createAsset, uploadSpriteImage } from '../lib/queries'
import { buildSpritePrompt } from '../lib/promptBuilder'

interface SpriteGenerateFormProps {
  gameId: string
  householdId: string
  onBack: () => void
  onCreated: () => void
}

export default function SpriteGenerateForm({ gameId, householdId, onBack, onCreated }: SpriteGenerateFormProps) {
  const [game, setGame] = useState<SpriteGame | null>(null)
  const [name, setName] = useState('')
  const [type, setType] = useState<SpriteType>('unit')
  const [description, setDescription] = useState('')

  // Generation state
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState('')
  const [generatedPoses, setGeneratedPoses] = useState<GeneratedPose[]>([])
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchGame(gameId).then(g => setGame(g))
  }, [gameId])

  async function handleGenerate() {
    if (!game || !name.trim() || !description.trim()) return
    setGenerating(true)
    setError(null)
    setGeneratedPoses([])

    const sc = game.style_config
    const poses = sc.poseDefinitions?.length ? sc.poseDefinitions : ['default']
    const results: GeneratedPose[] = []

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      for (let i = 0; i < poses.length; i++) {
        const poseName = poses[i]
        setProgress(`Generating pose ${i + 1} of ${poses.length}: ${poseName}...`)

        buildSpritePrompt(sc, name.trim(), type, description.trim(), poseName)

        const response = await supabase.functions.invoke('generate-sprite', {
          headers: { Authorization: `Bearer ${session.access_token}` },
          body: {
            gameId,
            spriteName: name.trim(),
            spriteType: type,
            spriteDescription: description.trim(),
            poseName,
          },
        })

        if (response.error) {
          let detail = response.error.message
          try {
            const ctx = (response.error as unknown as { context?: Response }).context
            if (ctx) {
              const body = await ctx.json()
              if (body?.error) detail = body.error
            }
          } catch { /* use default */ }
          throw new Error(detail)
        }

        results.push({
          poseName,
          imageData: response.data.image,
          approved: true,
        })

        setGeneratedPoses([...results])
      }

      setProgress('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
      setProgress('')
    } finally {
      setGenerating(false)
    }
  }

  async function handleRegenerate(index: number) {
    if (!game) return
    const pose = generatedPoses[index]

    setGenerating(true)
    setProgress(`Regenerating ${pose.poseName}...`)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const response = await supabase.functions.invoke('generate-sprite', {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: {
          gameId,
          spriteName: name.trim(),
          spriteType: type,
          spriteDescription: description.trim(),
          poseName: pose.poseName,
        },
      })

      if (response.error) throw new Error(response.error.message)

      setGeneratedPoses(prev => prev.map((p, i) =>
        i === index ? { ...p, imageData: response.data.image, approved: true } : p
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Regeneration failed')
    } finally {
      setGenerating(false)
      setProgress('')
    }
  }

  function toggleApproval(index: number) {
    setGeneratedPoses(prev => prev.map((p, i) =>
      i === index ? { ...p, approved: !p.approved } : p
    ))
  }

  async function handleSave() {
    const approved = generatedPoses.filter(p => p.approved)
    if (approved.length === 0) return

    setSaving(true)
    try {
      const spriteId = crypto.randomUUID()
      const savedPoses: SpritePose[] = []

      for (const pose of approved) {
        // Convert base64 to blob
        const byteString = atob(pose.imageData)
        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        const blob = new Blob([ab], { type: 'image/png' })

        const path = `${householdId}/${gameId}/${spriteId}/${pose.poseName}.png`
        const url = await uploadSpriteImage(path, blob)
        savedPoses.push({ pose_name: pose.poseName, storage_path: path, url })
      }

      const prompt = game
        ? buildSpritePrompt(game.style_config, name.trim(), type, description.trim(), 'all')
        : undefined

      await createAsset(gameId, householdId, {
        name: name.trim(),
        type,
        description: description.trim() || undefined,
        poses: savedPoses,
        generation_prompt: prompt,
      })

      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const poseDefs = game?.style_config?.poseDefinitions || ['default']

  return (
    <div className="sm-page">
      <div className="sm-header">
        <div className="sm-header-left">
          <button className="sm-back-btn" onClick={onBack} aria-label="Back to game">
            <ArrowLeftIcon aria-hidden="true" />
          </button>
          <div>
            <span className="sm-section-label">Generate sprite</span>
            <h1 className="sm-title">{game?.name}</h1>
          </div>
        </div>
      </div>

      <div className="sm-form">
        <div className="sm-form-section">
          <div className="sm-form-row">
            <div className="sm-form-field" style={{ flex: 2 }}>
              <label className="sm-label" htmlFor="sm-gen-name">Sprite name</label>
              <input
                id="sm-gen-name"
                className="sm-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Sales Rep"
                disabled={generating}
              />
            </div>
            <div className="sm-form-field" style={{ flex: 1 }}>
              <label className="sm-label" htmlFor="sm-gen-type">Type</label>
              <select
                id="sm-gen-type"
                className="sm-input sm-select"
                value={type}
                onChange={e => setType(e.target.value as SpriteType)}
                disabled={generating}
              >
                {SPRITE_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm-form-field">
            <label className="sm-label" htmlFor="sm-gen-desc">Description</label>
            <textarea
              id="sm-gen-desc"
              className="sm-textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe this character or object in detail. The game's master prompt provides the style constraints."
              rows={4}
              disabled={generating}
            />
          </div>

          <div className="sm-form-hint-row">
            <span className="sm-form-hint">
              Will generate {poseDefs.length} {poseDefs.length === 1 ? 'pose' : 'poses'}: {poseDefs.join(', ')}
            </span>
          </div>

          {generatedPoses.length === 0 && (
            <button
              className="sm-btn sm-btn--accent sm-btn--full"
              onClick={handleGenerate}
              disabled={generating || !name.trim() || !description.trim()}
            >
              {generating ? progress || 'Generating...' : `Generate ${poseDefs.length} ${poseDefs.length === 1 ? 'pose' : 'poses'}`}
            </button>
          )}
        </div>

        {error && (
          <div className="sm-banner sm-banner--error">{error}</div>
        )}

        {generatedPoses.length > 0 && (
          <div className="sm-form-section">
            <h2 className="sm-form-heading">Generated poses</h2>
            <div className="sm-gen-previews">
              {generatedPoses.map((pose, i) => (
                <div
                  key={pose.poseName}
                  className={`sm-gen-preview ${!pose.approved ? 'sm-gen-preview--rejected' : ''}`}
                >
                  <img
                    src={`data:image/png;base64,${pose.imageData}`}
                    alt={`${name} — ${pose.poseName}`}
                    className="sm-gen-preview-img"
                  />
                  <span className="sm-gen-preview-label">{pose.poseName}</span>
                  <div className="sm-gen-preview-actions">
                    <button
                      className={`sm-gen-action ${pose.approved ? 'sm-gen-action--approved' : ''}`}
                      onClick={() => toggleApproval(i)}
                      aria-label={pose.approved ? 'Reject' : 'Approve'}
                    >
                      <CheckCircleIcon aria-hidden="true" />
                    </button>
                    <button
                      className="sm-gen-action"
                      onClick={() => handleRegenerate(i)}
                      disabled={generating}
                      aria-label="Regenerate"
                    >
                      <ArrowPathIcon aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="sm-form-actions">
              <button className="sm-btn sm-btn--muted" onClick={onBack}>Cancel</button>
              <button
                className="sm-btn sm-btn--accent"
                onClick={handleSave}
                disabled={saving || generatedPoses.filter(p => p.approved).length === 0}
              >
                {saving ? 'Saving...' : `Save ${generatedPoses.filter(p => p.approved).length} approved`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
