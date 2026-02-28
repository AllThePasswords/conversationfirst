// Platform type definitions for ConversationFirst
// Layer 1 (Vault), Layer 2 (Memory), Layer 3 (App Protocol)

// ─── Enums ──────────────────────────────────────

export type ProviderType = 'bank' | 'email' | 'api'
export type ConnectionStatus = 'pending' | 'active' | 'expired' | 'revoked'
export type MemoryType = 'fact' | 'preference' | 'pattern' | 'event'

// ─── Layer 1: Vault ─────────────────────────────

export interface Connection {
  id: string
  household_id: string
  provider_type: ProviderType
  provider_name: string
  display_name: string | null
  status: ConnectionStatus
  access_token: string | null
  refresh_token: string | null
  token_expires_at: string | null
  consent_expires_at: string | null
  metadata: Record<string, unknown>
  created_by_app: string | null
  created_at: string
  updated_at: string
}

export interface ConnectionAccount {
  id: string
  connection_id: string
  household_id: string
  external_id: string
  account_type: string | null
  display_name: string | null
  currency: string
  metadata: Record<string, unknown>
  last_synced_at: string | null
  sync_error: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EmailScanState {
  id: string
  connection_id: string
  household_id: string
  cursor_value: string | null
  last_scan_at: string | null
  messages_scanned: number
  bills_found: number
  created_at: string
  updated_at: string
}

export interface PendingExtraction {
  id: string
  household_id: string
  connection_id: string
  message_id: string
  attachment_id: string
  storage_path: string | null
  original_filename: string | null
  email_subject: string | null
  email_sender: string | null
  email_date: string | null
  status: 'pending' | 'processing' | 'done' | 'failed'
  error: string | null
  bill_id: string | null
  created_at: string
  updated_at: string
}

// ─── Layer 2: Memory ────────────────────────────

export interface ChatThread {
  id: string
  household_id: string
  title: string | null
  source_app: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  thread_id: string
  household_id: string
  role: 'user' | 'assistant'
  content: string
  tool_calls: string[] | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface Memory {
  id: string
  household_id: string
  content: string
  memory_type: MemoryType
  source_app: string | null
  source_id: string | null
  entity_type: string | null
  entity_id: string | null
  confidence: number
  tags: string[]
  metadata: Record<string, unknown>
  is_active: boolean
  created_at: string
  updated_at: string
}

// ─── Layer 3: App Protocol ──────────────────────

export interface AppConfig {
  id: string
  name: string
  connections: ProviderType[]  // which connection types this app can access
  memoryRead: MemoryType[]    // which memory types this app can read
  memoryWrite: MemoryType[]   // which memory types this app can write
  chat: boolean               // whether app has full sidebar chat
}
