import { describe, expect, it } from 'vitest'
import { assistantCopy, assistantQA } from '../data/replacementAssistant'
import { findAnswer, nextSuggestions, parseBold } from './replacementAssistant'

describe('replacement assistant', () => {
  it('has the guide knowledge base plus the discontinued-pump answer', () => {
    expect(assistantQA).toHaveLength(9)
    expect(assistantCopy.suggestions).toHaveLength(5)
    // Every chip has an answer of its own.
    for (const q of assistantCopy.suggestions) expect(findAnswer(q)?.q).toBe(q)
  })

  it('matches typed questions by keyword', () => {
    expect(findAnswer('patented contrablock')?.q).toBe('What is the Contrablock impeller?')
    expect(findAnswer('My Sulzer pump is discontinued')?.q).toBe('My Sulzer pump is discontinued')
    expect(findAnswer('rating plate successor')?.q).toBe('My Sulzer pump is discontinued')
    expect(findAnswer('What does IEC 60034 mean?')?.q).toBe('What is IE3 efficiency?')
  })

  it('falls back when nothing matches', () => {
    expect(findAnswer('')).toBeNull()
    expect(findAnswer('   ')).toBeNull()
    expect(findAnswer('xyzzy qwv')).toBeNull()
  })

  it('suggests three chips that were not just asked', () => {
    expect(nextSuggestions('Where can I order?')).toEqual([
      'Which brands can you replace?',
      'What is the ABS XFP range?',
      'How much energy can I save?',
    ])
    expect(nextSuggestions('Which brands can you replace?')).not.toContain(
      'Which brands can you replace?',
    )
  })

  it('splits bold markers', () => {
    expect(parseBold('a **b** c')).toEqual([
      { text: 'a ', bold: false },
      { text: 'b', bold: true },
      { text: ' c', bold: false },
    ])
    expect(parseBold('**IE3** rating')).toEqual([
      { text: 'IE3', bold: true },
      { text: ' rating', bold: false },
    ])
    expect(parseBold('2 ** 3')).toEqual([{ text: '2 ** 3', bold: false }])
  })
})
