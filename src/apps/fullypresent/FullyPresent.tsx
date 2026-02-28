import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { fetchConnections } from '../../lib/connections'
import type { Connection } from '../../lib/types'
import {
  usePresentationStore,
  useCurrentSlide,
  useSlides,
  useSettings,
  useActions,
} from './lib/presentationStore'
import { SimpleSlideCanvas } from './components/SlideCanvas'
import type { SimpleSlideCanvasHandle, SimpleSelectedObjectInfo } from './components/SlideCanvas'
import SlideThumbnails from './components/SlideThumbnails'
import ToolbarRail from './components/ToolbarRail'
import DesignPanel from './components/DesignPanel'
import TalkTrackPanel from './components/TalkTrackPanel'
import SettingsPanel from './components/SettingsPanel'
import PresentMode from './components/PresentMode'
import PresentationsList from './components/PresentationsList'
import GlobalChatPanel from './components/GlobalChatPanel'

interface FullyPresentProps {
  householdId: string | null
}

export default function FullyPresent({ householdId }: FullyPresentProps) {
  const canvasRef = useRef<SimpleSlideCanvasHandle>(null)
  const [selectedObject, setSelectedObject] = useState<SimpleSelectedObjectInfo | null>(null)
  const [apiConnections, setApiConnections] = useState<Connection[]>([])

  // Store state
  const currentSlide = useCurrentSlide()
  const slides = useSlides()
  const settings = useSettings()
  const actions = useActions()
  const currentSlideIndex = usePresentationStore(s => s.currentSlideIndex)
  const isPresentMode = usePresentationStore(s => s.isPresentMode)
  const activePanel = usePresentationStore(s => s.activePanel)
  const isLoading = usePresentationStore(s => s.isLoading)
  const view = usePresentationStore(s => s.view)
  const presentation = usePresentationStore(s => s.presentation)

  // Initialize store on mount
  useEffect(() => {
    actions.initialize()
  }, [actions])

  // Fetch Vault API connections
  useEffect(() => {
    if (!householdId) return
    fetchConnections(householdId).then(conns => {
      setApiConnections(conns.filter(c => c.provider_type === 'api' && c.status === 'active'))
    }).catch(() => {})
  }, [householdId])

  // Emit screen context for sidebar chat
  useEffect(() => {
    if (view === 'list') {
      window.__CF_SCREEN_CONTEXT = JSON.stringify({
        view: 'presentations-list',
        summary: `Viewing presentations list.`,
      })
    } else {
      const name = presentation?.name || 'Untitled'
      window.__CF_SCREEN_CONTEXT = JSON.stringify({
        view: 'slide-editor',
        summary: `Editing slide ${currentSlideIndex + 1} of ${slides.length}. Presentation: "${name}".`,
        selectedSlide: currentSlideIndex + 1,
        totalSlides: slides.length,
        currentTalkTrack: currentSlide?.talkTrack?.slice(0, 300) || '',
      })
    }
    return () => { window.__CF_SCREEN_CONTEXT = undefined }
  }, [view, currentSlideIndex, slides.length, currentSlide, presentation])

  // When slide changes, load canvas JSON
  useEffect(() => {
    if (!canvasRef.current || !currentSlide) return
    if (currentSlide.canvasJson) {
      canvasRef.current.loadJson(currentSlide.canvasJson)
    } else {
      canvasRef.current.clear()
    }
  }, [currentSlide?.id])

  // Save canvas JSON when canvas changes
  const handleContentChange = useCallback(() => {
    if (!canvasRef.current) return
    const json = canvasRef.current.getJson()
    actions.setCurrentSlideCanvasJson(json)
    const dataUrl = canvasRef.current.getDataUrl()
    actions.setCurrentSlideThumbnail(dataUrl)
  }, [actions])

  // Selection handler
  const handleSelectionChange = useCallback((info: SimpleSelectedObjectInfo | null) => {
    setSelectedObject(info)
  }, [])

  // Design panel actions
  const handleAddText = useCallback(() => {
    canvasRef.current?.addText()
  }, [])

  const handleAddMedia = useCallback((files: FileList) => {
    if (!canvasRef.current) return
    for (const file of Array.from(files)) {
      canvasRef.current.addFile(file)
    }
  }, [])

  const handleCornerRadiusChange = useCallback((radius: number) => {
    canvasRef.current?.setCornerRadius(radius)
  }, [])

  const handleShadowIntensityChange = useCallback((intensity: number) => {
    canvasRef.current?.setShadowIntensity(intensity)
  }, [])

  const handleShadowEnabledChange = useCallback((enabled: boolean) => {
    canvasRef.current?.setShadowEnabled(enabled)
  }, [])

  const handleShadowDarknessChange = useCallback((darkness: number) => {
    canvasRef.current?.setShadowDarkness(darkness)
  }, [])

  const handleShadowDepthChange = useCallback((depth: number) => {
    canvasRef.current?.setShadowDepth(depth)
  }, [])

  const handleVideoAutoplayChange = useCallback((autoplay: boolean) => {
    canvasRef.current?.setVideoAutoplay(autoplay)
  }, [])

  const handleVideoLoopChange = useCallback((loop: boolean) => {
    canvasRef.current?.setVideoLoop(loop)
  }, [])

  // Get slide content for AI context
  const getSlideContent = useCallback((index: number) => {
    if (index < 0 || index >= slides.length) return ''
    const slide = slides[index]
    return slide.talkTrack || ''
  }, [slides])

  // Present mode
  if (isPresentMode) {
    return (
      <PresentMode
        slides={slides}
        initialSlideIndex={currentSlideIndex}
        settings={settings}
        apiConnections={apiConnections}
        onExit={actions.exitPresentMode}
      />
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="fp-loading">
        <span className="fp-loading-cursor" />
        <span className="fp-loading-text">Loading</span>
      </div>
    )
  }

  // Presentations list view
  if (view === 'list') {
    return (
      <div className="fp-container">
        <PresentationsList />
      </div>
    )
  }

  return (
    <div className="fp-container">
      <div className="fp-header">
        <div className="fp-header-left">
          <button
            className="fp-back-btn"
            onClick={() => actions.setView('list')}
            aria-label="Back to presentations"
          >
            <ArrowLeftIcon aria-hidden="true" />
          </button>
          <div className="fp-header-title-group">
            <span className="cf-section-label">Presentations</span>
            <input
              className="fp-editor-title-input"
              value={presentation?.name || ''}
              onChange={(e) => actions.updateName(e.target.value)}
              placeholder="Untitled Presentation"
              aria-label="Presentation name"
            />
          </div>
        </div>
      </div>

      <div className="fp-editor">
        <SlideThumbnails
          slides={slides}
          currentIndex={currentSlideIndex}
          onSelect={actions.navigateToSlide}
          onAdd={() => actions.addSlide()}
          onDelete={actions.deleteSlide}
          onReorder={actions.reorderSlides}
        />

        <div className="fp-canvas-area">
          <SimpleSlideCanvas
            ref={canvasRef}
            onContentChange={handleContentChange}
            onSelectionChange={handleSelectionChange}
          />
        </div>

        <div className="fp-right-zone">
          <ToolbarRail
            activePanel={activePanel}
            onTogglePanel={actions.togglePanel}
            onPresent={actions.enterPresentMode}
          />

          {activePanel === 'design' && (
            <DesignPanel
              selectedObject={selectedObject}
              onAddText={handleAddText}
              onAddMedia={handleAddMedia}
              onCornerRadiusChange={handleCornerRadiusChange}
              onShadowIntensityChange={handleShadowIntensityChange}
              onShadowEnabledChange={handleShadowEnabledChange}
              onShadowDarknessChange={handleShadowDarknessChange}
              onShadowDepthChange={handleShadowDepthChange}
              onVideoAutoplayChange={handleVideoAutoplayChange}
              onVideoLoopChange={handleVideoLoopChange}
            />
          )}

          {activePanel === 'talkTrack' && currentSlide && (
            <TalkTrackPanel
              value={currentSlide.talkTrack}
              onChange={actions.setCurrentSlideTalkTrack}
              slideNumber={currentSlideIndex + 1}
              totalSlides={slides.length}
              slideContent={getSlideContent(currentSlideIndex)}
              prevSlideContent={getSlideContent(currentSlideIndex - 1)}
              nextSlideContent={getSlideContent(currentSlideIndex + 1)}
              apiConnections={apiConnections}
            />
          )}

          {activePanel === 'chat' && (
            <GlobalChatPanel />
          )}

          {activePanel === 'settings' && (
            <SettingsPanel
              settings={settings}
              onUpdate={actions.updateSettings}
            />
          )}
        </div>
      </div>
    </div>
  )
}
