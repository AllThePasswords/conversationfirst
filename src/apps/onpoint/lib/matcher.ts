import type { Example, MatchResult } from './types'

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'shall', 'can', 'to', 'of', 'in', 'for',
  'on', 'with', 'at', 'by', 'from', 'as', 'into', 'about', 'your',
  'you', 'me', 'my', 'i', 'we', 'our', 'tell', 'how', 'what', 'why',
  'when', 'where', 'which', 'that', 'this', 'it', 'and', 'or', 'but',
  'if', 'than', 'so', 'very', 'just', 'also', 'more', 'some', 'any',
  'all', 'each', 'every', 'both', 'few', 'most', 'other', 'like',
  'through', 'during', 'before', 'after', 'above', 'below', 'between',
  'same', 'different', 'been', 'being', 'having', 'doing', 'going',
  'get', 'got', 'getting', 'make', 'made', 'making', 'know', 'think',
  'really', 'right', 'well', 'much', 'even', 'back', 'way', 'thing',
  'things', 'them', 'they', 'their', 'there', 'then', 'now', 'here',
  'these', 'those', 'not', 'dont', "don't", 'its', "it's", 'one',
  'two', 'three', 'first', 'second', 'new', 'good', 'great', 'able',
  'something', 'around', 'kind', 'lot', 'give', 'given', 'talk',
  'walk', 'say', 'said', 'example', 'time', 'describe', 'explain',
])

export function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word))
}

function scoreExample(example: Example, questionKeywords: string[], questionText: string): number {
  let score = 0
  const qText = questionText.toLowerCase()
  const qSet = new Set(questionKeywords)
  const matchedQWords = new Set<string>()

  for (const phrase of example.questionKeywords) {
    if (qText.includes(phrase.toLowerCase())) {
      score += 5
      phrase.toLowerCase().split(/\s+/).forEach(w => matchedQWords.add(w))
    }
  }

  for (const phrase of example.questionKeywords) {
    const phraseWords = phrase.toLowerCase().split(/\s+/)
    for (const w of phraseWords) {
      if (w.length > 2 && qSet.has(w) && !matchedQWords.has(w)) {
        matchedQWords.add(w)
        score += 3
      }
    }
  }

  const matchedTagWords = new Set<string>()
  for (const tag of example.tags) {
    const tagWords = tag.toLowerCase().split('-')
    for (const w of tagWords) {
      if (w.length > 2 && qSet.has(w) && !matchedTagWords.has(w)) {
        matchedTagWords.add(w)
        score += 2
      }
    }
  }

  const contentKeywords = extractKeywords(`${example.lead} ${example.context}`)
  const contentSet = new Set(contentKeywords)
  let contentScore = 0
  for (const kw of questionKeywords) {
    if (contentSet.has(kw)) contentScore += 1
  }
  score += Math.min(contentScore, 5)

  return score
}

export class Matcher {
  private examples: Example[]

  constructor(examples: Example[]) {
    this.examples = examples
  }

  match(questionText: string): { match: MatchResult | null; runnerUp: MatchResult | null } {
    const keywords = extractKeywords(questionText)

    if (keywords.length === 0) {
      return { match: null, runnerUp: null }
    }

    const scored: MatchResult[] = this.examples.map(example => ({
      example,
      score: scoreExample(example, keywords, questionText),
    }))

    scored.sort((a, b) => b.score - a.score)

    if (scored[0].score === 0) {
      return { match: null, runnerUp: null }
    }

    return {
      match: scored[0],
      runnerUp: scored.length > 1 && scored[1].score > 0 ? scored[1] : null,
    }
  }
}
