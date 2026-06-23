import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'FAQ — LeetCode Interview Prep for C# / .NET Developers',
  description:
    'Frequently asked questions about preparing for coding interviews as a C# developer — how long to prepare, which problems to solve first, whether C# is accepted on LeetCode, and more.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'FAQ — LeetCode Interview Prep for C# Developers',
    description:
      'Answers to the most common questions about LeetCode interview preparation using C# and .NET.',
    url: '/faq',
    type: 'article',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is C# accepted on LeetCode?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. LeetCode fully supports C# as a first-class language. The judge runs .NET and accepts all standard library types including PriorityQueue, SortedSet, Dictionary, and LINQ. There is no disadvantage compared to Java or C++ in terms of what the judge accepts.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many LeetCode problems do I need to solve to pass interviews?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For most mid-level roles, solving 100–150 problems with genuine understanding outperforms grinding 400+ problems superficially. Focus on covering all the major patterns — Two Pointers, Sliding Window, Binary Search, BFS/DFS, Dynamic Programming, and Heap — rather than maximising problem count.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which LeetCode problems should I solve first?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start with the foundational problems that appear most frequently in interviews: Two Sum (Hash Table pattern), Best Time to Buy and Sell Stock (greedy), Valid Parentheses (stack), Maximum Subarray (Kadane\'s algorithm), Binary Search, and Number of Islands (BFS/DFS). These cover the core patterns used in over 60% of interview questions.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to prepare for a coding interview?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'With consistent daily practice, most candidates reach interview readiness in 6–10 weeks. The 30-day intensive plan on this site can work for candidates who already have some programming experience and can dedicate 2–3 hours per day.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I use C# or Python for LeetCode?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use the language you will be interviewed in. If you are applying for .NET roles, practising in C# is the correct choice — your solutions will look natural and you will not need to mentally translate idioms. Python is faster to write but does not help you if the interview is conducted in C#.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I prepare for system design interviews?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start after you are comfortable with core DSA patterns. Read one framework article, then practise one case study per week out loud (URL shortener, rate limiter, news feed, chat). DSA Solutions publishes 25 in-depth system design articles at dsasolved.com/system-design, including payments, Uber, web crawler, Netflix, search engine, ticketing, Redis, e-commerce, CAP theorem, sharding, notifications, Kafka, and how LeetCode patterns map to real infrastructure.',
      },
    },
  ],
}

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: 'Is C# accepted on LeetCode?',
    a: (
      <>
        Yes — fully. LeetCode runs .NET as a first-class runtime. You can use everything from the BCL:{' '}
        <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">PriorityQueue&lt;TElement, TPriority&gt;</code>,{' '}
        <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">SortedSet&lt;T&gt;</code>,{' '}
        <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">Dictionary&lt;K, V&gt;</code>,{' '}
        LINQ, pattern matching, and <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">System.Numerics</code>.
        There is no competitive disadvantage compared to Java or C++.
      </>
    ),
  },
  {
    q: 'How many LeetCode problems do I need to solve to pass interviews?',
    a: 'Quality beats quantity. Solving 100–150 problems with genuine understanding of the underlying patterns outperforms grinding 400+ problems superficially. Most interview questions are variations of ~15 core patterns. Once you can identify the pattern from the problem statement, solving unseen problems becomes straightforward.',
  },
  {
    q: 'Which LeetCode problems should I solve first?',
    a: (
      <>
        Start with the problems that appear most frequently in interviews and teach the most important patterns:
        <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
          <li><strong>Two Sum</strong> — Hash Table / complement lookup</li>
          <li><strong>Best Time to Buy and Sell Stock</strong> — Greedy one-pass</li>
          <li><strong>Valid Parentheses</strong> — Stack</li>
          <li><strong>Maximum Subarray</strong> — Kadane&apos;s algorithm</li>
          <li><strong>Merge Intervals</strong> — Sorting + sweep</li>
          <li><strong>Climbing Stairs</strong> — DP base case</li>
          <li><strong>Number of Islands</strong> — BFS/DFS on grid</li>
          <li><strong>Binary Search</strong> — Template for answer-space search</li>
        </ul>
      </>
    ),
  },
  {
    q: 'How long does it take to prepare for a coding interview?',
    a: (
      <>
        With consistent daily practice (1–2 hours/day):
        <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
          <li><strong>2–4 weeks:</strong> Basics (Array, String, Hash Table, Two Pointers)</li>
          <li><strong>4–6 weeks:</strong> Core algorithms (Binary Search, Trees, BFS/DFS)</li>
          <li><strong>6–10 weeks:</strong> Dynamic Programming + Advanced structures</li>
          <li><strong>10–12 weeks:</strong> Full readiness including system design awareness</li>
        </ul>
        <p className="mt-2">
          The <Link href="/study-guide" className="text-indigo-600 dark:text-indigo-400 hover:underline">30-day intensive plan</Link> on this site works for candidates who can dedicate 2–3 hours per day and already have programming experience. For system design, see our{' '}
          <Link href="/system-design" className="text-violet-600 dark:text-violet-400 hover:underline">System Design guide</Link>.
        </p>
      </>
    ),
  },
  {
    q: 'How do I prepare for system design interviews?',
    a: (
      <>
        <p>
          Start after you are comfortable with core DSA patterns — usually week 8–10 of a structured prep plan. Read one framework article, then practise one case study per week out loud (URL shortener, rate limiter, chat system). The goal is structured communication, not memorising AWS service names.
        </p>
        <p className="mt-2">
          Our <Link href="/system-design" className="text-violet-600 dark:text-violet-400 hover:underline">System Design section</Link> has 25 in-depth articles — frameworks, case studies (URL shortener, rate limiter, news feed, chat, payments, Uber, web crawler, Netflix, search engine, ticketing, e-commerce, notifications, file storage, typeahead), and fundamentals (caching, Redis, CAP theorem, sharding, Kafka, Snowflake IDs, SQL vs NoSQL, load balancing, API design).
        </p>
      </>
    ),
  },
  {
    q: 'Should I use C# or Python for LeetCode?',
    a: 'Use the language you will be interviewed in. If you are applying for .NET developer roles at Microsoft, Infosys, Accenture, or product companies that use the .NET stack, practise in C#. Your solutions will look natural, you will know the idiomatic APIs, and you will not need to mentally translate from another language during the interview. Python is faster to write but irrelevant if the interview is conducted in C#.',
  },
  {
    q: 'What is the difference between LeetCode Easy, Medium, and Hard?',
    a: (
      <>
        <p>Difficulty is relative and sometimes inconsistent on LeetCode, but as a rough guide:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
          <li><strong>Easy:</strong> One data structure or straightforward loop. Expected solve time: 5–10 minutes. These appear as warm-up questions or phone screens at most companies.</li>
          <li><strong>Medium:</strong> Requires combining 2–3 techniques. Expected solve time: 15–25 minutes. Most on-site interview questions are Medium difficulty.</li>
          <li><strong>Hard:</strong> Complex DP, advanced graph algorithms, or non-obvious observations. Expected solve time: 30–45 minutes. Appear in later rounds at FAANG-level companies.</li>
        </ul>
        <p className="mt-2">For most roles, focus 60% of your time on Mediums, 25% on Easys, and 15% on Hards.</p>
      </>
    ),
  },
  {
    q: 'Do companies actually ask LeetCode-style questions?',
    a: 'Yes, for software engineering roles at most product and tech companies in 2024–2026. Microsoft, Amazon, Google, Meta, and thousands of startups use algorithmic coding rounds as part of their hiring process. Service companies (TCS, Wipro, Infosys, Cognizant) conduct their own aptitude+coding tests that overlap significantly with LeetCode Easy/Medium problems. Knowing the core patterns gives you a concrete edge.',
  },
  {
    q: 'What is time complexity and why does it matter?',
    a: (
      <>
        <p>
          Time complexity describes how the runtime of an algorithm scales with input size. Written as Big-O notation (O(n), O(n log n), O(n²), etc.), it lets interviewers and engineers compare algorithms without running them.
        </p>
        <p className="mt-2">It matters in interviews for two reasons:</p>
        <ul className="mt-1 space-y-1 list-disc list-inside text-sm">
          <li>Interviewers explicitly ask for it. You will not pass most on-site rounds without stating correct complexity.</li>
          <li>Problems have hidden time limits. A brute-force O(n²) solution may time out on 10⁵ inputs where an O(n log n) solution passes.</li>
        </ul>
        <p className="mt-2">Every solution page on this site shows the Time and Space complexity as badges. Use them to build intuition.</p>
      </>
    ),
  },
  {
    q: 'Why does this site focus on C# for LeetCode and Java for GFG?',
    a: 'LeetCode is the dominant platform for software engineering interview preparation globally and in India. C# is the natural language for .NET developers but is underrepresented in LeetCode solution repositories. GeeksforGeeks POTD (Problem of the Day) is the most popular daily coding challenge in India, and its community predominantly expects Java solutions. Maintaining both in a single site covers the two most common interview preparation workflows for Indian software developers.',
  },
  {
    q: 'How do I know if my solution is optimal?',
    a: (
      <>
        <p>A few checks:</p>
        <ol className="mt-2 space-y-1 list-decimal list-inside text-sm">
          <li>Can you reduce time complexity by trading space? (e.g., use a hash map to avoid an inner loop)</li>
          <li>Can you reduce space by computing on the fly instead of pre-storing? (e.g., rolling DP variables)</li>
          <li>Is there a mathematical observation that eliminates the algorithm entirely? (common in Math-tagged problems)</li>
          <li>Does your solution handle the worst-case input (all duplicates, sorted, reverse-sorted, single element)?</li>
        </ol>
        <p className="mt-2">On LeetCode, click Discuss after submitting to see community solutions. Compare your Big-O with top-voted answers.</p>
      </>
    ),
  },
  {
    q: 'What C# version does LeetCode use?',
    a: (
      <>
        LeetCode currently supports C# with .NET 6 or later (the exact version changes periodically — check LeetCode&apos;s language version page for the current runtime). This means you have access to:
        <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
          <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">PriorityQueue&lt;TElement, TPriority&gt;</code> (.NET 6)</li>
          <li>Top-level statements and global usings</li>
          <li>Pattern matching with switch expressions</li>
          <li>Records and init-only properties</li>
          <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">BitOperations.PopCount()</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">Math.Log2()</code></li>
        </ul>
        <p className="mt-2">The solutions on this site use modern C# and compile on LeetCode&apos;s current judge.</p>
      </>
    ),
  },
]

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-600 font-medium">FAQ</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-3">
        Frequently Asked Questions
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10 text-base leading-relaxed">
        Common questions about preparing for coding interviews as a C# / .NET developer, and how to get the most out of this site.
      </p>

      <div className="space-y-6">
        {faqs.map(({ q, a }, i) => (
          <div key={i} className="p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex gap-3">
              <span className="shrink-0 text-indigo-500 dark:text-indigo-400 font-mono text-sm mt-0.5">Q.</span>
              <span>{q}</span>
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-6">
              {typeof a === 'string' ? <p>{a}</p> : a}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap pt-8 border-t border-gray-100 dark:border-gray-800 text-sm mt-8">
        <Link href="/study-guide" className="text-indigo-600 dark:text-indigo-400 hover:underline">Study Guide →</Link>
        <Link href="/cheat-sheet" className="text-indigo-600 dark:text-indigo-400 hover:underline">C# Cheat Sheet →</Link>
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">Browse Solutions →</Link>
      </div>
    </div>
  )
}
