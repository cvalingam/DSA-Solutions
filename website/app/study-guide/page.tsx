import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'DSA Study Guide for C# Developers — LeetCode Interview Prep',
  description:
    'A complete DSA interview preparation guide for C# and .NET developers. Covers recommended study order, the 30-day plan, C#-specific tips, common patterns, and what interviewers actually look for.',
  alternates: { canonical: '/study-guide' },
  openGraph: {
    title: 'DSA Study Guide for C# Developers',
    description:
      'Complete LeetCode interview preparation guide tailored for C# and .NET developers — study order, patterns, C# tips, and a 30-day plan.',
    url: '/study-guide',
    type: 'article',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'DSA Study Guide for C# / .NET Developers',
  description:
    'A complete guide to preparing for data structures and algorithms interviews using C#. Covers recommended study order, key patterns, C#-specific tips, and a 30-day plan.',
  author: { '@type': 'Person', name: 'Sivalingam Ramasamy', url: 'https://github.com/cvalingam' },
  url: `${SITE_URL}/study-guide`,
  datePublished: '2026-04-20',
  dateModified: '2026-04-20',
  image: `${SITE_URL}/opengraph-image`,
}

export default function StudyGuidePage() {
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
        <span className="text-gray-600 font-medium">Study Guide</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-3">
        DSA Study Guide for C# Developers
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10 text-base leading-relaxed">
        A practical, no-fluff guide to cracking coding interviews using C# and .NET. Whether you are
        preparing for your first technical interview or brushing up for a FAANG round, this guide
        walks you through what to study, in what order, and how to think about problems under pressure.
      </p>

      {/* Section 1 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
          Why C# for LeetCode?
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Most online solution repositories focus on C++, Python, or Java. High-quality, idiomatic C#
          solutions are rare. Yet Microsoft, Accenture, ThoughtWorks, Infosys, and hundreds of product
          companies in India and globally conduct technical interviews in C#. If you are a .NET developer,
          practising in C# is not just convenient — it is strategically correct.
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Modern C# (8.0+) is a genuinely expressive language for DSA. You get{' '}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm">PriorityQueue&lt;TElement, TPriority&gt;</code> (.NET 6+),{' '}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm">SortedSet&lt;T&gt;</code>,{' '}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm">Dictionary&lt;K, V&gt;</code>,{' '}
          LINQ for readable transformations, and pattern matching for concise switch expressions.
          The standard library is rich enough that you rarely have to implement data structures from scratch.
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          LeetCode supports C# as a first-class language. All problems compile against .NET and you can
          use anything from the BCL. There is no disadvantage compared to Java or C++ in terms of what
          the judge accepts.
        </p>
      </section>

      {/* Section 2 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
          Recommended Study Order
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          The order you study topics matters. Starting with hard graph problems when you have not
          mastered arrays is one of the fastest ways to get discouraged. Below is the progression that
          works for the majority of candidates.
        </p>

        <div className="space-y-4">
          {[
            {
              phase: 'Phase 1 — Foundations',
              weeks: 'Weeks 1–2',
              topics: ['Array', 'String', 'Hash Table', 'Two Pointers', 'Sliding Window'],
              detail:
                'These patterns appear in over 40% of interview questions. Nail them first. Focus on understanding WHY a pattern works, not just memorising code.',
            },
            {
              phase: 'Phase 2 — Core Algorithms',
              weeks: 'Weeks 3–4',
              topics: ['Binary Search', 'Sorting', 'Recursion', 'Stack', 'Queue'],
              detail:
                'Binary search on the answer space (not just sorted arrays) is a favourite FAANG technique. Practice identifying when a monotonic predicate exists.',
            },
            {
              phase: 'Phase 3 — Trees & Graphs',
              weeks: 'Weeks 5–6',
              topics: ['Binary Tree', 'BST', 'DFS', 'BFS', 'Graph', 'Union Find'],
              detail:
                'Recursive tree solutions are elegant but learn iterative equivalents too — deep trees cause stack overflows. BFS guarantees shortest path in unweighted graphs; always reach for it first.',
            },
            {
              phase: 'Phase 4 — Dynamic Programming',
              weeks: 'Weeks 7–8',
              topics: ['1D DP', '2D DP', 'Memoization', 'Interval DP', 'Bitmask DP'],
              detail:
                'DP is the topic most candidates spend too little time on. Start with recognising the state definition before worrying about transitions. Top-down memoization is easier to reason about; convert to bottom-up only for space optimisation.',
            },
            {
              phase: 'Phase 5 — Advanced Topics',
              weeks: 'Weeks 9–10',
              topics: ['Heap / Priority Queue', 'Trie', 'Segment Tree', 'Topological Sort', 'Monotonic Stack'],
              detail:
                'These appear in Hard problems and later interview rounds. Even a basic understanding of Dijkstra, LRU Cache design, and Trie structure covers most interview scenarios.',
            },
          ].map(({ phase, weeks, topics, detail }) => (
            <div key={phase} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{phase}</h3>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full font-medium">{weeks}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {topics.map(t => (
                  <span key={t} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-md">{t}</span>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
          30-Day Intensive Plan
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          If you have exactly one month to prepare, here is a day-by-day structure. Aim for 2–3 problems
          per session. Quality beats quantity — understand each solution fully before moving on.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300 w-28">Days</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">Focus</th>
                <th className="text-left py-2 font-semibold text-gray-700 dark:text-gray-300">Target problems</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-600 dark:text-gray-400">
              <tr><td className="py-2 pr-4">1–4</td><td className="py-2 pr-4">Arrays &amp; Hash Tables</td><td className="py-2">Two Sum, Best Time to Buy, Contains Duplicate, Top K Frequent</td></tr>
              <tr><td className="py-2 pr-4">5–7</td><td className="py-2 pr-4">Two Pointers &amp; Sliding Window</td><td className="py-2">Container With Most Water, Longest Substring, Minimum Window Substring</td></tr>
              <tr><td className="py-2 pr-4">8–10</td><td className="py-2 pr-4">Binary Search</td><td className="py-2">Search in Rotated Array, Find Minimum, Koko Eating Bananas</td></tr>
              <tr><td className="py-2 pr-4">11–13</td><td className="py-2 pr-4">Stack &amp; Queue</td><td className="py-2">Valid Parentheses, Daily Temperatures, Largest Rectangle in Histogram</td></tr>
              <tr><td className="py-2 pr-4">14–17</td><td className="py-2 pr-4">Trees (DFS &amp; BFS)</td><td className="py-2">Max Depth, Level Order Traversal, LCA, Validate BST</td></tr>
              <tr><td className="py-2 pr-4">18–20</td><td className="py-2 pr-4">Graphs</td><td className="py-2">Number of Islands, Clone Graph, Course Schedule, Pacific Atlantic Water Flow</td></tr>
              <tr><td className="py-2 pr-4">21–25</td><td className="py-2 pr-4">Dynamic Programming</td><td className="py-2">Climbing Stairs, House Robber, Coin Change, Longest Increasing Subsequence</td></tr>
              <tr><td className="py-2 pr-4">26–28</td><td className="py-2 pr-4">Heap &amp; Greedy</td><td className="py-2">Kth Largest Element, Merge K Sorted Lists, Task Scheduler</td></tr>
              <tr><td className="py-2 pr-4">29–30</td><td className="py-2 pr-4">Mock Interviews</td><td className="py-2">Timed sessions on unseen problems — simulate real interview conditions</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
          C# / .NET Specific Tips
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
          These tips are specific to writing competitive-quality C# on LeetCode. They are not covered
          in Python or Java guides.
        </p>
        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800">
            <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Use <code className="font-mono text-indigo-600 dark:text-indigo-400">PriorityQueue&lt;TElement, TPriority&gt;</code> (.NET 6+)</p>
            <p>LeetCode runs .NET 6 or later. Use the built-in min-heap directly — no need to negate priorities for a max-heap. For max-heap, just negate the priority: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">pq.Enqueue(val, -val)</code>.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800">
            <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Overflow: use <code className="font-mono text-indigo-600 dark:text-indigo-400">long</code> proactively</p>
            <p><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">int</code> overflows silently in C#. Any time you multiply two values that could each be up to 10⁵, cast to <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">long</code>. Most DP problems with large inputs require this.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800">
            <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Strings are immutable — use <code className="font-mono text-indigo-600 dark:text-indigo-400">StringBuilder</code> inside loops</p>
            <p>Concatenating strings with <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">+</code> in a loop is O(n²) because each concatenation allocates a new string. Use <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">StringBuilder</code> and call <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">.ToString()</code> once at the end.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800">
            <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1"><code className="font-mono text-indigo-600 dark:text-indigo-400">Array.Sort()</code> accepts a custom <code className="font-mono text-indigo-600 dark:text-indigo-400">Comparison&lt;T&gt;</code></p>
            <p>You do not need to implement <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">IComparer&lt;T&gt;</code>. A lambda is enough: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">Array.Sort(arr, (a, b) =&gt; a[0] - b[0])</code>. Sort stability is not guaranteed — use <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">OrderBy()</code> (LINQ) when stability matters.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800">
            <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Tuple keys in dictionaries</p>
            <p>C# value tuples work as dictionary keys without a custom comparer: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">var memo = new Dictionary&lt;(int, int), int&gt;()</code>. This is the cleanest way to write 2D memoization without a jagged array.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800">
            <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Avoid LINQ in tight inner loops</p>
            <p>LINQ is readable but adds allocation overhead. Use it for one-time setup (building a dictionary, sorting) not inside O(n²) loops. Profiling shows LINQ can be 3–5× slower than a hand-written loop for large inputs on LeetCode.</p>
          </div>
        </div>
      </section>

      {/* Section 5 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
          How to Approach an Unseen Problem
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
          The most common interview mistake is jumping straight to code. Follow this structured approach
          instead — it works whether you know the problem or not.
        </p>
        <ol className="space-y-4">
          {[
            ['1. Read and restate', 'Say back what the problem is asking in your own words. This catches misreads early and shows the interviewer you understand the problem before coding.'],
            ['2. Work through examples by hand', 'Take the given example and trace through it manually. Then construct your own edge case: empty input, single element, all duplicates, negative numbers. Edge cases expose gaps in your approach before you write a line of code.'],
            ['3. State the brute force', 'Even if it is O(n³), say it out loud. This shows you have a baseline and sets up the conversation about optimisation. Many interviewers give partial credit for a correct brute force.'],
            ['4. Identify the bottleneck', 'Where is the brute force slow? Is it because of redundant computation (→ caching / DP), a slow search (→ binary search / hash table), or redundant comparisons (→ two pointers / sorting)?'],
            ['5. State your optimised approach', 'Before writing code, describe the data structure and algorithm you will use, and state its time and space complexity. Get confirmation from the interviewer that this is on the right track.'],
            ['6. Code it cleanly', 'Write readable code with meaningful variable names. Avoid single-letter variables except for standard loop indices. Comments help in written interviews.'],
            ['7. Test with your edge cases', 'Walk through your code with the edge cases you identified in step 2. Fixing bugs while talking the interviewer through the logic shows debugging skill.'],
          ].map(([title, text]) => (
            <li key={title as string} className="flex gap-4">
              <span className="shrink-0 mt-0.5">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-bold">
                  {(title as string).split('.')[0]}
                </span>
              </span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">{(title as string).replace(/^\d+\.\s/, '')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{text as string}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Section 6 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
          The 7 Patterns That Cover 80% of Interviews
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
          Most interview problems are variations of a small number of fundamental patterns. Internalise
          these and you will recognise the shape of a new problem within the first 30 seconds.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { name: 'Two Pointers', when: 'Sorted array or string; finding a pair/triplet sum; removing duplicates; palindrome check.', link: '/topics/two-pointers' },
            { name: 'Sliding Window', when: 'Contiguous subarray/substring with a constraint on its content (sum, distinct count, frequency).', link: '/topics/sliding-window' },
            { name: 'Binary Search on Answer', when: '"Find the minimum/maximum X such that condition Y holds" — define a monotonic predicate and binary search on the answer space.', link: '/topics/binary-search' },
            { name: 'DFS / Backtracking', when: 'Explore all valid configurations (permutations, subsets, Sudoku). Prune branches early to cut the search space.', link: '/topics/depth-first-search' },
            { name: 'BFS (Shortest Path)', when: 'Shortest path in an unweighted graph or grid. Word ladder, 01 matrix, minimum steps problems.', link: '/topics/breadth-first-search' },
            { name: 'Dynamic Programming', when: 'Count ways, find min/max cost, overlapping sub-problems. Recognise by "can we split this into smaller same-shape problems?"', link: '/topics/dynamic-programming' },
            { name: 'Monotonic Stack', when: 'Next greater/smaller element, span problems, histogram area, temperature problems. Each element is processed at most once — O(n).', link: '/topics/monotonic-stack' },
          ].map(({ name, when, link }) => (
            <div key={name} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
              <Link href={link} className="font-semibold text-indigo-700 dark:text-indigo-400 hover:underline text-sm">{name}</Link>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{when}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
          What Interviewers Are Really Looking For
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Getting the right answer is necessary but not sufficient. Interviewers at top companies evaluate
          candidates on four dimensions:
        </p>
        <div className="space-y-3 text-sm">
          {[
            ['Problem Solving', 'Can you break down an unfamiliar problem? Do you identify the right data structure and algorithm? Can you reason about trade-offs between approaches?'],
            ['Communication', 'Do you explain your thinking out loud? Do you ask clarifying questions? Can you articulate why your solution is correct and why it has a given complexity?'],
            ['Code Quality', 'Is your code readable without comments? Are variables named meaningfully? Would a colleague find it easy to review and maintain?'],
            ['Testing & Edge Cases', 'Do you proactively test your code? Do you identify edge cases — empty inputs, single elements, overflow, cycles in graphs — without being prompted?'],
          ].map(([title, text]) => (
            <div key={title as string} className="flex gap-3 p-4 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800">
              <span className="shrink-0 text-indigo-500 dark:text-indigo-400 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100 mb-0.5">{title as string}</p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{text as string}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 8b — System Design */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
          Phase 2: System Design (Weeks 10–12)
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Once you can recognise DSA patterns under time pressure, add system design. Most mid-level and
          senior loops include at least one design round. You do not need to know every AWS service —
          you need a repeatable framework and the ability to discuss trade-offs.
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          We have a dedicated{' '}
          <Link href="/system-design" className="text-violet-600 dark:text-violet-400 hover:underline font-medium">
            System Design section
          </Link>{' '}
          with 20 human-written articles: interview framework, URL shortener, rate limiter, news feed, chat, payments, Uber, web crawler, notifications, file storage, typeahead, CAP theorem, sharding, Snowflake IDs, Kafka, caching, SQL vs NoSQL, load balancing, API design, and how LeetCode patterns translate to production systems.
        </p>
        <Link
          href="/system-design"
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Read System Design Articles →
        </Link>
      </section>

      {/* Section 8 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
          How to Use This Site Effectively
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          This site is designed as a reference — not a crutch. Here is how to get the most out of it:
        </p>
        <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside leading-relaxed">
          <li><strong>Attempt the problem first.</strong> Spend at least 20–30 minutes on every problem before looking at the solution. The struggle is where learning happens.</li>
          <li><strong>Read the Explanation section before the code.</strong> Each solution page shows an approach explanation above the code. Read it and see if you can now implement the solution without looking at the code.</li>
          <li><strong>Check the complexity.</strong> Every solution includes Time and Space complexity. Make sure you understand why those complexities are correct.</li>
          <li><strong>Browse by topic.</strong> Use the <Link href="/topics" className="text-indigo-600 dark:text-indigo-400 hover:underline">Topics</Link> page to study all problems in a given pattern. This is more effective than random problem order.</li>
          <li><strong>Revisit solved problems.</strong> Come back to a problem 3–7 days later and solve it from memory. Spaced repetition is the fastest way to retain patterns long-term.</li>
        </ol>
      </section>

      {/* CTA */}
      <div className="flex gap-3 flex-wrap pt-4 border-t border-gray-100 dark:border-gray-800">
        <Link
          href="/"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Browse LeetCode Solutions →
        </Link>
        <Link
          href="/gfg"
          className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
        >
          Browse GFG Solutions →
        </Link>
        <Link
          href="/topics"
          className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
        >
          Browse by Topic →
        </Link>
      </div>
    </div>
  )
}
