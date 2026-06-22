import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About DSA Solutions',
  description: 'About DSA Solutions — clean C# LeetCode and Java GFG solutions with explanations and system design interview guides for .NET developers preparing for coding interviews.',
  alternates: { canonical: '/about' },
  keywords: ['LeetCode', 'GeeksforGeeks', 'C#', 'Java', 'DSA', 'system design', 'interview prep'],
  openGraph: {
    title: 'About DSA Solutions',
    description: 'About DSA Solutions — LeetCode C#, GFG Java solutions, and system design interview guides for .NET developers.',
    url: '/about',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto py-10">

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 px-6 py-10 mb-10 text-white shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.08)_0%,_transparent_55%)] pointer-events-none" />
        <div className="relative">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            About <span className="text-indigo-200">DSA Solutions</span>
          </h1>
          <p className="text-indigo-200 text-sm sm:text-base leading-relaxed max-w-lg">
            A daily-updated reference for LeetCode C# solutions and GeeksforGeeks Java solutions,
            built specifically for developers in the .NET ecosystem preparing for technical interviews.
          </p>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Why this site exists</h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
          When I started preparing for interviews, I noticed that virtually every LeetCode solution repository
          on GitHub focuses on C++, Python, or Java. C# — the primary language for millions of .NET
          developers — was an afterthought. Solutions written in C# were either scarce, inconsistently
          formatted, or missing altogether for newer problems.
        </p>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          DSA Solutions was built to fill that gap. Every solution is written in idiomatic C# using
          modern .NET APIs — <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm">PriorityQueue</code>,{' '}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm">SortedSet</code>,{' '}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm">Dictionary</code>, pattern
          matching — the same way a .NET developer would write production code.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">How solutions are written</h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
          Each solution follows a consistent structure designed to make it useful as a study reference,
          not just a code answer:
        </p>
        <ul className="space-y-3">
          {[
            ['Explanation first', '600+ problems include full step-by-step explanations (intuition, algorithm, examples, pitfalls). Remaining pages include approach notes and complexity analysis.'],
            ['Complexity stated explicitly', 'Time and Space complexity are shown as badges on every solution page.'],
            ['Idiomatic C# code', 'Solutions use the most readable C# idiom available — not a Java translation. The goal is code that a .NET engineer would write and be comfortable reviewing.'],
            ['Daily updates', 'New solutions for LeetCode and GeeksforGeeks POTD are added every day.'],
          ].map(([title, desc]) => (
            <li key={title} className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2" />
              <span className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                <strong className="text-gray-800 dark:text-gray-200 font-semibold">{title}.</strong>{' '}{desc}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">What you will find here</h2>
        <ul className="space-y-2">
          {[
            '600+ LeetCode problems with full step-by-step explanations (intuition, algorithm steps, examples)',
            'Approach notes and complexity on every indexed solution page',
            'Topic pages for 60+ DSA patterns (Array, DP, Trees, Graphs, and more)',
            'Difficulty filtering and instant search to find any problem in seconds',
            'Syntax-highlighted code with one-click copy on every page',
          ].map(item => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
              <svg className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {item}
            </li>
          ))}
          <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
            <svg className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <Link href="/system-design" className="text-violet-600 dark:text-violet-400 hover:underline">
              System design interview articles
            </Link>{' '}
            — 20 in-depth guides: frameworks, case studies, and fundamentals including payments, Uber, web crawler, CAP theorem, sharding, notifications, and Kafka
          </li>
          <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
            <svg className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            A <Link href="/study-guide" className="text-indigo-600 dark:text-indigo-400 hover:underline">full study guide</Link> covering the 30-day plan, C# tips, and interview strategy
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Why Java for GFG?</h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          GeeksforGeeks Problem of the Day is one of the most popular daily coding challenges in India,
          with a strong community of students and early-career developers. Solutions here are in Java —
          the most widely expected language for GFG submissions — and include the same explanation +
          complexity format as the LeetCode C# solutions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">About the author</h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
          Sivalingam Ramasamy is a software developer based in Chennai, India, with experience in
          .NET, C#, and full-stack development. He began solving LeetCode problems daily to sharpen
          his algorithmic thinking and started this site to share clean solutions with the broader
          .NET community.
        </p>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          The project is open-source under the MIT License and available on{' '}
          <a
            href="https://github.com/cvalingam/DSA-Solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            GitHub
          </a>. Contributions, corrections, and alternative solutions are welcome via pull request.
        </p>
      </section>

      <div className="mt-10 flex gap-3 flex-wrap">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          LeetCode Solutions
        </Link>
        <span className="text-gray-300 dark:text-gray-700">|</span>
        <Link href="/system-design" className="text-sm text-violet-600 dark:text-violet-400 hover:underline">System Design →</Link>
        <span className="text-gray-300 dark:text-gray-700">|</span>
        <Link href="/study-guide" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Study Guide →</Link>
      </div>
    </div>
  )
}
