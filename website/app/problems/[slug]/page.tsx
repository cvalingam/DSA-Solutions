import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllProblems, getProblemBySlug, getAdjacentProblems } from '@/lib/problems'
import { toLeetCodeSlug } from '@/lib/constants'
import { TAG_LABELS, TOPIC_DESCRIPTIONS } from '@/lib/tags'
import CodeBlockWithHeader, { type SupportedLang } from '@/components/CodeBlockWithHeader'
import LanguageTabs from '@/components/LanguageTabs'
import DifficultyBadge from '@/components/DifficultyBadge'
import AdUnit from '@/components/AdUnit'
import HelpfulWidget from '@/components/HelpfulWidget'
import BackToTop from '@/components/BackToTop'
import explanations from '@/lib/explanations'
import {
  buildLcArticleGraph,
  buildLcDescription,
  getRelatedLcProblems,
} from '@/lib/seo'

const EXT_TO_SHIKI: Record<string, SupportedLang> = {
  cs:   'csharp',
  java: 'java',
  sql:  'sql',
  ts:   'typescript',
  go:   'go',
  cpp:  'cpp',
  py:   'python',
  sh:   'bash',
}

interface Props {
  params: { slug: string }
}

// Tell Next.js which slugs to pre-render at build time
export async function generateStaticParams() {
  return getAllProblems().map(p => ({ slug: p.slug }))
}

// No dynamic pages at runtime — 404 for unknown slugs
export const dynamicParams = false

