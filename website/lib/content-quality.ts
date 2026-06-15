import explanations from './explanations'
import gfgExplanations from './gfg-explanations'
import type { RichExplanation } from './seo'
import type { Problem } from './problems'
import type { GfgProblem } from './gfg-problems'
import { TAG_LABELS, type Tag } from './tags'

/** Minimum characters in an approach comment to count as substantive. */
export const MIN_APPROACH_CHARS = 60

export function hasRichLcExplanation(number: number): boolean {
  const exp = explanations[number]
  return !!exp?.intuition && exp.algorithm.length > 0
}

/** GFG entry whose algorithm is only a LeetCode cross-reference. */
export function isGfgExplanationStub(exp: RichExplanation): boolean {
  if (exp.algorithm.length === 0) return true
  return exp.algorithm.every(step => /^see leetcode/i.test(step.trim()))
}

export function extractLeetCodeNumber(text: string): number | null {
  const m = text.match(/LeetCode\s+(\d+)/i)
  return m ? Number(m[1]) : null
}

/** Merge stub GFG explanations with the matching LeetCode explanation when available. */
export function resolveGfgExplanation(slug: string): RichExplanation | undefined {
  const raw = gfgExplanations[slug]
  if (!raw) return undefined
  if (!isGfgExplanationStub(raw)) return raw

  const lcNum =
    extractLeetCodeNumber(raw.intuition) ??
    extractLeetCodeNumber(raw.algorithm.join(' '))
  const lcExp = lcNum ? explanations[lcNum] : undefined
  if (!lcExp) return raw

  return {
    ...raw,
    intuition: raw.intuition.replace(/^Same as LeetCode\s+\d+\.\s*/i, '').trim() || lcExp.intuition,
    algorithm: lcExp.algorithm,
    example: raw.example ?? lcExp.example,
    pitfalls: raw.pitfalls ?? lcExp.pitfalls,
  }
}

export function hasQualityGfgExplanation(slug: string): boolean {
  const exp = resolveGfgExplanation(slug)
  if (!exp) return false
  return !!exp.intuition && exp.algorithm.length > 0 && !isGfgExplanationStub(exp)
}

export function hasSubstantialApproach(approach?: string): boolean {
  return !!approach && approach.replace(/\s+/g, ' ').trim().length >= MIN_APPROACH_CHARS
}

/** Pages safe to index in Google / AdSense review. */
export function isLcPageIndexable(problem: Problem): boolean {
  return hasRichLcExplanation(problem.number) ||
    (hasSubstantialApproach(problem.approach) && !!problem.complexity)
}

export function isGfgPageIndexable(problem: GfgProblem, slug: string): boolean {
  return hasQualityGfgExplanation(slug) ||
    (hasSubstantialApproach(problem.approach) && !!problem.complexity)
}

/** Show AdSense units only on pages with full step-by-step explanations. */
export function shouldShowAdsOnLcPage(problem: Problem): boolean {
  return hasRichLcExplanation(problem.number)
}

export function shouldShowAdsOnGfgPage(slug: string): boolean {
  return hasQualityGfgExplanation(slug)
}

export function buildLcProblemOverview(problem: Problem, rich?: RichExplanation): string {
  if (rich?.intuition) {
    const first = rich.intuition.split(/(?<=[.!?])\s+/)[0]
    return first.endsWith('.') || first.endsWith('!') || first.endsWith('?') ? first : `${first}.`
  }

  const tagNames = problem.tags.slice(0, 2).map(t => TAG_LABELS[t] ?? t)
  const tagPhrase = tagNames.length
    ? ` This is a common ${tagNames.join(' / ')} pattern in coding interviews.`
    : ''

  if (problem.approach) {
    const lead = problem.approach.split('\n')[0]
    return `${problem.title} (${problem.difficulty}) asks you to solve a structured algorithmic task.${tagPhrase} ${lead}`
  }

  return `${problem.title} is a ${problem.difficulty.toLowerCase()}-difficulty LeetCode problem.${tagPhrase} Study the solution below and note the time and space complexity before attempting variations on your own.`
}

export function buildGfgProblemOverview(problem: GfgProblem, rich?: RichExplanation): string {
  if (rich?.intuition) {
    const first = rich.intuition.split(/(?<=[.!?])\s+/)[0]
    return first.endsWith('.') || first.endsWith('!') || first.endsWith('?') ? first : `${first}.`
  }

  if (problem.approach) {
    return `${problem.title} is a popular GeeksforGeeks interview problem. ${problem.approach.split('\n')[0]}`
  }

  return `${problem.title} is a GeeksforGeeks problem often used in technical interviews. The Java solution below includes complexity analysis and is written to be clear and directly submittable.`
}

export function getTopicStudyTips(tag: Tag, label: string): string {
  return `To practice ${label} problems effectively, start with the Easy problems listed below, trace through each solution on paper, then re-implement without looking. When you can recognise the ${label.toLowerCase()} pattern within 30 seconds of reading a new problem, move on to Medium difficulty. Use the related topic pages and our study guide for a structured progression.`
}

export function countRichLcExplanations(): number {
  return Object.keys(explanations).length
}

export function countQualityGfgExplanations(): number {
  return Object.keys(gfgExplanations).filter(slug => hasQualityGfgExplanation(slug)).length
}
