// useMemory hook: memory access with app permission checks
// Wraps memory.ts queries with permission enforcement from AppConfig.

import { useCallback } from 'react'
import { usePlatform } from './PlatformProvider'
import { useHousehold } from './useHousehold'
import { fetchMemories, createMemory } from './memory'
import type { MemoryType, Memory } from './types'

export function useMemory() {
  const { householdId } = useHousehold()
  const { currentApp } = usePlatform()

  const getMemories = useCallback(async (opts?: {
    memoryType?: MemoryType
    tags?: string[]
    limit?: number
  }): Promise<Memory[]> => {
    if (!householdId) return []

    // Check read permission
    if (opts?.memoryType && currentApp && !currentApp.memoryRead.includes(opts.memoryType)) {
      console.warn(`App ${currentApp.id} cannot read ${opts.memoryType} memories`)
      return []
    }

    return fetchMemories(householdId, {
      memoryType: opts?.memoryType,
      sourceApp: undefined,
      tags: opts?.tags,
      limit: opts?.limit,
    })
  }, [householdId, currentApp])

  const storeMemory = useCallback(async (data: {
    content: string
    memory_type: MemoryType
    entity_type?: string
    entity_id?: string
    tags?: string[]
  }): Promise<Memory | null> => {
    if (!householdId) return null

    // Check write permission
    if (currentApp && !currentApp.memoryWrite.includes(data.memory_type)) {
      console.warn(`App ${currentApp.id} cannot write ${data.memory_type} memories`)
      return null
    }

    return createMemory(householdId, {
      ...data,
      source_app: currentApp?.id || 'conversationfirst',
    })
  }, [householdId, currentApp])

  return {
    getMemories,
    storeMemory,
  }
}