const EXT_TO_LABEL: Record<string, string> = {
  cs: 'C#', java: 'Java', sql: 'MySQL', ts: 'TypeScript',
  go: 'Go', cpp: 'C++', py: 'Python', sh: 'Shell',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const problem = getProblemBySlug(params.slug)
  if (!problem) return {}

  const primaryLabel = EXT_TO_LABEL[problem.primaryExt] ?? problem.primaryExt.toUpperCase()
  const rich = explanations[problem.number]
  const title = `${problem.number}. ${problem.title}`
  const desc = buildLcDescription(problem, rich)
  const ogImage = `/problems/${problem.slug}/opengraph-image`

  return {
    title,
    description: desc,
    keywords: [
      `LeetCode ${problem.number}`,
      problem.title,
      `${primaryLabel} solution`,
      problem.difficulty,
      ...problem.tags,
    ],
    alternates: {
      canonical: `/problems/${problem.slug}`,
    },
    openGraph: {
      title: `${title} — LeetCode ${primaryLabel} Solution`,
      description: desc,
      type: 'article',
      url: `/problems/${problem.slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `LeetCode ${problem.number} ${problem.title}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${primaryLabel} Solution`,
      description: desc,
      images: [ogImage],
    },
  }
}

export default async function ProblemPage({ params }: Props) {
  const problem = getProblemBySlug(params.slug)
  if (!problem) notFound()

  const { prev, next } = getAdjacentProblems(params.slug)
  const related = getRelatedLcProblems(problem)
  const lcSlug = toLeetCodeSlug(problem.title)
  const primaryLabel = EXT_TO_LABEL[problem.primaryExt] ?? problem.primaryExt.toUpperCase()
  const rich = explanations[problem.number]
  const articleJsonLd = buildLcArticleGraph(problem, rich, primaryLabel)

  return (
    <article className="max-w-3xl mx-auto py-8">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-indigo-600 transition-colors">LeetCode</Link>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-600 font-medium truncate">{problem.number}. {problem.title}</span>
      </nav>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-3">
        {problem.number}. {problem.title}
      </h1>

      {/* Meta row */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <DifficultyBadge difficulty={problem.difficulty} />
        <span className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
        <a
          href={`https://leetcode.com/problems/${lcSlug}/`}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          View on LeetCode
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Tags */}
      {problem.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {problem.tags.map(tag => (
            <a
              key={tag}
              href={`/topics/${tag}`}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-900 transition-colors border border-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800 dark:hover:bg-indigo-900"
            >
              {TAG_LABELS[tag] ?? tag}
            </a>
          ))}
        </div>
      )}

      {/* Complexity */}
      {problem.complexity && (
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/50 dark:border-emerald-900">
            <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Time: <span className="font-mono">{problem.complexity.time}</span></span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-50 border border-violet-100 dark:bg-violet-950/50 dark:border-violet-900">
            <svg className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h10M4 17h6" />
            </svg>
            <span className="text-xs font-medium text-violet-700 dark:text-violet-300">Space: <span className="font-mono">{problem.complexity.space}</span></span>
          </div>
        </div>
      )}

      {/* Ad: leaderboard — placed after metadata, before explanation */}
      <AdUnit slot="4545599910" style="leaderboard" className="mb-8" />

      {/* Rich explanation (structured) or plain approach fallback */}
      {(() => {
        const rich = explanations[problem.number]
        if (rich) {
          return (
            <div className="mb-8 space-y-4">
              {/* Intuition */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900">
                <h2 className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  Intuition
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{rich.intuition}</p>
              </div>

              {/* Algorithm steps */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800">
                <h2 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Algorithm</h2>
                <ol className="space-y-2 list-none">
                  {rich.algorithm.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Example walkthrough */}
              {rich.example && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
                  <h2 className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    Example Walkthrough
                  </h2>
                  <p className="text-xs font-mono text-blue-800 dark:text-blue-300 bg-blue-100/60 dark:bg-blue-900/40 rounded px-3 py-1.5 mb-3 break-all">Input: {rich.example.input}</p>
                  <ol className="space-y-1.5 list-none mb-3">
                    {rich.example.steps.map((step, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        <span className="flex-shrink-0 text-blue-400 dark:text-blue-500 font-mono text-xs mt-0.5">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="text-xs font-mono text-blue-800 dark:text-blue-300 bg-blue-100/60 dark:bg-blue-900/40 rounded px-3 py-1.5 break-all">Output: {rich.example.output}</p>
                </div>
              )}

              {/* Common pitfalls */}
              {rich.pitfalls && rich.pitfalls.length > 0 && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900">
                  <h2 className="flex items-center gap-1.5 text-[11px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-3">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    Common Pitfalls
                  </h2>
                  <ul className="space-y-2">
                    {rich.pitfalls.map((pitfall, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        <span className="flex-shrink-0 text-red-400 dark:text-red-500 mt-0.5">•</span>
                        <span>{pitfall}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        }

        if (problem.approach) {
          return (
            <div className="mb-8 space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900">
                <h2 className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  Approach
                </h2>
                <div className="space-y-1.5">
                  {problem.approach.split('\n').map((para, i) => (
                    <p key={i} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{para}</p>
                  ))}
                </div>
              </div>
              {problem.tags.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800">
                  <h2 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Key Techniques</h2>
                  <div className="space-y-4">
                    {problem.tags.slice(0, 3).map(tag => {
                      const desc = TOPIC_DESCRIPTIONS[tag]
                      if (!desc) return null
                      return (
                        <div key={tag}>
                          <a href={`/topics/${tag}`} className="inline-block text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-1">{TAG_LABELS[tag] ?? tag}</a>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        }

        // Generated description for problems that have no hand-written explanation yet
        {
          const tagNames = problem.tags.map(t => TAG_LABELS[t] ?? t)
          const tagPhrase = tagNames.length > 0
            ? ` covering the ${tagNames.slice(0, 3).join(', ')} pattern${tagNames.length > 1 ? 's' : ''}`
            : ''
          const complexityPhrase = problem.complexity
            ? ` The solution runs in ${problem.complexity.time} time and uses ${problem.complexity.space} extra space.`
            : ''
          const langLabel = EXT_TO_LABEL[problem.primaryExt] ?? problem.primaryExt.toUpperCase()
          return (
            <div className="mb-8 space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800">
                <h2 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">About this solution</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {problem.title} is a {problem.difficulty.toLowerCase()}-difficulty LeetCode problem{tagPhrase}.
                  The {langLabel} solution below uses an idiomatic approach that is clean, readable, and directly submittable on LeetCode.{complexityPhrase}{' '}
                  Study the logic carefully — recognising the underlying pattern is the key skill that transfers to similar problems in interviews.
                </p>
              </div>
              {problem.tags.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800">
                  <h2 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Key Techniques</h2>
                  <div className="space-y-4">
                    {problem.tags.slice(0, 3).map(tag => {
                      const desc = TOPIC_DESCRIPTIONS[tag]
                      if (!desc) return null
                      return (
                        <div key={tag}>
                          <a href={`/topics/${tag}`} className="inline-block text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-1">{TAG_LABELS[tag] ?? tag}</a>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        }
      })()}

      {/* Code */}
      <section className="mb-8">
        {problem.extraCodes && Object.keys(problem.extraCodes).length > 0 ? (
          <LanguageTabs extensions={[problem.primaryExt, ...Object.keys(problem.extraCodes)]}>
            <CodeBlockWithHeader
              code={problem.code}
              lang={EXT_TO_SHIKI[problem.primaryExt] ?? 'csharp'}
              filename={`${problem.number}.${problem.primaryExt}`}
            />
            {Object.entries(problem.extraCodes).map(([ext, code]) => (
              <CodeBlockWithHeader
                key={ext}
                code={code}
                lang={EXT_TO_SHIKI[ext] ?? 'csharp'}
                filename={`${problem.number}.${ext}`}
              />
            ))}
          </LanguageTabs>
        ) : (
          <CodeBlockWithHeader
            code={problem.code}
            lang={EXT_TO_SHIKI[problem.primaryExt] ?? 'csharp'}
            filename={`${problem.number}.${problem.primaryExt}`}
          />
        )}
      </section>

      {/* Ad: rectangle */}
        <AdUnit slot="1364902808" style="rectangle" className="mb-6" />

      {/* Helpful widget */}
      <HelpfulWidget />

      {/* Related problems — internal linking for SEO */}
      {related.length > 0 && (
        <section className="mb-8 p-4 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800">
          <h2 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
            Related Problems
          </h2>
          <ul className="space-y-2">
            {related.map(p => (
              <li key={p.slug}>
                <Link
                  href={`/problems/${p.slug}`}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {p.number}. {p.title}
                </Link>
                <span className="ml-2 text-xs text-gray-400">({p.difficulty})</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Prev / Next navigation */}
      <nav className="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-6 gap-3 flex-wrap" aria-label="Problem navigation">
        {prev ? (
          <Link
            href={`/problems/${prev.slug}`}
            className="group flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all shadow-sm max-w-[46%]"
          >
            <svg className="w-4 h-4 shrink-0 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="truncate">{prev.number}. {prev.title}</span>
          </Link>
        ) : (
          <span />
        )}

        <Link
          href="/"
          className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm hidden sm:block"
        >
          All Problems
        </Link>

        {next ? (
          <Link
            href={`/problems/${next.slug}`}
            className="group flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all shadow-sm max-w-[46%]"
          >
            <span className="truncate">{next.number}. {next.title}</span>
            <svg className="w-4 h-4 shrink-0 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <BackToTop />
    </article>
  )
}
