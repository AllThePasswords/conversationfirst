import type { InterviewSession } from './types'

const STORAGE_KEY = (householdId: string) => `op-sessions-${householdId}`

export function loadSessions(householdId: string): InterviewSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(householdId))
    if (!raw) return []
    const sessions = JSON.parse(raw) as InterviewSession[]
    return sessions.sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    )
  } catch {
    return []
  }
}

export function saveSession(householdId: string, session: InterviewSession): void {
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

export function generateSessionTitle(session: InterviewSession): string {
  if (session.questions.length > 0) {
    const firstQ = session.questions[0].text
    if (firstQ.length <= 50) return firstQ
    return firstQ.slice(0, 50).replace(/\s+\S*$/, '') + '\u2026'
  }
  const d = new Date(session.startedAt)
  return `Interview \u2014 ${d.toLocaleDateString('en-IE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`
}

export function formatDuration(startedAt: string, endedAt: string | null): string {
  const start = new Date(startedAt).getTime()
  const end = endedAt ? new Date(endedAt).getTime() : Date.now()
  const totalSec = Math.floor((end - start) / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  if (min >= 60) {
    const hr = Math.floor(min / 60)
    const rm = min % 60
    return `${hr}:${String(rm).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export function formatTimestamp(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}
