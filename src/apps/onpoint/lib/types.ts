export interface Example {
  id: string
  tags: string[]
  questionKeywords: string[]
  lead: string
  context: string
  metrics: string
  category: string
  sourceFile?: string
}

export interface MatchResult {
  example: Example
  score: number
}

export interface MatchOutput {
  question: string
  match: MatchResult | null
  runnerUp: MatchResult | null
}

export interface OnPointSettings {
  sources: SourceFolder[]
  instructions: {
    style: string
    tone: string
    format: 'short' | 'medium' | 'bullets'
  }
}

export interface SourceFolder {
  type: 'folder'
  name: string
  path: string
  enabled: boolean
}

export interface TranscriptEntry {
  speaker: 'you' | 'them' | 'unknown'
  text: string
  timestamp: number
}

export interface SessionQuestion {
  id: string
  text: string
  detectedAt: number
  match: MatchResult | null
  runnerUp: MatchResult | null
}

export interface InterviewSession {
  id: string
  title: string
  startedAt: string
  endedAt: string | null
  status: 'active' | 'completed'
  transcript: TranscriptEntry[]
  questions: SessionQuestion[]
}

export type OnPointView = 'history' | 'session'
