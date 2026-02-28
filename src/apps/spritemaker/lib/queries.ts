import { supabase } from '../../../lib/supabase'
import type { SpriteGame, SpriteAsset, StyleConfig } from './types'

// ─── Games ──────────────────────────────────────

export async function fetchGames(householdId: string): Promise<SpriteGame[]> {
  const { data, error } = await supabase
    .from('sprite_games')
    .select('*')
    .eq('household_id', householdId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as SpriteGame[]
}

export async function fetchGame(gameId: string): Promise<SpriteGame | null> {
  const { data, error } = await supabase
    .from('sprite_games')
    .select('*')
    .eq('id', gameId)
    .single()

  if (error) return null
  return data as SpriteGame
}

export async function createGame(
  householdId: string,
  name: string,
  description: string,
  styleConfig: StyleConfig
): Promise<SpriteGame> {
  const { data, error } = await supabase
    .from('sprite_games')
    .insert({
      household_id: householdId,
      name,
      description: description || null,
      style_config: styleConfig,
    })
    .select()
    .single()

  if (error) throw error
  return data as SpriteGame
}

export async function updateGame(
  gameId: string,
  updates: Partial<Pick<SpriteGame, 'name' | 'description'>> & { style_config?: StyleConfig }
): Promise<SpriteGame> {
  const { data, error } = await supabase
    .from('sprite_games')
    .update(updates)
    .eq('id', gameId)
    .select()
    .single()

  if (error) throw error
  return data as SpriteGame
}

export async function deleteGame(gameId: string): Promise<void> {
  const { error } = await supabase
    .from('sprite_games')
    .delete()
    .eq('id', gameId)

  if (error) throw error
}

// ─── Assets ─────────────────────────────────────

export async function fetchAssets(gameId: string): Promise<SpriteAsset[]> {
  const { data, error } = await supabase
    .from('sprite_assets')
    .select('*')
    .eq('game_id', gameId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as SpriteAsset[]
}

export async function fetchAsset(assetId: string): Promise<SpriteAsset | null> {
  const { data, error } = await supabase
    .from('sprite_assets')
    .select('*')
    .eq('id', assetId)
    .single()

  if (error) return null
  return data as SpriteAsset
}

export async function createAsset(
  gameId: string,
  householdId: string,
  asset: {
    name: string
    type: string
    description?: string
    poses: { pose_name: string; storage_path: string; url: string }[]
    generation_prompt?: string
    metadata?: Record<string, unknown>
  }
): Promise<SpriteAsset> {
  const { data, error } = await supabase
    .from('sprite_assets')
    .insert({
      game_id: gameId,
      household_id: householdId,
      name: asset.name,
      type: asset.type,
      description: asset.description || null,
      poses: asset.poses,
      generation_prompt: asset.generation_prompt || null,
      metadata: asset.metadata || {},
    })
    .select()
    .single()

  if (error) throw error
  return data as SpriteAsset
}

export async function updateAsset(
  assetId: string,
  updates: Partial<Pick<SpriteAsset, 'name' | 'type' | 'description' | 'poses' | 'metadata'>>
): Promise<SpriteAsset> {
  const { data, error } = await supabase
    .from('sprite_assets')
    .update(updates)
    .eq('id', assetId)
    .select()
    .single()

  if (error) throw error
  return data as SpriteAsset
}

export async function deleteAsset(assetId: string): Promise<void> {
  const { error } = await supabase
    .from('sprite_assets')
    .delete()
    .eq('id', assetId)

  if (error) throw error
}

// ─── Storage ────────────────────────────────────

export async function uploadSpriteImage(
  path: string,
  file: Blob
): Promise<string> {
  const { error } = await supabase.storage
    .from('sprite-assets')
    .upload(path, file, { contentType: 'image/png', upsert: true })

  if (error) throw error

  const { data } = supabase.storage
    .from('sprite-assets')
    .getPublicUrl(path)

  return data.publicUrl
}

export async function deleteSpriteImage(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from('sprite-assets')
    .remove([path])

  if (error) throw error
}
