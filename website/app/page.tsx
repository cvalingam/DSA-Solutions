import type { Metadata } from 'next'
import { getAllProblemsMeta } from '@/lib/problems'
import ProblemList from '@/components/ProblemList'
import { Suspense } from 'react'
import { SITE_URL } from '@/lib/constants'
import explanations from '@/lib/explanations'
import { hasSubstantialLcExplanation } from '@/lib/content-quality'
import { buildCollectionPageSchema, getSiteStats } from '@/lib/seo'

const { lcCount, gfgCount } = getSiteStats()

export const metadata: Metadata = {
  title: `LeetCode C# Solutions — ${lcCount}+ Problems Solved`,
  description: `Clean, readable C# solutions to ${lcCount}+ LeetCode problems and ${gfgCount}+ GeeksforGeeks Java solutions. Step-by-step explanations, system design articles, complexity analysis, and interview prep.`,
  alternates: { canonical: '/' },
  openGraph: {
    title: `LeetCode C# Solutions — ${lcCount}+ Problems | DSA Solutions`,
    description: `Clean, readable C# solutions to ${lcCount}+ LeetCode problems with explanations and complexity analysis.`,
    url: '/',
    type: 'website',
  },
}

function LoadingFallback() {
  return (
    <div className="animate-pulse space-y-3 mt-8">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-100 rounded-lg" />
      ))}
    </div>
  )
}

export default function HomePage() {
  const problems = getAllProblemsMeta()
  const explanationNums = new Set(
    Object.keys(explanations).map(Number).filter(hasSubstantialLcExplanation),
  )

  const collectionJsonLd = buildCollectionPageSchema(
    'LeetCode Solutions',
    `Browse ${problems.length}+ LeetCode problems with C# solutions, explanations, and complexity analysis.`,
    SITE_URL,
    problems.slice(0, 20).map(p => ({
      name: `${p.number}. ${p.title}`,
      url: `${SITE_URL}/problems/${p.slug}`,
    })),
  )

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DSA Solutions',
    url: SITE_URL,
    description: `${problems.length}+ LeetCode and ${gfgCount}+ GeeksforGeeks solutions plus system design interview guides for coding interview prep.`,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <Suspense fallback={<LoadingFallback />}>
        <ProblemList problems={problems} explanationNums={explanationNums} />
      </Suspense>
    </>
  )
}
