// Vault query layer: unified connection and account access
// Replaces LifeAdmin-specific bank queries with platform-wide vault operations.

import { supabase } from './supabase'
import type { Connection, ConnectionAccount, ProviderType } from './types'

// ─── Household resolution ───────────────────────

export async function fetchUserHouseholdId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('user_households')
    .select('household_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  return data?.household_id ?? null
}

export async function ensureHousehold(): Promise<string> {
  const existing = await fetchUserHouseholdId()
  if (existing) return existing

  // Use server-side RPC to create household + link atomically
  // (avoids RLS chicken-and-egg: INSERT succeeds but SELECT-back fails
  // because user_in_household() requires user_households row)
  const { data, error } = await supabase.rpc('ensure_household')
  if (error || !data) throw new Error('Failed to create household')
  return data as string
}

// ─── Connections ────────────────────────────────

export async function fetchConnections(
  householdId: string,
  opts?: { providerType?: ProviderType; status?: string }
): Promise<Connection[]> {
  let query = supabase
    .from('connections')
    .select('*')
    .eq('household_id', householdId)
    .order('created_at', { ascending: false })

  if (opts?.providerType) query = query.eq('provider_type', opts.providerType)
  if (opts?.status) query = query.eq('status', opts.status)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Connection[]
}

export async function fetchConnectionAccounts(
  householdId: string,
  opts?: { connectionId?: string; isActive?: boolean }
): Promise<ConnectionAccount[]> {
  let query = supabase
    .from('connection_accounts')
    .select('*')
    .eq('household_id', householdId)
    .order('display_name')

  if (opts?.connectionId) query = query.eq('connection_id', opts.connectionId)
  if (opts?.isActive !== undefined) query = query.eq('is_active', opts.isActive)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as ConnectionAccount[]
}

export async function deleteConnection(id: string): Promise<void> {
  const { error } = await supabase
    .from('connections')
    .update({ status: 'revoked' })
    .eq('id', id)

  if (error) throw error
}

// ─── Platform services ──────────────────────────

export interface PlatformService {
  provider_name: string
  display_name: string
  category: string
  configured: boolean
}

export async function fetchPlatformServices(): Promise<PlatformService[]> {
  // Platform services are built-in integrations configured server-side.
  // Return empty until a platform-services endpoint is deployed.
  return []
}

// ─── API key connections ────────────────────────

export async function createApiKeyConnection(params: {
  providerName: string
  apiKey: string
  apiSecret?: string
  displayName?: string
}): Promise<Connection> {
  const householdId = await fetchUserHouseholdId()
  if (!householdId) throw new Error('No household found')

  const { data, error } = await supabase
    .from('connections')
    .insert({
      household_id: householdId,
      provider_type: 'api' as const,
      provider_name: params.providerName,
      display_name: params.displayName || null,
      status: 'active',
      access_token: params.apiKey,
      metadata: params.apiSecret ? { api_secret: params.apiSecret } : {},
    })
    .select()
    .single()

  if (error) throw error
  return data as Connection
}
