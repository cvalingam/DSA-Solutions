import { getAllProblemsMeta, type ProblemMeta } from './problems'
import { hasSubstantialLcExplanation } from './content-quality'

/**
 * High-intent classics plus pages already getting organic traffic on dsasolved.com.
 * Keep this list short — it powers homepage and study-guide internal links.
 */
export const POPULAR_LC_NUMBERS = [
  4,   // Median of Two Sorted Arrays — current GA traffic
  14,  // Longest Common Prefix — current GA traffic
  1,   // Two Sum — top search volume
  3,   // Longest Substring Without Repeating Characters
  11,  // Container With Most Water
  15,  // 3Sum
  53,  // Maximum Subarray
  121, // Best Time to Buy and Sell Stock
  206, // Reverse Linked List
  704, // Binary Search
] as const

export function getPopularLcProblems(): ProblemMeta[] {
  const byNumber = new Map(getAllProblemsMeta().map(p => [p.number, p]))
  return POPULAR_LC_NUMBERS
    .map(n => byNumber.get(n))
    .filter((p): p is ProblemMeta => !!p)
}

export function getPopularExplainedLcProblems(): ProblemMeta[] {
  return getPopularLcProblems().filter(p => hasSubstantialLcExplanation(p.number))
}
