// Chat persistence layer: threads and messages
// Stores conversation history in Supabase for cross-session persistence.

import { supabase } from './supabase'
import type { ChatThread, ChatMessage } from './types'

export async function fetchThreads(
  householdId: string,
  opts?: { sourceApp?: string; limit?: number }
): Promise<ChatThread[]> {
  let query = supabase
    .from('chat_threads')
    .select('*')
    .eq('household_id', householdId)
    .eq('is_active', true)
    .order('updated_at', { ascending: false })

  if (opts?.sourceApp) query = query.eq('source_app', opts.sourceApp)
  if (opts?.limit) query = query.limit(opts.limit)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as ChatThread[]
}

export async function fetchMessages(
  threadId: string,
  opts?: { limit?: number; offset?: number }
): Promise<ChatMessage[]> {
  let query = supabase
    .from('chat_messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })

  if (opts?.limit) query = query.limit(opts.limit)
  if (opts?.offset) query = query.range(opts.offset, opts.offset + (opts.limit || 50) - 1)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as ChatMessage[]
}

export async function createThread(
  householdId: string,
  sourceApp?: string
): Promise<ChatThread> {
  const { data, error } = await supabase
    .from('chat_threads')
    .insert({
      household_id: householdId,
      source_app: sourceApp || 'conversationfirst',
      is_active: true,
    })
    .select('*')
    .single()

  if (error) throw error
  return data as ChatThread
}

export async function saveMessage(
  threadId: string,
  householdId: string,
  role: 'user' | 'assistant',
  content: string,
  toolCalls?: string[]
): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      thread_id: threadId,
      household_id: householdId,
      role,
      content,
      tool_calls: toolCalls && toolCalls.length > 0 ? toolCalls : null,
    })
    .select('*')
    .single()

  if (error) throw error

  // Update thread title from first user message and bump updated_at
  if (role === 'user') {
    const title = content.slice(0, 80) + (content.length > 80 ? '\u2026' : '')
    await supabase
      .from('chat_threads')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', threadId)
      .is('title', null)
  } else {
    await supabase
      .from('chat_threads')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', threadId)
  }

  return data as ChatMessage
}
