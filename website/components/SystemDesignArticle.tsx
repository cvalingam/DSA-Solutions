import Link from 'next/link'
import type { ArticleBlock, SystemDesignArticle } from '@/lib/system-design/types'
import { CATEGORY_LABELS, getAllSystemDesignArticles } from '@/lib/system-design'
import InlineText from '@/components/InlineText'
import AdUnit from '@/components/AdUnit'

function renderInline(text: string) {
  return <InlineText text={text} />
}

function renderBlock(block: ArticleBlock, key: number) {
  switch (block.type) {
    case 'p':
      return (
        <p key={key} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          {renderInline(block.text)}
        </p>
      )
    case 'h2':
      return (
        <h2
          key={key}
          className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-10 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800"
        >
          {block.text}
        </h2>
      )
    case 'h3':
      return (
        <h3 key={key} className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-2">
          {block.text}
        </h3>
      )
    case 'ul':
      return (
        <ul key={key} className="list-disc list-outside ml-5 mb-4 space-y-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol key={key} className="list-decimal list-outside ml-5 mb-4 space-y-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ol>
      )
    case 'callout':
      return (
        <div
          key={key}
          className="my-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50"
        >
          <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm mb-1">{block.title}</p>
          <p className="text-sm text-amber-800 dark:text-amber-300/90 leading-relaxed">
            {renderInline(block.text)}
          </p>
        </div>
      )
    case 'table':
      return (
        <div key={key} className="my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {block.headers.map(h => (
                  <th
                    key={h}
                    className="text-left py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-600 dark:text-gray-400">
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="py-2 pr-4 align-top">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    default:
      return null
  }
}

interface Props {
  article: SystemDesignArticle
}

export default function SystemDesignArticleView({ article }: Props) {
  const all = getAllSystemDesignArticles()
  const idx = all.findIndex(a => a.slug === article.slug)
  const prev = idx > 0 ? all[idx - 1] : null
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null
  const related = all.filter(a => a.slug !== article.slug).slice(0, 3)

  const mid = Math.floor(article.sections.length / 2)
  const firstHalf = article.sections.slice(0, mid)
  const secondHalf = article.sections.slice(mid)

  return (
    <article className="max-w-3xl mx-auto py-10">
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <Chevron />
        <Link href="/system-design" className="hover:text-indigo-600 transition-colors">System Design</Link>
        <Chevron />
        <span className="text-gray-600 dark:text-gray-400 font-medium line-clamp-1">{article.title}</span>
      </nav>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-medium text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/50 px-2.5 py-0.5 rounded-full">
            {CATEGORY_LABELS[article.category]}
          </span>
          <span className="text-xs text-gray-400">{article.readMinutes} min read</span>
          <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
          <time className="text-xs text-gray-400" dateTime={article.published}>
            {new Date(article.published).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
          {article.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">{article.description}</p>
      </header>

      <div className="prose-custom">
        {firstHalf.map((block, i) => renderBlock(block, i))}
      </div>

      <AdUnit slot="4545599910" style="leaderboard" className="my-8" />

      <div className="prose-custom">
        {secondHalf.map((block, i) => renderBlock(block, i + mid))}
      </div>

      {(prev || next) && (
        <nav className="mt-10 grid sm:grid-cols-2 gap-3" aria-label="Article navigation">
          {prev ? (
            <Link
              href={`/system-design/${prev.slug}`}
              className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-violet-200 dark:hover:border-violet-800 transition-colors group"
            >
              <span className="text-xs text-gray-400 block mb-1">Previous</span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 line-clamp-2">
                {prev.title}
              </span>
            </Link>
          ) : <div />}
          {next && (
            <Link
              href={`/system-design/${next.slug}`}
              className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-violet-200 dark:hover:border-violet-800 transition-colors group sm:text-right"
            >
              <span className="text-xs text-gray-400 block mb-1">Next</span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 line-clamp-2">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      )}

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            More in this series
          </h2>
          <div className="space-y-2">
            {related.map(r => (
              <Link
                key={r.slug}
                href={`/system-design/${r.slug}`}
                className="block text-sm text-violet-600 dark:text-violet-400 hover:underline"
              >
                {r.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Written by Sivalingam Ramasamy for interview preparation. Pair this with our{' '}
          <Link href="/study-guide" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            DSA study guide
          </Link>{' '}
          and LeetCode solutions with full explanations.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/system-design"
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
          >
            ← All articles
          </Link>
          <Link
            href="/study-guide"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            DSA Study Guide →
          </Link>
        </div>
      </footer>
    </article>
  )
}

function Chevron() {
  return (
    <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}
