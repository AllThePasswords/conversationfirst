// Memory query layer: persistent knowledge across all apps
// Stores facts, preferences, patterns, and events accumulated over time.

import { supabase } from './supabase'
import type { Memory, MemoryType } from './types'

export async function fetchMemories(
  householdId: string,
  opts?: {
    memoryType?: MemoryType
    sourceApp?: string
    entityType?: string
    entityId?: string
    tags?: string[]
    limit?: number
  }
): Promise<Memory[]> {
  let query = supabase
    .from('memories')
    .select('*')
    .eq('household_id', householdId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (opts?.memoryType) query = query.eq('memory_type', opts.memoryType)
  if (opts?.sourceApp) query = query.eq('source_app', opts.sourceApp)
  if (opts?.entityType) query = query.eq('entity_type', opts.entityType)
  if (opts?.entityId) query = query.eq('entity_id', opts.entityId)
  if (opts?.tags && opts.tags.length > 0) query = query.overlaps('tags', opts.tags)
  if (opts?.limit) query = query.limit(opts.limit)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Memory[]
}

export async function createMemory(
  householdId: string,
  data: {
    content: string
    memory_type: MemoryType
    source_app?: string
    source_id?: string
    entity_type?: string
    entity_id?: string
    confidence?: number
    tags?: string[]
    metadata?: Record<string, unknown>
  }
): Promise<Memory> {
  const { data: memory, error } = await supabase
    .from('memories')
    .insert({
      household_id: householdId,
      content: data.content,
      memory_type: data.memory_type,
      source_app: data.source_app || null,
      source_id: data.source_id || null,
      entity_type: data.entity_type || null,
      entity_id: data.entity_id || null,
      confidence: data.confidence ?? 1.0,
      tags: data.tags || [],
      metadata: data.metadata || {},
    })
    .select('*')
    .single()

  if (error) throw error
  return memory as Memory
}
