import fs from 'fs'
import path from 'path'

const SOLUTIONS = path.join(process.cwd(), '..', 'solutions')
const expText = fs.readFileSync('lib/explanations.ts', 'utf8')
const rich = new Set([...expText.matchAll(/^\s+(\d+):\s*\{/gm)].map(m => +m[1]))

const folders = fs.readdirSync(SOLUTIONS).filter(n => /^\d+\./.test(n))
let indexable = 0
let noindex = 0
for (const f of folders) {
  const num = +f.match(/^(\d+)/)[1]
  if (rich.has(num)) { indexable++; continue }
  const files = fs.readdirSync(path.join(SOLUTIONS, f))
  const codeFile = files.find(x => x.endsWith('.cs')) || files[0]
  if (!codeFile) { noindex++; continue }
  const code = fs.readFileSync(path.join(SOLUTIONS, f, codeFile), 'utf8')
  const approach = code.match(/\/\/ Approach:([\s\S]*?)(?=\/\/ Time:|$)/)?.[1]?.replace(/\/\/\s?/gm, '').trim() || ''
  const hasCx = /\/\/ Time:/.test(code)
  if (approach.length >= 60 && hasCx) indexable++
  else noindex++
}
console.log(JSON.stringify({ total: folders.length, rich: rich.size, indexable, noindex }))
