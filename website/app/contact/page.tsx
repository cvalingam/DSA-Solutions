import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact DSA Solutions',
  description: 'Contact DSA Solutions - report issues or suggest improvements to LeetCode C# and GFG Java solutions.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact DSA Solutions',
    description: 'Report issues or suggest improvements to LeetCode C# and GFG Java solutions.',
    url: '/contact',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto py-10">

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 px-6 py-10 mb-10 text-white shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.08)_0%,_transparent_55%)] pointer-events-none" />
        <div className="relative">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Contact</h1>
          <p className="text-indigo-200 text-sm sm:text-base leading-relaxed max-w-lg">
            Found a bug? Have a suggestion? Want to contribute a solution? Reach out below.
          </p>
        </div>
      </div>

      <div className="mb-8 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3">
        <svg className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        <div>
          <h2 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-1">Prefer GitHub Issues?</h2>
          <p className="text-sm text-indigo-800 dark:text-indigo-200">
            The fastest way to report a bug or suggest a fix is to open a{' '}
            <a
              href="https://github.com/cvalingam/DSA-Solutions/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium"
            >
              GitHub Issue
            </a>. It helps track progress and lets others follow along.
          </p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Send a message</h2>

      <form
        action="https://formspree.io/f/xnjgkaaa"
        method="POST"
        className="flex flex-col gap-4 max-w-md"
      >
        <input
          type="text"
          name="name"
          placeholder="Your name"
          required
          className="px-3 py-2 border border-slate-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 dark:focus:border-indigo-600 transition-colors"
        />
        <input
          type="email"
          name="email"
          placeholder="Your email address"
          required
          className="px-3 py-2 border border-slate-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 dark:focus:border-indigo-600 transition-colors"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          required
          className="px-3 py-2 border border-slate-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 dark:focus:border-indigo-600 transition-colors"
        />
        <textarea
          name="message"
          placeholder="Your message\u2026"
          rows={5}
          required
          className="px-3 py-2 border border-slate-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 dark:focus:border-indigo-600 transition-colors resize-y"
        />
        <button
          type="submit"
          className="self-start inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Send Message
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
        We typically respond within 24-48 hours.
      </p>

      <div className="mt-10">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to all problems
        </Link>
      </div>
    </div>
  )
}
