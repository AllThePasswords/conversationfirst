// Household context + hook
// Provides householdId to any component in the tree.
// Runs ensureHousehold() on mount so the household always exists.

import { createContext, useContext, useState, useEffect } from 'react'
import { ensureHousehold } from './connections'

interface HouseholdContextValue {
  householdId: string | null
  loading: boolean
  error: string | null
}

export const HouseholdCtx = createContext<HouseholdContextValue>({
  householdId: null,
  loading: true,
  error: null,
})

export function useHousehold(): HouseholdContextValue {
  return useContext(HouseholdCtx)
}

export function useHouseholdProvider(): HouseholdContextValue {
  const [householdId, setHouseholdId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const hid = await ensureHousehold()
        if (!cancelled) {
          setHouseholdId(hid)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load household')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()
    return () => { cancelled = true }
  }, [])

  return { householdId, loading, error }
}
