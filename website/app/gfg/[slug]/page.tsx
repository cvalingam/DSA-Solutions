import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllGfgProblems, getGfgProblemBySlug, getAdjacentGfgProblems } from '@/lib/gfg-problems'
import { toLeetCodeSlug } from '@/lib/constants'
import CodeBlockWithHeader from '@/components/CodeBlockWithHeader'
import AdUnit from '@/components/AdUnit'
import ArticleWithSidebar from '@/components/ArticleWithSidebar'
import HelpfulWidget from '@/components/HelpfulWidget'
import BackToTop from '@/components/BackToTop'
import { buildGfgArticleGraph, buildGfgDescription } from '@/lib/seo'
import {
  buildGfgProblemOverview,
  hasQualityGfgExplanation,
  isGfgPageIndexable,
  resolveGfgExplanation,
  shouldShowAdsOnGfgPage,
} from '@/lib/content-quality'
import { shouldShowArticleAdSlot } from '@/lib/ads'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllGfgProblems().map(p => ({ slug: p.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const problem = getGfgProblemBySlug(params.slug)
  if (!problem) return {}

  const rich = resolveGfgExplanation(problem.slug)
  const title = problem.title
  const desc = buildGfgDescription(problem, rich)
  const ogImage = `/gfg/${problem.slug}/opengraph-image`
  const indexable = isGfgPageIndexable(problem, problem.slug)

  return {
    title,
    description: desc,
    keywords: ['GeeksforGeeks', 'GFG', problem.title, 'Java solution', 'interview prep'],
    alternates: { canonical: `/gfg/${problem.slug}` },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title: `${title} — GFG Java Solution`,
      description: desc,
      type: 'article',
      url: `/gfg/${problem.slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `GFG ${problem.title}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — GFG Java Solution`,
      description: desc,
      images: [ogImage],
    },
  }
}

export default async function GfgProblemPage({ params }: Props) {
  const problem = getGfgProblemBySlug(params.slug)
  if (!problem) notFound()

  const { prev, next } = getAdjacentGfgProblems(params.slug)
  const gfgSlug = toLeetCodeSlug(problem.title)
  const rich = resolveGfgExplanation(problem.slug)
  const showAds = shouldShowAdsOnGfgPage(problem.slug)
  const showAdSlot = shouldShowArticleAdSlot(showAds)
  const overview = buildGfgProblemOverview(problem, rich)
  const articleJsonLd = buildGfgArticleGraph(problem, rich)

  return (
    <article className="py-8">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <ArticleWithSidebar showSidebar={showAdSlot}>

      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/gfg" className="hover:text-emerald-600 transition-colors">GFG</Link>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-600 font-medium truncate">{problem.title}</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-3">
        {problem.title}
      </h1>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          Java
        </span>
        <span className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
        <a
          href={`https://www.geeksforgeeks.org/problems/${gfgSlug}/1`}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800 transition-colors"
        >
          View on GFG
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {problem.complexity && (
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/50 dark:border-emerald-900">
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Time: <span className="font-mono">{problem.complexity.time}</span></span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-50 border border-violet-100 dark:bg-violet-950/50 dark:border-violet-900">
            <span className="text-xs font-medium text-violet-700 dark:text-violet-300">Space: <span className="font-mono">{problem.complexity.space}</span></span>
          </div>
        </div>
      )}

      <section className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800">
        <h2 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
          Problem Overview
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{overview}</p>
        {!hasQualityGfgExplanation(problem.slug) && (
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            See our <Link href="/study-guide" className="text-emerald-600 dark:text-emerald-400 hover:underline">study guide</Link> for structured GFG and LeetCode practice.
          </p>
        )}
      </section>

      {showAdSlot && (
        <div className="mb-8 lg:hidden">
          <AdUnit slot="4545599910" style="leaderboard" placeholder />
        </div>
      )}

      {(() => {
        if (rich) {
          return (
            <div className="mb-8 space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
                <h2 className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">Intuition</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{rich.intuition}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800">
                <h2 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Algorithm</h2>
                <ol className="space-y-2">
                  {rich.algorithm.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              {rich.example && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
                  <h2 className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Example Walkthrough</h2>
                  <p className="text-xs font-mono text-blue-800 dark:text-blue-300 bg-blue-100/60 dark:bg-blue-900/40 rounded px-3 py-1.5 mb-3 break-all">Input: {rich.example.input}</p>
                  <ol className="space-y-1.5 list-none mb-3">
                    {rich.example.steps.map((step, i) => (
                      <li key={i} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{i + 1}. {step}</li>
                    ))}
                  </ol>
                  <p className="text-xs font-mono text-blue-800 dark:text-blue-300 bg-blue-100/60 dark:bg-blue-900/40 rounded px-3 py-1.5 break-all">Output: {rich.example.output}</p>
                </div>
              )}
              {rich.pitfalls && rich.pitfalls.length > 0 && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
                  <h2 className="text-[11px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-3">Common Pitfalls</h2>
                  <ul className="space-y-2">
                    {rich.pitfalls.map((p, i) => (
                      <li key={i} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">• {p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        }
        if (problem.approach) {
          return (
            <div className="mb-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900">
              <h2 className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">Approach</h2>
              <div className="space-y-1.5">
                {problem.approach.split('\n').map((para, i) => (
                  <p key={i} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{para}</p>
                ))}
              </div>
            </div>
          )
        }
        return (
          <div className="mb-8 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Trace through the Java solution below on paper, then try re-implementing without looking.
            </p>
          </div>
        )
      })()}

      <section className="mb-8">
        <CodeBlockWithHeader code={problem.code} lang="java" filename={`${problem.title}.java`} />
      </section>

      <HelpfulWidget />

      <nav className="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-6 gap-3 flex-wrap" aria-label="Problem navigation">
        {prev ? (
          <Link href={`/gfg/${prev.slug}`} className="group flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:border-emerald-300 transition-all shadow-sm max-w-[46%]">
            <span className="truncate">{prev.title}</span>
          </Link>
        ) : <span />}
        <Link href="/gfg" className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 hidden sm:block">All GFG Problems</Link>
        {next ? (
          <Link href={`/gfg/${next.slug}`} className="group flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:border-emerald-300 transition-all shadow-sm max-w-[46%]">
            <span className="truncate">{next.title}</span>
          </Link>
        ) : <span />}
      </nav>

      <BackToTop />
      </ArticleWithSidebar>
    </article>
  )
}
