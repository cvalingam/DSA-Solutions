import type { Metadata } from 'next'
import Link from 'next/link'
import { buildSystemDesignHubSchema } from '@/lib/seo'
import {
  getAllSystemDesignArticles,
  CATEGORY_LABELS,
} from '@/lib/system-design'

export const metadata: Metadata = {
  title: 'System Design Interview Guide — 25 Practical Articles for Developers',
  description:
    'System design interview prep: URL shortener, rate limiter, news feed, chat, payments, Uber, web crawler, Netflix, search engine, ticketing, Redis cache, e-commerce, notifications, file storage, CAP theorem, sharding, Kafka, caching, and more.',
  keywords: [
    'system design interview',
    'system design',
    'URL shortener system design',
    'rate limiter design',
    'news feed system design',
    'chat system design',
    'notification system design',
    'file storage system design',
    'autocomplete system design',
    'Snowflake ID generator',
    'Kafka system design',
    'payment system design',
    'Uber system design',
    'web crawler system design',
    'Netflix system design',
    'search engine system design',
    'ticket booking system design',
    'Redis system design',
    'e-commerce system design',
    'CAP theorem',
    'database sharding',
    'SQL vs NoSQL',
    'load balancing',
    'REST API design',
  ],
  alternates: { canonical: '/system-design' },
  openGraph: {
    title: 'System Design Interview Guide — 25 Articles',
    description:
      '25 practical system design articles for developers preparing for technical interviews — frameworks, case studies, and fundamentals.',
    url: '/system-design',
    type: 'website',
  },
}

export default function SystemDesignHubPage() {
  const articles = getAllSystemDesignArticles()

  const jsonLd = buildSystemDesignHubSchema(
    articles.length,
    articles.map(a => ({ slug: a.slug, title: a.title, description: a.description })),
  )

  return (
    <div className="max-w-3xl mx-auto py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-600 dark:text-gray-400 font-medium">System Design</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-3">
        System Design for Interview Prep
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-4 text-base leading-relaxed">
        You have been grinding LeetCode patterns. System design is the next layer — same thinking,
        different scale. These articles are written in plain language with real trade-offs, not
        copied bullet lists. Start with the framework, then work through the case studies.
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
        {articles.length} articles · complements our{' '}
        <Link href="/study-guide" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          DSA study guide
        </Link>
      </p>

      <div className="space-y-4">
        {articles.map((article, index) => (
          <Link
            key={article.slug}
            href={`/system-design/${article.slug}`}
            className="block p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-violet-200 dark:hover:border-violet-800 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-medium text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/50 px-2 py-0.5 rounded-full">
                    {CATEGORY_LABELS[article.category]}
                  </span>
                  <span className="text-xs text-gray-400">{article.readMinutes} min</span>
                </div>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors mb-1.5">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                  {article.description}
                </p>
              </div>
              <span className="text-violet-400 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors shrink-0 mt-1">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-12 p-5 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Suggested reading order</h2>
        <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside leading-relaxed">
          <li>How to Approach System Design Interviews — learn the 45-minute framework first</li>
          <li>Design a URL Shortener — classic case study end to end</li>
          <li>Caching Fundamentals — you will need this on almost every design</li>
          <li>Design a Rate Limiter — distributed state and atomicity</li>
          <li>From LeetCode Patterns to Real Systems — connect what you already know</li>
          <li>SQL vs NoSQL — pick the right store for each component</li>
          <li>Load Balancing and Horizontal Scaling — scale the app tier correctly</li>
          <li>Design a News Feed — fan-out on write vs read and the celebrity problem</li>
          <li>Design a Chat / Messaging System — WebSockets, delivery, and groups</li>
          <li>API Design and REST Best Practices — endpoints interviewers expect you to name</li>
          <li>Design a Unique ID Generator — Snowflake, UUID, and when to use each</li>
          <li>Message Queues and Async Processing — Kafka, ordering, and idempotent consumers</li>
          <li>Design a Notification System — push, email, SMS, and idempotency</li>
          <li>Design Typeahead / Autocomplete — trie, ranking, and hot-prefix caching</li>
          <li>Design File Storage (Dropbox) — chunked upload, metadata vs blobs, sync</li>
          <li>Design a Web Crawler — URL frontier, politeness, and deduplication</li>
          <li>Design Ride Hailing (Uber) — geospatial matching and trip state machine</li>
          <li>Design a Payment System — idempotency, ledger, and authorize/capture</li>
          <li>CAP Theorem and Consistency Models — CP vs AP per component</li>
          <li>Database Sharding and Replication — shard keys, replicas, and hot spots</li>
          <li>Design a Video Streaming Platform (Netflix) — transcoding, HLS, and CDN delivery</li>
          <li>Design a Search Engine — inverted index, ranking, and query fan-out</li>
          <li>Design a Ticket Booking System — seat holds, flash sales, and strong consistency</li>
          <li>Design a Distributed Cache (Redis) — consistent hashing, eviction, and stampede</li>
          <li>Design an E-Commerce Platform — catalog, cart, inventory, and checkout</li>
        </ol>
      </section>

      <div className="flex gap-3 flex-wrap mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
        <Link
          href="/study-guide"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          DSA Study Guide →
        </Link>
        <Link
          href="/"
          className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
        >
          LeetCode Solutions →
        </Link>
      </div>
    </div>
  )
}
