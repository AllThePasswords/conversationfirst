// useVault hook — vault access with app permission checks
// Wraps connections.ts queries with permission enforcement from AppConfig.

import { useCallback } from 'react'
import { usePlatform } from './PlatformProvider'
import { useHousehold } from './useHousehold'
import {
  fetchConnections,
  fetchConnectionAccounts,
  deleteConnection,
} from './connections'
import type { ProviderType, Connection, ConnectionAccount } from './types'

export function useVault() {
  const { householdId } = useHousehold()
  const { currentApp } = usePlatform()

  const getConnections = useCallback(async (
    providerType?: ProviderType
  ): Promise<Connection[]> => {
    if (!householdId) return []

    // Check permission
    if (providerType && currentApp && !currentApp.connections.includes(providerType)) {
      console.warn(`App ${currentApp.id} does not have access to ${providerType} connections`)
      return []
    }

    return fetchConnections(householdId, { providerType })
  }, [householdId, currentApp])

  const getAccounts = useCallback(async (
    connectionId?: string
  ): Promise<ConnectionAccount[]> => {
    if (!householdId) return []
    return fetchConnectionAccounts(householdId, { connectionId, isActive: true })
  }, [householdId])

  const revokeConnection = useCallback(async (id: string): Promise<void> => {
    return deleteConnection(id)
  }, [])

  return {
    getConnections,
    getAccounts,
    revokeConnection,
  }
}
