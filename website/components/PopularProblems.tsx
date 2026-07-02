import Link from 'next/link'
import type { ProblemMeta } from '@/lib/problems'
import DifficultyBadge from './DifficultyBadge'
import { hasSubstantialLcExplanation } from '@/lib/content-quality'

export default function PopularProblems({ problems }: { problems: ProblemMeta[] }) {
  if (problems.length === 0) return null

  return (
    <section className="mb-8 p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20">
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Popular Solutions
        </h2>
        <Link
          href="/study-guide"
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Full study plan →
        </Link>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
        Start with these high-search interview classics — many include full step-by-step explanations.
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {problems.map(p => (
          <li key={p.slug}>
            <Link
              href={`/problems/${p.slug}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/60 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 px-3 py-2.5 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group"
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                  {p.number}. {p.title}
                </span>
                {hasSubstantialLcExplanation(p.number) && (
                  <span className="text-[11px] text-indigo-500 dark:text-indigo-400">
                    Full explanation
                  </span>
                )}
              </span>
              <DifficultyBadge difficulty={p.difficulty} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
