import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllTags } from '@/lib/tags'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'LeetCode Topics',
  description: 'Browse LeetCode C# solutions by topic - Array, Dynamic Programming, Trees, Graphs and more.',
  alternates: { canonical: '/topics' },
  openGraph: {
    title: 'LeetCode Topics - DSA Solutions',
    description: 'Browse LeetCode C# solutions by topic - Array, Dynamic Programming, Trees, Graphs and more.',
    url: '/topics',
    type: 'website',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'LeetCode Topics',
  description: 'Browse LeetCode C# solutions organised by topic',
  url: `${SITE_URL}/topics`,
}

export default function TopicsPage() {
  const tags = getAllTags()

  return (
    <div className="max-w-4xl mx-auto py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
        Topics
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-3 text-sm">
        {tags.length} topics across {tags.reduce((s, t) => s + t.count, 0)} tagged problems
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-2xl">
        Browse LeetCode C# solutions organised by algorithmic pattern. Each topic page lists all
        problems for that pattern along with a short editorial explaining when and how to apply the
        technique. Mastering these patterns - rather than memorising individual solutions - is the
        most transferable skill for technical interviews.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tags.map(({ tag, label, count }) => (
          <Link
            key={tag}
            href={`/topics/${tag}`}
            className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 hover:shadow-sm transition-all group"
          >
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
              {label}
            </span>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full ml-2 shrink-0">
              {count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
