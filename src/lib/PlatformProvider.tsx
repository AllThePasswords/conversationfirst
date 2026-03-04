// Platform provider: wraps authenticated content
// Provides householdId and currentApp config via context.

import { createContext, useContext } from 'react'
import type { AppConfig } from './types'
import { getAppConfig } from './appRegistry'

interface PlatformContextValue {
  householdId: string | null
  currentApp: AppConfig | null
}

export const PlatformCtx = createContext<PlatformContextValue>({
  householdId: null,
  currentApp: null,
})

export function usePlatform(): PlatformContextValue {
  return useContext(PlatformCtx)
}

export function getPlatformValue(
  householdId: string | null,
  appId: string
): PlatformContextValue {
  return {
    householdId,
    currentApp: getAppConfig(appId),
  }
}
