// Slide Type Definitions for FullyPresent
// Layout presets for different slide purposes

export type SlideType =
  | 'blank'
  | 'cover'
  | 'product-demo'
  | 'annotation'
  | 'section-break'

export interface SlideTypeConfig {
  id: SlideType
  name: string
  description: string
  icon: string
  layout: SlideLayout
}

export interface SlideLayout {
  title?: {
    position: 'top-left' | 'top-center' | 'center' | 'bottom-left'
    maxWidth: number
    fontSize: 'display' | 'title' | 'heading' | 'subheading'
    alignment: 'left' | 'center' | 'right'
  }
  subtitle?: {
    position: 'below-title' | 'center' | 'bottom'
    maxWidth: number
    fontSize: 'title' | 'heading' | 'subheading' | 'body'
    alignment: 'left' | 'center' | 'right'
  }
  image?: {
    position: 'center' | 'left' | 'right' | 'full'
    maxWidth: number
    maxHeight: number
    showDeviceMockup: boolean
  }
  annotations?: {
    enabled: boolean
    style: 'elegant-lines' | 'numbered' | 'arrows'
  }
}

export interface Annotation {
  id: string
  anchorX: number
  anchorY: number
  calloutX: number
  calloutY: number
  text: string
  lineStyle: 'straight' | 'elbow' | 'curved'
}

export const SPIEKERMANN_SLIDE_TYPES: Record<SlideType, SlideTypeConfig> = {
  blank: {
    id: 'blank',
    name: 'Blank',
    description: 'Empty slide for custom content',
    icon: '\u2610',
    layout: {},
  },
  cover: {
    id: 'cover',
    name: 'Cover',
    description: 'Title slide with logo and tagline',
    icon: '\u25C8',
    layout: {
      title: {
        position: 'center',
        maxWidth: 80,
        fontSize: 'display',
        alignment: 'center',
      },
      subtitle: {
        position: 'below-title',
        maxWidth: 60,
        fontSize: 'subheading',
        alignment: 'center',
      },
    },
  },
  'product-demo': {
    id: 'product-demo',
    name: 'Product Demo',
    description: 'Screenshot in device mockup with title',
    icon: '\u25A3',
    layout: {
      title: {
        position: 'top-left',
        maxWidth: 100,
        fontSize: 'title',
        alignment: 'left',
      },
      image: {
        position: 'center',
        maxWidth: 75,
        maxHeight: 70,
        showDeviceMockup: true,
      },
    },
  },
  annotation: {
    id: 'annotation',
    name: 'Annotation',
    description: 'Screenshot with callout annotations',
    icon: '\u25CE',
    layout: {
      title: {
        position: 'top-left',
        maxWidth: 50,
        fontSize: 'heading',
        alignment: 'left',
      },
      image: {
        position: 'center',
        maxWidth: 60,
        maxHeight: 75,
        showDeviceMockup: false,
      },
      annotations: {
        enabled: true,
        style: 'elegant-lines',
      },
    },
  },
  'section-break': {
    id: 'section-break',
    name: 'Section Break',
    description: 'Large text to introduce a new section',
    icon: '\u25AC',
    layout: {
      title: {
        position: 'center',
        maxWidth: 70,
        fontSize: 'display',
        alignment: 'left',
      },
    },
  },
}

export const SPIEKERMANN_FONT_SIZES = {
  display: { size: 96, weight: 600, lineHeight: 1.1 },
  title: { size: 64, weight: 600, lineHeight: 1.2 },
  heading: { size: 48, weight: 600, lineHeight: 1.3 },
  subheading: { size: 32, weight: 500, lineHeight: 1.4 },
  body: { size: 24, weight: 400, lineHeight: 1.5 },
  caption: { size: 18, weight: 400, lineHeight: 1.5 },
  annotation: { size: 20, weight: 400, lineHeight: 1.4 },
}

export const SPIEKERMANN_ANNOTATION_STYLE = {
  lineColor: '#1a1a1a',
  lineColorDark: '#f5f5f5',
  lineWidth: 1.5,
  dotRadius: 4,
  calloutPadding: 12,
  calloutBackground: 'rgba(255, 255, 255, 0.95)',
  calloutBackgroundDark: 'rgba(20, 20, 20, 0.95)',
  calloutBorderRadius: 4,
  calloutMaxWidth: 280,
}

export function getSlideTypeConfig(
  slideType: SlideType,
  _template: 'spiekermann' | 'sagmeister' = 'spiekermann'
): SlideTypeConfig {
  return SPIEKERMANN_SLIDE_TYPES[slideType]
}

export function getAvailableSlideTypes(
  _template: 'spiekermann' | 'sagmeister' = 'spiekermann'
): SlideTypeConfig[] {
  return Object.values(SPIEKERMANN_SLIDE_TYPES)
}
