import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getAllGfgProblemsMeta } from '@/lib/gfg-problems'
import GfgProblemList from '@/components/GfgProblemList'
import { SITE_URL } from '@/lib/constants'
import { buildCollectionPageSchema, getSiteStats } from '@/lib/seo'
import { hasQualityGfgExplanation } from '@/lib/content-quality'

export const dynamic = 'force-static'

const { gfgCount } = getSiteStats()

export const metadata: Metadata = {
  title: `GeeksforGeeks Java Solutions - ${gfgCount}+ Problems`,
  description:
    `Clean Java solutions to ${gfgCount}+ GeeksforGeeks problems with explanations, algorithm walkthroughs, and complexity analysis. Daily POTD and interview prep.`,
  keywords: ['GeeksforGeeks', 'GFG', 'Java', 'POTD', 'Problem of the Day', 'interview prep', 'DSA'],
  alternates: { canonical: '/gfg' },
  openGraph: {
    title: `GeeksforGeeks Java Solutions - ${gfgCount}+ Problems`,
    description: `Clean Java solutions to ${gfgCount}+ GeeksforGeeks problems with explanations and complexity analysis.`,
    url: '/gfg',
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

export default function GfgPage() {
  const problems = getAllGfgProblemsMeta()
  const explanationSlugs = new Set(
    getAllGfgProblemsMeta()
      .map(p => p.slug)
      .filter(slug => hasQualityGfgExplanation(slug)),
  )

  const jsonLd = buildCollectionPageSchema(
    'GeeksforGeeks Java Solutions',
    `Browse ${problems.length}+ GeeksforGeeks problems with Java solutions and explanations.`,
    `${SITE_URL}/gfg`,
    problems.slice(0, 20).map(p => ({
      name: p.title,
      url: `${SITE_URL}/gfg/${p.slug}`,
    })),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<LoadingFallback />}>
        <GfgProblemList problems={problems} explanationSlugs={explanationSlugs} />
      </Suspense>
    </>
  )
}
