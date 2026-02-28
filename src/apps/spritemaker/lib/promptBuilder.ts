import type { StyleConfig } from './types'

export function buildSpritePrompt(
  styleConfig: StyleConfig,
  spriteName: string,
  spriteType: string,
  spriteDescription: string,
  poseName: string
): string {
  const parts: string[] = []

  if (styleConfig.masterPrompt) {
    parts.push(styleConfig.masterPrompt)
  }

  parts.push(
    `Output resolution: ${styleConfig.resolution.width}x${styleConfig.resolution.height} pixels.`
  )

  if (styleConfig.artStyle) {
    parts.push(`Art style: ${styleConfig.artStyle}.`)
  }

  parts.push(`Perspective: ${styleConfig.perspective}.`)

  if (styleConfig.background === 'transparent') {
    parts.push('Background: transparent (alpha channel).')
  } else {
    parts.push(`Background: solid ${styleConfig.background}.`)
  }

  if (styleConfig.colorPalette.length > 0) {
    parts.push(
      `Color palette: use only these colors: ${styleConfig.colorPalette.join(', ')}.`
    )
  }

  parts.push(`Create a ${spriteType} sprite named "${spriteName}".`)
  parts.push(`Description: ${spriteDescription}`)
  parts.push(`Pose: ${poseName}.`)

  return parts.join('\n')
}
