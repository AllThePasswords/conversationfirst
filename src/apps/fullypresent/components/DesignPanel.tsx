import { useRef } from 'react'
import {
  PlusIcon,
  PhotoIcon,
  CursorArrowRaysIcon,
} from '@heroicons/react/24/outline'
import type { SimpleSelectedObjectInfo } from './SlideCanvas'

interface DesignPanelProps {
  selectedObject: SimpleSelectedObjectInfo | null
  onAddText: () => void
  onAddMedia: (files: FileList) => void
  onCornerRadiusChange: (radius: number) => void
  onShadowIntensityChange: (intensity: number) => void
  onShadowEnabledChange: (enabled: boolean) => void
  onShadowDarknessChange: (darkness: number) => void
  onShadowDepthChange: (depth: number) => void
  onVideoAutoplayChange: (autoplay: boolean) => void
  onVideoLoopChange: (loop: boolean) => void
}

export default function DesignPanel({
  selectedObject,
  onAddText,
  onAddMedia,
  onCornerRadiusChange,
  onShadowEnabledChange,
  onShadowDarknessChange,
  onShadowDepthChange,
  onVideoAutoplayChange,
  onVideoLoopChange,
}: DesignPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="fp-panel">
      <div className="fp-panel-header">
        <span className="fp-panel-title">Design</span>
      </div>
      <div className="fp-panel-body">
        <div className="fp-design-actions">
          <button className="fp-design-btn" onClick={onAddText}>
            <PlusIcon aria-hidden="true" />
            <span>Add text</span>
          </button>
          <button
            className="fp-design-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <PhotoIcon aria-hidden="true" />
            <span>Add media</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime,.mov,.svg,.pdf"
            multiple
            onChange={(e) => {
              if (e.target.files) onAddMedia(e.target.files)
              e.target.value = ''
            }}
            className="fp-sr-only"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>

        {selectedObject ? (
          <div className="fp-design-selection">
            <span className="fp-design-selection-label">
              {selectedObject.type === 'image' ? 'Image' :
               selectedObject.type === 'video' ? 'Video' :
               selectedObject.type === 'text' ? 'Text' : 'Selection'}
            </span>

            {(selectedObject.type === 'image' || selectedObject.type === 'video') && (
              <>
                <div className="fp-design-field">
                  <label className="fp-design-field-label">Corner radius</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedObject.cornerRadius ?? 0}
                    onChange={(e) => onCornerRadiusChange(Number(e.target.value))}
                    className="fp-design-slider"
                  />
                  <span className="fp-design-field-value">
                    {selectedObject.cornerRadius ?? 0}
                  </span>
                </div>

                <div className="fp-design-field fp-design-field--toggle">
                  <label className="fp-design-field-label">Shadow</label>
                  <button
                    className={`fp-design-toggle${selectedObject.shadowEnabled ? ' fp-design-toggle--active' : ''}`}
                    onClick={() => onShadowEnabledChange(!selectedObject.shadowEnabled)}
                    aria-label="Toggle shadow"
                    role="switch"
                    aria-checked={selectedObject.shadowEnabled}
                  >
                    <span className="fp-design-toggle-track">
                      <span className="fp-design-toggle-thumb" />
                    </span>
                  </button>
                </div>

                {selectedObject.shadowEnabled && (
                  <>
                    <div className="fp-design-field">
                      <label className="fp-design-field-label">Darkness</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedObject.shadowDarkness ?? 50}
                        onChange={(e) => onShadowDarknessChange(Number(e.target.value))}
                        className="fp-design-slider"
                      />
                      <span className="fp-design-field-value">
                        {selectedObject.shadowDarkness ?? 50}
                      </span>
                    </div>

                    <div className="fp-design-field">
                      <label className="fp-design-field-label">Depth</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedObject.shadowDepth ?? 50}
                        onChange={(e) => onShadowDepthChange(Number(e.target.value))}
                        className="fp-design-slider"
                      />
                      <span className="fp-design-field-value">
                        {selectedObject.shadowDepth ?? 50}
                      </span>
                    </div>
                  </>
                )}
              </>
            )}

            {selectedObject.type === 'video' && (
              <>
                <div className="fp-design-divider" />
                <span className="fp-design-selection-label">Playback</span>

                <div className="fp-design-field fp-design-field--toggle">
                  <label className="fp-design-field-label">Autoplay</label>
                  <button
                    className={`fp-design-toggle${selectedObject.videoAutoplay ? ' fp-design-toggle--active' : ''}`}
                    onClick={() => onVideoAutoplayChange(!selectedObject.videoAutoplay)}
                    aria-label="Toggle autoplay"
                    role="switch"
                    aria-checked={selectedObject.videoAutoplay}
                  >
                    <span className="fp-design-toggle-track">
                      <span className="fp-design-toggle-thumb" />
                    </span>
                  </button>
                </div>
                <span className="fp-design-field-hint">
                  {selectedObject.videoAutoplay ? 'Plays automatically when slide appears' : 'Click to play during presentation'}
                </span>

                <div className="fp-design-field fp-design-field--toggle">
                  <label className="fp-design-field-label">Loop</label>
                  <button
                    className={`fp-design-toggle${selectedObject.videoLoop ? ' fp-design-toggle--active' : ''}`}
                    onClick={() => onVideoLoopChange(!selectedObject.videoLoop)}
                    aria-label="Toggle loop"
                    role="switch"
                    aria-checked={selectedObject.videoLoop}
                  >
                    <span className="fp-design-toggle-track">
                      <span className="fp-design-toggle-thumb" />
                    </span>
                  </button>
                </div>
                <span className="fp-design-field-hint">
                  {selectedObject.videoLoop ? 'Repeats continuously' : 'Plays once'}
                </span>
              </>
            )}
          </div>
        ) : (
          <div className="fp-design-empty">
            <CursorArrowRaysIcon aria-hidden="true" />
            <span>Select an object to edit its properties</span>
          </div>
        )}
      </div>
    </div>
  )
}
