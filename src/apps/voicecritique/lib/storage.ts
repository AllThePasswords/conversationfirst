import type { VCSession } from './types'

const STORAGE_KEY = (householdId: string) => `vc-sessions-${householdId}`

export function loadSessions(householdId: string): VCSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(householdId))
    if (!raw) return []
    const sessions = JSON.parse(raw) as VCSession[]
    return sessions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  } catch {
    return []
  }
}

export function saveSession(householdId: string, session: VCSession): void {
  const sessions = loadSessions(householdId)
  const idx = sessions.findIndex(s => s.id === session.id)
  if (idx >= 0) {
    sessions[idx] = session
  } else {
    sessions.unshift(session)
  }
  localStorage.setItem(STORAGE_KEY(householdId), JSON.stringify(sessions))
}

export function deleteSession(householdId: string, sessionId: string): void {
  const sessions = loadSessions(householdId).filter(s => s.id !== sessionId)
  localStorage.setItem(STORAGE_KEY(householdId), JSON.stringify(sessions))
}

export function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}
