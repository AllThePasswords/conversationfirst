import { useState, useEffect, useRef } from 'react'
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import type { SpriteGame, SpriteType, SpritePose } from '../lib/types'
import { SPRITE_TYPES } from '../lib/types'
import { fetchGame, createAsset, uploadSpriteImage } from '../lib/queries'

interface SpriteUploadFormProps {
  gameId: string
  householdId: string
  onBack: () => void
  onUploaded: () => void
}

interface PendingPose {
  poseName: string
  file: File
  preview: string
}

export default function SpriteUploadForm({ gameId, householdId, onBack, onUploaded }: SpriteUploadFormProps) {
  const [game, setGame] = useState<SpriteGame | null>(null)
  const [name, setName] = useState('')
  const [type, setType] = useState<SpriteType>('unit')
  const [description, setDescription] = useState('')
  const [poses, setPoses] = useState<PendingPose[]>([])
  const [selectedPose, setSelectedPose] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchGame(gameId).then(g => {
      if (g) {
        setGame(g)
        if (g.style_config?.poseDefinitions?.length) {
          setSelectedPose(g.style_config.poseDefinitions[0])
        }
      }
    })
  }, [gameId])

  function handleFiles(files: FileList | null) {
    if (!files || !selectedPose) return
    const file = files[0]
    if (!file || !file.type.startsWith('image/')) return

    const preview = URL.createObjectURL(file)
    const existing = poses.findIndex(p => p.poseName === selectedPose)
    if (existing >= 0) {
      URL.revokeObjectURL(poses[existing].preview)
      setPoses(prev => prev.map((p, i) => i === existing ? { poseName: selectedPose, file, preview } : p))
    } else {
      setPoses(prev => [...prev, { poseName: selectedPose, file, preview }])
    }

    // Auto-advance to next pose
    const poseDefs = game?.style_config?.poseDefinitions || []
    const currentIdx = poseDefs.indexOf(selectedPose)
    if (currentIdx < poseDefs.length - 1) {
      setSelectedPose(poseDefs[currentIdx + 1])
    }
  }

  function removePose(poseName: string) {
    const p = poses.find(pp => pp.poseName === poseName)
    if (p) URL.revokeObjectURL(p.preview)
    setPoses(prev => prev.filter(pp => pp.poseName !== poseName))
  }

  async function handleSave() {
    if (!name.trim() || poses.length === 0) return
    setUploading(true)
    try {
      const spriteId = crypto.randomUUID()
      const savedPoses: SpritePose[] = []

      for (const pose of poses) {
        const path = `${householdId}/${gameId}/${spriteId}/${pose.poseName}.png`
        const url = await uploadSpriteImage(path, pose.file)
        savedPoses.push({ pose_name: pose.poseName, storage_path: path, url })
      }

      await createAsset(gameId, householdId, {
        name: name.trim(),
        type,
        description: description.trim() || undefined,
        poses: savedPoses,
      })

      onUploaded()
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
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
            <span className="sm-section-label">Upload sprite</span>
            <h1 className="sm-title">{game?.name}</h1>
          </div>
        </div>
      </div>

      <div className="sm-form">
        <div className="sm-form-section">
          <div className="sm-form-row">
            <div className="sm-form-field" style={{ flex: 2 }}>
              <label className="sm-label" htmlFor="sm-upload-name">Sprite name</label>
              <input
                id="sm-upload-name"
                className="sm-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Sales Rep"
              />
            </div>
            <div className="sm-form-field" style={{ flex: 1 }}>
              <label className="sm-label" htmlFor="sm-upload-type">Type</label>
              <select
                id="sm-upload-type"
                className="sm-input sm-select"
                value={type}
                onChange={e => setType(e.target.value as SpriteType)}
              >
                {SPRITE_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm-form-field">
            <label className="sm-label" htmlFor="sm-upload-desc">Description</label>
            <input
              id="sm-upload-desc"
              className="sm-input"
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>
        </div>

        <div className="sm-form-section">
          <h2 className="sm-form-heading">Upload poses</h2>

          <div className="sm-pose-select-row">
            <label className="sm-label">Uploading for pose:</label>
            <div className="sm-perspective-group">
              {poseDefs.map(p => (
                <button
                  key={p}
                  className={`sm-perspective-btn ${selectedPose === p ? 'sm-perspective-btn--active' : ''}`}
                  onClick={() => setSelectedPose(p)}
                >
                  {p}
                  {poses.some(pp => pp.poseName === p) && ' \u2713'}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`sm-drop-zone ${dragActive ? 'sm-drop-zone--active' : ''}`}
            onDragEnter={e => { e.preventDefault(); setDragActive(true) }}
            onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragActive(false) }}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files) }}
            onClick={() => fileRef.current?.click()}
          >
            <span className="sm-drop-zone-text">
              Drop image here or click to select
            </span>
            <span className="sm-drop-zone-hint">PNG, JPG, WebP</span>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sm-hidden-picker"
            onChange={e => handleFiles(e.target.files)}
          />
        </div>

        {poses.length > 0 && (
          <div className="sm-form-section">
            <h2 className="sm-form-heading">Uploaded poses ({poses.length})</h2>
            <div className="sm-upload-previews">
              {poses.map(pose => (
                <div key={pose.poseName} className="sm-upload-preview">
                  <img src={pose.preview} alt={pose.poseName} className="sm-upload-preview-img" />
                  <span className="sm-upload-preview-label">{pose.poseName}</span>
                  <button
                    className="sm-upload-preview-remove"
                    onClick={() => removePose(pose.poseName)}
                    aria-label={`Remove ${pose.poseName}`}
                  >
                    <XMarkIcon aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="sm-form-actions">
          <button className="sm-btn sm-btn--muted" onClick={onBack}>Cancel</button>
          <button
            className="sm-btn sm-btn--accent"
            onClick={handleSave}
            disabled={!name.trim() || poses.length === 0 || uploading}
          >
            {uploading ? 'Uploading...' : `Save sprite (${poses.length} ${poses.length === 1 ? 'pose' : 'poses'})`}
          </button>
        </div>
      </div>
    </div>
  )
}
