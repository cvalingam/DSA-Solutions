import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/constants'
import { WORKS } from '@/lib/works'

export const metadata: Metadata = {
  title: 'Works',
  description:
    'Selected live projects by Sivalingam Ramasamy — interview prep tools, clinic apps, CMS sites, and utilities.',
  alternates: { canonical: '/works' },
  keywords: ['portfolio', 'works', 'Next.js', 'projects', 'Sivalingam Ramasamy'],
  openGraph: {
    title: 'Works | DSA Solutions',
    description:
      'Selected live projects — NEET MDS Image Sizer, Skin Klove, Steel Express, and more.',
    url: '/works',
    type: 'website',
  },
}

export default function WorksPage() {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 px-6 py-10 mb-10 text-white shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.08)_0%,_transparent_55%)] pointer-events-none" />
        <div className="relative">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Works
          </h1>
          <p className="text-indigo-200 text-sm sm:text-base leading-relaxed max-w-lg">
            Live projects and products — from interview prep and clinic software to
            CMS sites and small utilities. All links open the production URL.
          </p>
        </div>
      </div>

      <ul className="space-y-4 mb-10">
        {WORKS.map(project => {
          const isThisSite = project.url === SITE_URL || project.url === `${SITE_URL}/`
          return (
            <li
              key={project.id}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {project.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                    {project.url.replace(/^https?:\/\//, '')}
                  </p>
                </div>
                <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                  {isThisSite ? (
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                    >
                      View site
                    </Link>
                  ) : (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                    >
                      Open live
                      <ExternalIcon />
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="flex gap-3 flex-wrap">
        <Link href="/about" className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          About
        </Link>
        <span className="text-gray-300 dark:text-gray-700">|</span>
        <Link href="/contact" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          Contact →
        </Link>
      </div>
    </div>
  )
}

function ExternalIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}
