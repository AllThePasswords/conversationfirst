// App registry: Layer 3 configuration
// Each app declares which connection types and memory types it can access.
// Permissions enforced client-side via hooks; RLS enforces household-level server-side.

import type { AppConfig } from './types'

export const APP_REGISTRY: Record<string, AppConfig> = {
  lifeadmin: {
    id: 'lifeadmin',
    name: 'LifeAdmin',
    connections: ['bank', 'email'],
    memoryRead: ['fact', 'preference', 'pattern', 'event'],
    memoryWrite: ['fact', 'event'],
    chat: true,
  },
  fullypresent: {
    id: 'fullypresent',
    name: 'FullyPresent',
    connections: ['api'],
    memoryRead: ['preference', 'pattern'],
    memoryWrite: ['preference'],
    chat: true,
  },
  onpoint: {
    id: 'onpoint',
    name: 'OnPoint',
    connections: ['api'],
    memoryRead: ['fact', 'preference', 'pattern', 'event'],
    memoryWrite: ['fact', 'preference', 'event'],
    chat: true,
  },
  voicecritique: {
    id: 'voicecritique',
    name: 'VoiceCritique',
    connections: ['api'],
    memoryRead: ['preference'],
    memoryWrite: ['preference'],
    chat: false,
  },
  spritemaker: {
    id: 'spritemaker',
    name: 'SpriteMaker',
    connections: ['api'],
    memoryRead: ['preference'],
    memoryWrite: ['preference'],
    chat: false,
  },
  conversationfirst: {
    id: 'conversationfirst',
    name: 'ConversationFirst',
    connections: ['bank', 'email', 'api'],
    memoryRead: ['fact', 'preference', 'pattern', 'event'],
    memoryWrite: ['fact', 'preference', 'pattern', 'event'],
    chat: true,
  },
}

export function getAppConfig(appId: string): AppConfig | null {
  return APP_REGISTRY[appId] ?? null
}
