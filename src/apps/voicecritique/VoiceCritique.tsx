import { useState, useEffect } from 'react'
import { fetchConnections } from '../../lib/connections'
import { supabase } from '../../lib/supabase'
import type { Connection } from '../../lib/types'
import { loadSessions, saveSession, deleteSession } from './lib/storage'
import type { VCView, VCSession } from './lib/types'
import SessionHistory from './components/SessionHistory'
import RecordingView from './components/RecordingView'
import ResultView from './components/ResultView'

interface VoiceCritiqueProps {
  householdId: string | null
}

export default function VoiceCritique({ householdId }: VoiceCritiqueProps) {
  const [view, setView] = useState<VCView>('history')
  const [sessions, setSessions] = useState<VCSession[]>([])
  const [activeSession, setActiveSession] = useState<VCSession | null>(null)
  const [deepgramKey, setDeepgramKey] = useState<string | null>(null)
  const [loadingKey, setLoadingKey] = useState(true)

  // Fetch Deepgram API key from vault
  useEffect(() => {
    if (!householdId) {
      setLoadingKey(false)
      return
    }
    fetchConnections(householdId, { providerType: 'api', status: 'active' })
      .then(conns => {
        const dg = conns.find(
          (c: Connection) => c.provider_name === 'deepgram' && c.status === 'active'
        )
        if (dg?.access_token) {
          setDeepgramKey(dg.access_token)
        }
      })
      .catch(() => {})
      .finally(() => setLoadingKey(false))
  }, [householdId])

  // Load sessions from localStorage
  useEffect(() => {
    if (!householdId) return
    setSessions(loadSessions(householdId))
  }, [householdId])

  // Emit screen context for sidebar chat
  useEffect(() => {
    const ctx: Record<string, unknown> = view === 'history'
      ? {
          view: 'session-history',
          summary: `${sessions.length} voice critiques.`,
          sessionCount: sessions.length,
        }
      : {
          view: 'active-session',
          summary: activeSession
            ? `${activeSession.status === 'processing' ? 'Structuring' : activeSession.status === 'completed' ? 'Viewing' : 'Recording'} critique. ${activeSession.title}`
            : 'Recording in progress.',
        }
    ;(window as unknown as Record<string, unknown>).__CF_SCREEN_CONTEXT = JSON.stringify(ctx)
    return () => {
      ;(window as unknown as Record<string, unknown>).__CF_SCREEN_CONTEXT = undefined
    }
  }, [view, sessions, activeSession])

  function handleNewRecording() {
    setActiveSession(null)
    setView('recording')
  }

  async function handleRecordingComplete(rawTranscript: string, durationMs: number) {
    const session: VCSession = {
      id: crypto.randomUUID(),
      title: rawTranscript.slice(0, 60).replace(/\s+\S*$/, '') + (rawTranscript.length > 60 ? '\u2026' : ''),
      createdAt: new Date().toISOString(),
      status: 'processing',
      rawTranscript,
      structuredOutput: null,
      durationMs,
    }
    setActiveSession(session)
    setView('result')
    if (householdId) saveSession(householdId, session)

    try {
      const { data: { session: authSession } } = await supabase.auth.getSession()
      if (!authSession) throw new Error('Not authenticated')

      const response = await supabase.functions.invoke('structure-critique', {
        headers: { Authorization: `Bearer ${authSession.access_token}` },
        body: { rawTranscript },
      })

      if (response.error) throw new Error(response.error.message)

      const structured = typeof response.data === 'string'
        ? response.data
        : response.data?.text || response.data

      const completed: VCSession = {
        ...session,
        status: 'completed',
        structuredOutput: typeof structured === 'string' ? structured : JSON.stringify(structured),
      }
      setActiveSession(completed)
      if (householdId) saveSession(householdId, completed)
    } catch (err) {
      console.error('Structure critique failed:', err)
      // Fallback: save raw transcript as output
      const failed: VCSession = {
        ...session,
        status: 'completed',
        structuredOutput: session.rawTranscript,
      }
      setActiveSession(failed)
      if (householdId) saveSession(householdId, failed)
    }
  }

  function handleBack() {
    if (householdId) setSessions(loadSessions(householdId))
    setActiveSession(null)
    setView('history')
  }

  function handleSelectSession(session: VCSession) {
    setActiveSession(session)
    setView('result')
  }

  if (loadingKey) {
    return (
      <div className="cf-loading">
        <span className="cf-loading-cursor" aria-hidden="true" />
        <span className="cf-loading-text">Loading&hellip;</span>
      </div>
    )
  }

  return (
    <div className="vc-container">
      {view === 'history' ? (
        <SessionHistory
          sessions={sessions}
          onNewRecording={handleNewRecording}
          onSelectSession={handleSelectSession}
          onDeleteSession={(id) => {
            if (householdId) {
              deleteSession(householdId, id)
              setSessions(loadSessions(householdId))
            }
          }}
          hasDeepgramKey={!!deepgramKey}
        />
      ) : view === 'recording' && deepgramKey ? (
        <RecordingView
          deepgramKey={deepgramKey}
          onComplete={handleRecordingComplete}
          onCancel={handleBack}
        />
      ) : activeSession?.status === 'processing' ? (
        <div className="vc-processing">
          <span className="cf-loading-cursor" aria-hidden="true" />
          <span className="vc-processing-text">Structuring your critique&hellip;</span>
        </div>
      ) : activeSession?.status === 'completed' ? (
        <ResultView
          session={activeSession}
          onBack={handleBack}
          onNewRecording={handleNewRecording}
        />
      ) : null}
    </div>
  )
}
