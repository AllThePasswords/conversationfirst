import { useState, useEffect } from 'react'
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { SpriteAsset } from '../lib/types'
import { fetchAsset, deleteAsset } from '../lib/queries'

interface SpritePreviewProps {
  spriteId: string
  onBack: () => void
  onRefresh: () => void
}

export default function SpritePreview({ spriteId, onBack, onRefresh }: SpritePreviewProps) {
  const [asset, setAsset] = useState<SpriteAsset | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPose, setSelectedPose] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const a = await fetchAsset(spriteId)
      setAsset(a)
      setLoading(false)
    }
    load()
  }, [spriteId])

  async function handleDelete() {
    if (!asset) return
    try {
      await deleteAsset(asset.id)
      onRefresh()
      onBack()
    } catch (err) {
      console.error('Failed to delete sprite:', err)
    }
  }

  if (loading || !asset) {
    return (
      <div className="sm-page">
        <div className="cf-loading">
          <span className="cf-loading-cursor" aria-hidden="true" />
          <span className="cf-loading-text">Loading&hellip;</span>
        </div>
      </div>
    )
  }

  const currentPose = asset.poses[selectedPose]

  return (
    <div className="sm-page">
      <div className="sm-header">
        <div className="sm-header-left">
          <button className="sm-back-btn" onClick={onBack} aria-label="Back to game">
            <ArrowLeftIcon aria-hidden="true" />
          </button>
          <div>
            <span className="sm-section-label"><span className="sm-type-badge">{asset.type}</span></span>
            <h1 className="sm-title">{asset.name}</h1>
          </div>
        </div>
        <div className="sm-header-actions">
          <button className="sm-btn sm-btn--muted sm-btn--danger" onClick={handleDelete} aria-label="Delete sprite">
            <TrashIcon aria-hidden="true" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {asset.description && (
        <p className="sm-description">{asset.description}</p>
      )}

      <div className="sm-preview-main">
        <div className="sm-preview-canvas">
          {currentPose?.url ? (
            <img
              src={currentPose.url}
              alt={`${asset.name} — ${currentPose.pose_name}`}
              className="sm-preview-img"
            />
          ) : (
            <div className="sm-preview-placeholder">No image</div>
          )}
        </div>

        {asset.poses.length > 1 && (
          <div className="sm-pose-tabs">
            {asset.poses.map((pose, i) => (
              <button
                key={pose.pose_name}
                className={`sm-pose-tab ${i === selectedPose ? 'sm-pose-tab--active' : ''}`}
                onClick={() => setSelectedPose(i)}
              >
                {pose.url && (
                  <img src={pose.url} alt={pose.pose_name} className="sm-pose-tab-thumb" />
                )}
                <span className="sm-pose-tab-label">{pose.pose_name}</span>
              </button>
            ))}
          </div>
        )}

        {asset.poses.length <= 1 && asset.poses.length > 0 && (
          <div className="sm-pose-single-label">
            <span className="sm-chip">{asset.poses[0].pose_name}</span>
          </div>
        )}
      </div>

      {asset.generation_prompt && (
        <details className="sm-prompt-details">
          <summary className="sm-prompt-summary">Generation prompt</summary>
          <pre className="sm-prompt-block">{asset.generation_prompt}</pre>
        </details>
      )}
    </div>
  )
}
