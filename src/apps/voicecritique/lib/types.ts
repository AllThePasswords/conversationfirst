export type VCView = 'history' | 'recording' | 'result'

export type SessionStatus = 'recording' | 'processing' | 'completed'

export interface VCSession {
  id: string
  title: string
  createdAt: string
  status: SessionStatus
  rawTranscript: string
  structuredOutput: string | null
  durationMs: number
}
