// FullyPresent type definitions
// Extracted from the presentation store for clean imports

export type SlideType =
  | 'blank'
  | 'cover'
  | 'product-demo'
  | 'annotation'
  | 'section-break'

export interface Annotation {
  id: string
  anchorX: number
  anchorY: number
  calloutX: number
  calloutY: number
  text: string
  lineStyle: 'straight' | 'elbow' | 'curved'
}

export interface Slide {
  id: string
  canvasJson: string
  talkTrack: string
  slideType: SlideType
  annotations?: Annotation[]
  thumbnail?: string
}

export interface GlobalShadow {
  enabled: boolean
  darkness: number  // 0-100
  depth: number     // 0-100
}

export interface PresentationSettings {
  template: 'spiekermann' | 'sagmeister'
  colorMode: 'light' | 'dark'
  logoUrl?: string
  logoFileName?: string
  showLogoOnSlides: boolean
  signLanguageType?: 'asl' | 'bsl'
  signLanguagePosition?: 'bottom-right' | 'bottom-left'
  globalShadow?: GlobalShadow
  selectedVoiceId?: string
}

export interface VaultMediaItem {
  id: string
  name: string
  type: 'image' | 'video' | 'svg' | 'pdf'
  dataUrl: string
  thumbnail?: string
  createdAt: string
  pageCount?: number
}

export interface Presentation {
  id: string
  name: string
  nameManuallySet?: boolean
  createdAt: string
  updatedAt: string
  slides: Slide[]
  settings: PresentationSettings
  vault?: VaultMediaItem[]
}

export interface PresentationMeta {
  id: string
  name: string
  updatedAt: string
  slideCount: number
  thumbnailUrl?: string
}

export type PanelType = 'ai' | 'chat' | 'design' | 'settings' | 'talkTrack' | 'vault'
