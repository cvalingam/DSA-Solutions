import fs from 'fs'
import path from 'path'
import { getDifficulty } from './difficulty'
import { getTagsForProblem, type Tag } from './tags'

// solutions/ lives one level above the website/ folder
const SOLUTIONS_DIR = path.join(process.cwd(), '..', 'solutions')

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Unknown'

export interface Problem {
  number: number
  title: string
  slug: string        // e.g. "100-same-tree"
  difficulty: Difficulty
  tags: Tag[]
  primaryExt: string  // extension of the primary code file, e.g. 'cs', 'java', 'sql'
  code: string
  extraCodes?: Record<string, string>  // extension → code, e.g. { java: '...', sql: '...' }
  complexity?: { time: string; space: string }  // parsed from "// Time: O(n) Space: O(n)" comment
  approach?: string                              // parsed from "// Approach: ..." multi-line comment block
}

export interface ProblemMeta {
  number: number
  title: string
  slug: string
  difficulty: Difficulty
  tags: Tag[]
}

export function toSlug(number: number, _title?: string): string {
  return String(number)
}

// Module-level cache - built once per build process
let _problems: Problem[] | null = null

export function getAllProblems(): Problem[] {
  if (_problems) return _problems

  if (!fs.existsSync(SOLUTIONS_DIR)) {
    console.warn(`[problems] solutions directory not found: ${SOLUTIONS_DIR}`)
    return []
  }

  const folders = fs.readdirSync(SOLUTIONS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .filter(name => /^\d+\.\s+/.test(name))
    .sort((a, b) => {
      const na = parseInt(a.match(/^(\d+)/)![1])
      const nb = parseInt(b.match(/^(\d+)/)![1])
      return na - nb
    })

  const result: Problem[] = []

  for (const folder of folders) {
    const m = folder.match(/^(\d+)\.\s+(.+)$/)
    if (!m) continue

    const number = parseInt(m[1])
    const title = m[2].trim()
    const folderPath = path.join(SOLUTIONS_DIR, folder)

    // Priority order for primary language when no .cs file exists
    const ALL_EXTS = ['cs', 'java', 'sql', 'ts', 'go', 'cpp', 'py', 'sh']
    const filesInFolder = fs.readdirSync(folderPath)

    // Find primary file (prefer .cs, fall back to first available by priority)
    let primaryExt = ''
    let primaryFile = ''
    for (const ext of ALL_EXTS) {
      const match = filesInFolder.find(f => f.endsWith(`.${ext}`))
      if (match) { primaryExt = ext; primaryFile = match; break }
    }
    if (!primaryFile) continue

    const code = fs.readFileSync(path.join(folderPath, primaryFile), 'utf-8')

    // Parse complexity from comment: "// Time: O(...) Space: O(...)"
    const complexityMatch = code.match(/\/\/\s*Time:\s*(O\([^)]+\))\s+Space:\s*(O\([^)]+\))/i)
    const complexity = complexityMatch
      ? { time: complexityMatch[1], space: complexityMatch[2] }
      : undefined

    // Parse approach from comment block starting with "// Approach:"
    const approachLines: string[] = []
    let inApproach = false
    for (const line of code.split('\n')) {
      const t = line.trim()
      if (!inApproach) {
        const m = t.match(/^\/\/\s*Approach:\s*(.*)/)
        if (m) { inApproach = true; if (m[1].trim()) approachLines.push(m[1].trim()) }
      } else {
        if (t.match(/^\/\/\s*Time:/i)) break
        const cm = t.match(/^\/\/\s*(.+)/)
        if (cm) approachLines.push(cm[1].trim())
        else break
      }
    }
    const approach = approachLines.length > 0 ? approachLines.join('\n') : undefined

    // Read remaining language files as extra
    const extraCodes: Record<string, string> = {}
    for (const file of filesInFolder) {
      const ext = path.extname(file).slice(1)
      if (ALL_EXTS.includes(ext) && ext !== primaryExt) {
        extraCodes[ext] = fs.readFileSync(path.join(folderPath, file), 'utf-8')
      }
    }

    result.push({
      number,
      title,
      slug: toSlug(number, title),
      difficulty: getDifficulty(number),
      tags: getTagsForProblem(number),
      primaryExt,
      code,
      ...(complexity ? { complexity } : {}),
      ...(approach ? { approach } : {}),
      ...(Object.keys(extraCodes).length > 0 ? { extraCodes } : {}),
    })
  }

  _problems = result
  return result
}

export function getAllProblemsMeta(): ProblemMeta[] {
  return getAllProblems().map(({ number, title, slug, difficulty, tags }) => ({
    number, title, slug, difficulty, tags,
  }))
}

export function getProblemBySlug(slug: string): Problem | undefined {
  return getAllProblems().find(p => p.slug === slug)
}

export function getAdjacentProblems(slug: string): {
  prev: ProblemMeta | null
  next: ProblemMeta | null
} {
  const all = getAllProblems()
  const idx = all.findIndex(p => p.slug === slug)
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  }
}
