import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllTags, getProblemNumbersByTag, TAG_LABELS, TOPIC_DESCRIPTIONS } from '@/lib/tags'
import { getAllProblemsMeta } from '@/lib/problems'
import DifficultyBadge from '@/components/DifficultyBadge'
import { SITE_URL } from '@/lib/constants'
import { getTopicStudyTips } from '@/lib/content-quality'
import explanations from '@/lib/explanations'
import type { Tag } from '@/lib/tags'

interface Props {
  params: { tag: string }
}

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const label = TAG_LABELS[params.tag as Tag]
  if (!label) return {}
  const desc = TOPIC_DESCRIPTIONS[params.tag as Tag]
    ?? `${label} is a core data structures and algorithms pattern for coding interviews. Browse explained LeetCode C# solutions with approach notes and complexity analysis.`
  return {
    title: `${label} LeetCode Problems`,
    description: desc,
    alternates: { canonical: `/topics/${params.tag}` },
    openGraph: {
      title: `${label} LeetCode Problems — C# Solutions`,
      description: desc,
      url: `/topics/${params.tag}`,
      type: 'website',
    },
  }
}

export default function TopicPage({ params }: Props) {
  const label = TAG_LABELS[params.tag as Tag]
  if (!label) notFound()

  const tag = params.tag as Tag
  const numbers = getProblemNumbersByTag(tag)
  const allProblems = getAllProblemsMeta()
  const problemMap = new Map(allProblems.map(p => [p.number, p]))
  const problems = numbers.map(n => problemMap.get(n)).filter(Boolean) as typeof allProblems

  if (!problems.length) notFound()

  const description = TOPIC_DESCRIPTIONS[tag]
  const studyTips = getTopicStudyTips(tag, label)
  const explained = problems.filter(p => explanations[p.number])
  const starters = explained.filter(p => p.difficulty === 'Easy').slice(0, 5)
  const easy = problems.filter(p => p.difficulty === 'Easy').length
  const medium = problems.filter(p => p.difficulty === 'Medium').length
  const hard = problems.filter(p => p.difficulty === 'Hard').length

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: `${label} LeetCode Problems`,
        description: description ?? `${label} interview problems with C# solutions`,
        url: `${SITE_URL}/topics/${params.tag}`,
        numberOfItems: problems.length,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'LeetCode Solutions', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Topics', item: `${SITE_URL}/topics` },
          { '@type': 'ListItem', position: 3, name: label, item: `${SITE_URL}/topics/${params.tag}` },
        ],
      },
    ],
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-indigo-600 transition-colors">LeetCode</Link>
        <span>/</span>
        <Link href="/topics" className="hover:text-indigo-600 transition-colors">Topics</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">{label}</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-1">
        {label}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
        {problems.length} problems · {explained.length} with full explanations
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900">{easy} Easy</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900">{medium} Medium</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900">{hard} Hard</span>
      </div>

      {description && (
        <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-4 mb-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {description}
        </div>
      )}

      <div className="bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800 rounded-xl p-4 mb-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">How to practice</h2>
        <p>{studyTips}</p>
        <p className="mt-3">
          <Link href="/study-guide" className="text-indigo-600 dark:text-indigo-400 hover:underline">Open the full study guide →</Link>
        </p>
      </div>

      {starters.length > 0 && (
        <section className="mb-6 p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
          <h2 className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-3">Start here (Easy + explained)</h2>
          <ul className="space-y-2">
            {starters.map(p => (
              <li key={p.slug}>
                <Link href={`/problems/${p.slug}`} className="text-sm text-emerald-800 dark:text-emerald-300 hover:underline">
                  {p.number}. {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">All {label} problems</h2>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {problems.map(p => (
          <li key={p.slug}>
            <Link
              href={`/problems/${p.slug}`}
              className="flex items-center justify-between py-3 gap-3 group hover:bg-gray-50/60 dark:hover:bg-gray-800/40 px-1 rounded-lg transition-colors"
            >
              <span className="flex items-center gap-3 min-w-0">
                <span className="w-10 text-right shrink-0 text-xs text-gray-400 font-mono tabular-nums">{p.number}.</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {p.title}
                </span>
                {explanations[p.number] && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" title="Full explanation" />
                )}
              </span>
              <DifficultyBadge difficulty={p.difficulty} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
