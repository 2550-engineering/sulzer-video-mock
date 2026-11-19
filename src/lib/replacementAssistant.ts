import { assistantCopy, assistantQA, type AssistantQA } from '../data/replacementAssistant'

const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9 ]/g, '')

/**
 * The Q&A whose question and answer contain the most of the typed words (the guide's
 * findAnswer). Ties go to the earlier entry; no matching word at all gives null.
 */
export function findAnswer(input: string, items: AssistantQA[] = assistantQA): AssistantQA | null {
  const words = normalize(input).split(/\s+/).filter(Boolean)
  if (!words.length) return null

  let best: AssistantQA | null = null
  let bestScore = 0
  for (const item of items) {
    const haystack = `${normalize(item.q)} ${normalize(item.a)}`
    const score = words.reduce((n, word) => n + (haystack.includes(word) ? 1 : 0), 0)
    if (score > bestScore) {
      bestScore = score
      best = item
    }
  }
  return best
}

/** The suggestions shown after an answer: the first three that weren't just asked. */
export function nextSuggestions(asked: string): string[] {
  return assistantCopy.suggestions.filter((q) => q !== asked).slice(0, 3)
}

export type TextPart = { text: string; bold: boolean }

/** Splits `**bold**` markers into parts; an unclosed marker stays plain text. */
export function parseBold(text: string): TextPart[] {
  const pieces = text.split('**')
  // An even count means an odd number of markers: the last one has no partner.
  const closed =
    pieces.length % 2 === 1 ? pieces : [...pieces.slice(0, -2), pieces.slice(-2).join('**')]
  return closed
    .map((piece, index) => ({ text: piece, bold: index % 2 === 1 }))
    .filter((part) => part.text !== '')
}
