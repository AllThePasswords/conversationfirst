// ─── Style configuration (stored as JSONB on sprite_games) ──

export interface StyleConfig {
  resolution: { width: number; height: number }
  artStyle: string
  colorPalette: string[]
  poseDefinitions: string[]
  background: 'transparent' | string
  perspective: 'isometric' | 'top-down' | 'side-view'
  masterPrompt: string
}

export const DEFAULT_STYLE_CONFIG: StyleConfig = {
  resolution: { width: 64, height: 64 },
  artStyle: '',
  colorPalette: [],
  poseDefinitions: ['stand'],
  background: 'transparent',
  perspective: 'isometric',
  masterPrompt: '',
}

// ─── Database row types ─────────────────────────

export interface SpriteGame {
  id: string
  household_id: string
  name: string
  description: string | null
  style_config: StyleConfig
  created_at: string
  updated_at: string
}

export interface SpritePose {
  pose_name: string
  storage_path: string
  url: string
}

export type SpriteType = 'unit' | 'building' | 'prop' | 'effect'

export const SPRITE_TYPES: SpriteType[] = ['unit', 'building', 'prop', 'effect']

export interface SpriteAsset {
  id: string
  game_id: string
  household_id: string
  name: string
  type: SpriteType
  description: string | null
  poses: SpritePose[]
  generation_prompt: string | null
  metadata: Record<string, unknown>
  created_at: string
}

// ─── View state ─────────────────────────────────

export type SpriteView =
  | { kind: 'games-list' }
  | { kind: 'game-detail'; gameId: string }
  | { kind: 'sprite-preview'; gameId: string; spriteId: string }
  | { kind: 'style-guide'; gameId: string }
  | { kind: 'generate'; gameId: string }
  | { kind: 'upload'; gameId: string }

// ─── Generation ─────────────────────────────────

export interface GeneratedPose {
  poseName: string
  imageData: string   // base64
  approved: boolean
}
