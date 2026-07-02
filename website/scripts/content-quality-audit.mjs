/**
 * Audits LeetCode + GFG pages for AdSense / thin-content readiness.
 * Run: node scripts/content-quality-audit.mjs
 */
import fs from 'fs'
import path from 'path'

const ROOT = fs.existsSync(path.join(process.cwd(), 'lib', 'explanations.ts'))
  ? process.cwd()
  : path.join(process.cwd(), 'website')
const SOLUTIONS = path.join(ROOT, '..', 'solutions')
const GFG_SOLUTIONS = path.join(ROOT, '..', 'gfg-solutions')
const LC_EXP = fs.readFileSync(path.join(ROOT, 'lib/explanations.ts'), 'utf8')
const GFG_EXP = fs.readFileSync(path.join(ROOT, 'lib/gfg-explanations.ts'), 'utf8')

const MIN_APPROACH_CHARS = Number(process.env.MIN_APPROACH_CHARS ?? 120)
const MIN_RICH_WORDS = Number(process.env.MIN_RICH_WORDS ?? 80)

function parseLcExplanations(text) {
  const map = new Map()
  const blocks = [...text.matchAll(/^\s+(\d+):\s*\{([\s\S]*?)^\s+\},?\s*$/gm)]
  for (const [, num, body] of blocks) {
    const intuition = body.match(/intuition:\s*\n?\s*'([^']*)'|intuition:\s*\n?\s*"([^"]*)"/s)?.[1]
      ?? body.match(/intuition:\s*\n?\s*'([^']*)'|intuition:\s*\n?\s*"([^"]*)"/)?.[1]
      ?? ''
    const algo = [...body.matchAll(/'([^']{10,})'/g)].map(m => m[1])
    map.set(+num, { intuition, algorithm: algo })
  }
  return map
}

function wordCount(parts) {
  return parts.join(' ').trim().split(/\s+/).filter(Boolean).length
}

function parseApproachFromCode(code) {
  const m = code.match(/\/\/ Approach:([\s\S]*?)(?=\/\/ Time:|$)/)
  if (!m) return ''
  return m[1].replace(/\/\/\s?/gm, '').trim()
}

function hasComplexity(code) {
  return /\/\/ Time:/.test(code)
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function parseGfgSlugs(text) {
  return [...text.matchAll(/^  '([^']+)':\s*\{/gm)].map(m => m[1])
}

function isGfgStub(body) {
  const steps = [...body.matchAll(/'([^']+)'/g)].map(m => m[1])
  return steps.length > 0 && steps.every(s => /^see leetcode/i.test(s.trim()))
}

// --- LeetCode ---
const lcRich = parseLcExplanations(LC_EXP)
const lcFolders = fs.readdirSync(SOLUTIONS).filter(n => /^\d+\./.test(n))

const lcStats = { total: 0, richSubstantial: 0, richThin: 0, approachOnly: 0, noIndex: 0 }
const lcThinRich = []
const lcApproachOnly = []
const lcNoIndex = []

for (const folder of lcFolders) {
  lcStats.total++
  const num = +folder.match(/^(\d+)/)[1]
  const title = folder.replace(/^\d+\.\s*/, '')
  const files = fs.readdirSync(path.join(SOLUTIONS, folder))
  const codeFile = files.find(x => x.endsWith('.cs')) || files[0]
  const code = codeFile ? fs.readFileSync(path.join(SOLUTIONS, folder, codeFile), 'utf8') : ''
  const approach = parseApproachFromCode(code)
  const cx = hasComplexity(code)

  const exp = lcRich.get(num)
  if (exp?.intuition) {
    const wc = wordCount([exp.intuition, ...exp.algorithm])
    if (wc >= MIN_RICH_WORDS) {
      lcStats.richSubstantial++
    } else {
      lcStats.richThin++
      lcThinRich.push({ num, title, words: wc })
    }
    continue
  }

  if (approach.length >= MIN_APPROACH_CHARS && cx) {
    lcStats.approachOnly++
    lcApproachOnly.push({ num, title, approachChars: approach.length })
  } else {
    lcStats.noIndex++
    lcNoIndex.push({ num, title, approachChars: approach.length, hasCx: cx })
  }
}

lcThinRich.sort((a, b) => a.words - b.words)
lcApproachOnly.sort((a, b) => a.approachChars - b.approachChars)

// --- GFG ---
const gfgSlugs = parseGfgSlugs(GFG_EXP)
const gfgFolders = fs.readdirSync(GFG_SOLUTIONS)
const gfgStats = { total: gfgFolders.length, richSubstantial: 0, richThin: 0, stubs: 0, approachOnly: 0, noIndex: 0 }
const gfgThin = []
const gfgStubs = []

for (const folder of gfgFolders) {
  const slug = slugify(folder)
  const bodyMatch = GFG_EXP.match(new RegExp(`'${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}':\\s*\\{([\\s\\S]*?)^\\s+\\},`, 'm'))
  const body = bodyMatch?.[1] ?? ''

  const files = fs.readdirSync(path.join(GFG_SOLUTIONS, folder))
  const javaFile = files.find(f => f.endsWith('.java')) || files[0]
  const code = javaFile ? fs.readFileSync(path.join(GFG_SOLUTIONS, folder, javaFile), 'utf8') : ''
  const approach = parseApproachFromCode(code)
  const cx = hasComplexity(code)

  if (body && !isGfgStub(body)) {
    const intuition = (body.match(/intuition:\s*\n?\s*'([^']*)'/)?.[1]) ?? ''
    const algo = [...body.matchAll(/'([^']{8,})'/g)].map(m => m[1]).slice(0, 8)
    const wc = wordCount([intuition, ...algo])
    if (wc >= MIN_RICH_WORDS) gfgStats.richSubstantial++
    else {
      gfgStats.richThin++
      gfgThin.push({ slug, folder, words: wc })
    }
    continue
  }

  if (body && isGfgStub(body)) {
    gfgStats.stubs++
    gfgStubs.push(slug)
    continue
  }

  if (approach.length >= MIN_APPROACH_CHARS && cx) {
    gfgStats.approachOnly++
  } else {
    gfgStats.noIndex++
  }
}

const sitemapLc = lcStats.richSubstantial + lcStats.richThin + lcStats.approachOnly
const recommendedIndexable = lcStats.richSubstantial + gfgStats.richSubstantial

console.log('=== Content quality audit (AdSense prep) ===')
console.log(`Thresholds: MIN_APPROACH_CHARS=${MIN_APPROACH_CHARS}, MIN_RICH_WORDS=${MIN_RICH_WORDS}`)
console.log('')
console.log('LeetCode:', lcStats)
console.log(`  → Recommended indexable (substantial rich only): ${lcStats.richSubstantial}`)
console.log(`  → Currently indexable (old 60-char rule): ~881`)
console.log('')
console.log('GFG:', gfgStats)
console.log('')
console.log('Priority 1 — expand thin rich LC explanations (top 20):')
console.table(lcThinRich.slice(0, 20))
console.log('')
console.log('Priority 2 — add rich explanations (approach-only, shortest first, top 15):')
console.table(lcApproachOnly.slice(0, 15))
console.log('')
console.log('Priority 3 — noindex until improved (sample):')
console.table(lcNoIndex.slice(0, 10))
console.log('')
console.log(`GFG stubs to replace: ${gfgStubs.length}`)
if (gfgStubs.length) console.log(gfgStubs.slice(0, 10).join(', '))
