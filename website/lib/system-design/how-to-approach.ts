import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'how-to-approach-system-design-interviews',
  title: 'How to Approach System Design Interviews (Without Panicking)',
  description:
    'A practical framework for system design interviews: clarifying requirements, estimating scale, sketching APIs, choosing storage, and discussing trade-offs the way real interviewers expect.',
  readMinutes: 14,
  published: '2026-06-06',
  category: 'fundamentals',
  sections: [
    {
      type: 'p',
      text: 'System design interviews feel different from LeetCode rounds. Nobody hands you a function signature and waits for O(n log n). Instead, you get a vague prompt — "design Twitter" or "design a parking lot" — and forty-five minutes to show you can think like an engineer who ships real software. The good news: interviewers are not looking for a perfect architecture. They want to see structured thinking, reasonable trade-offs, and honest communication when you do not know something.',
    },
    {
      type: 'p',
      text: 'I have sat on both sides of these conversations. Candidates who pass are rarely the ones who memorise every AWS service. They are the ones who slow down, ask questions, and build the design in layers instead of dumping buzzwords.',
    },
    { type: 'h2', text: 'What interviewers actually evaluate' },
    {
      type: 'p',
      text: 'Before we talk about boxes and arrows, understand the rubric. Most companies score roughly four areas:',
    },
    {
      type: 'ul',
      items: [
        'Requirement gathering — Do you clarify functional and non-functional needs before designing?',
        'High-level design — Can you decompose the problem into services or components that make sense?',
        'Deep dives — When the interviewer zooms in on one piece (the feed, the database, caching), can you go one level deeper with specifics?',
        'Trade-offs — Do you explain why you chose SQL over NoSQL, or synchronous calls over async queues, instead of treating every decision as obvious?',
      ],
    },
    {
      type: 'callout',
      title: 'A common misconception',
      text: 'You do not need to design for Google scale on day one. Many mid-level interviews expect designs for millions of users, not billions. Ask about scale early. Designing for 10K daily active users is a completely different conversation than designing for 100 million.',
    },
    { type: 'h2', text: 'The 45-minute framework I recommend' },
    {
      type: 'p',
      text: 'Use this as a pacing guide. Adjust if your interviewer wants to skip ahead or dive straight into storage.',
    },
    {
      type: 'ol',
      items: [
        'Minutes 0–5: Clarify requirements and constraints',
        'Minutes 5–10: Back-of-envelope capacity estimation',
        'Minutes 10–20: High-level architecture (API + main components)',
        'Minutes 20–35: Deep dive on 1–2 critical paths',
        'Minutes 35–45: Bottlenecks, failure modes, and what you would do next with more time',
      ],
    },
    { type: 'h2', text: 'Step 1: Clarify requirements (do not skip this)' },
    {
      type: 'p',
      text: 'The prompt is intentionally incomplete. "Design a URL shortener" could mean a hobby project or bit.ly at global scale. Your first job is to narrow the scope with the interviewer.',
    },
    { type: 'h3', text: 'Functional requirements' },
    {
      type: 'p',
      text: 'Ask what the system must do. For a URL shortener, that might be: shorten a long URL, redirect when someone visits the short link, optional custom aliases, optional expiration. Write these down visibly — whiteboard, Excalidraw, or shared doc.',
    },
    { type: 'h3', text: 'Non-functional requirements' },
    {
      type: 'p',
      text: 'This is where senior candidates separate themselves. Ask about read/write ratio, latency expectations, availability targets, consistency needs, and geographic distribution. A redirect service is read-heavy. A payment ledger is write-heavy and needs strong consistency.',
    },
    {
      type: 'ul',
      items: [
        'How many users? Daily active users (DAU) matters more than registered accounts.',
        'How many operations per second (QPS) for reads and writes?',
        'What latency is acceptable? Sub-100ms for redirects vs. seconds for batch reports.',
        'Can we lose data? Eventual consistency is often fine for social feeds; not for bank balances.',
        'Do we need authentication, analytics, admin dashboards? Often out of scope unless stated.',
      ],
    },
    { type: 'h2', text: 'Step 2: Rough capacity estimation' },
    {
      type: 'p',
      text: 'You are not trying to be precise. You are showing you can connect product numbers to engineering decisions. Interviewers love seeing napkin math.',
    },
    {
      type: 'p',
      text: 'Example: 50 million new short links per month, 100:1 read-to-write ratio. That is roughly 20 writes/sec average (50M / 30 days / 86400), peaking maybe 5× at 100 writes/sec. Reads: 2,000/sec average, 10,000/sec peak. Storage: if each mapping is ~500 bytes, 50M/month × 12 months × 500 bytes ≈ 300 GB/year before replication. Suddenly you know a single beefy database might work initially, but you need caching for reads.',
    },
    {
      type: 'callout',
      title: 'Useful numbers to memorise',
      text: '1 day ≈ 86,400 seconds. 1 million seconds ≈ 11.5 days. A modern SSD does thousands of IOPS; a single PostgreSQL instance can handle thousands of simple queries/sec with proper indexing. These anchors stop you from proposing 500 microservices for a school project.',
    },
    { type: 'h2', text: 'Step 3: High-level design' },
    {
      type: 'p',
      text: 'Start simple. A load balancer, an application tier, a database, and maybe a cache is a fine opening sketch for many problems. Name your APIs early — it forces you to think about data flow.',
    },
  ],
}

// Append remaining sections
article.sections.push(
  { type: 'h3', text: 'Define the API contract' },
  {
    type: 'p',
    text: 'For the URL shortener: POST /api/urls with { longUrl, customAlias?, ttl? } returns { shortUrl }. GET /{shortCode} returns HTTP 302 to the long URL. That is enough to drive your data model: you need to store shortCode → longUrl, plus metadata like createdAt and expiry.',
  },
  { type: 'h3', text: 'Pick a data model before optimising' },
  {
    type: 'p',
    text: 'A relational table works: id, short_code (unique index), long_url, created_at, expires_at. The redirect path is a single indexed lookup. You can shard later by short_code hash if needed. Resist jumping to Cassandra because you heard Netflix uses it.',
  },
  { type: 'h2', text: 'Step 4: Deep dives the interviewer will probe' },
  {
    type: 'p',
    text: 'They will pick the interesting part. For read-heavy systems, that is usually caching and CDN. For write-heavy systems, it is partitioning and write amplification. For social products, it is fan-out on write vs fan-out on read.',
  },
  {
    type: 'ul',
    items: [
      'How do you generate short codes? Base62 encoding of an auto-increment ID, or hash with collision handling?',
      'What happens when the database is down? Read-through cache might still serve hot links; new writes fail gracefully.',
      'How do you prevent abuse? Rate limiting per IP, CAPTCHA on create, blocklist for malicious domains.',
    ],
  },
  { type: 'h2', text: 'Step 5: Discuss trade-offs out loud' },
  {
    type: 'p',
    text: 'Every design choice has a cost. Say it. "I am using PostgreSQL because we need strong uniqueness on short codes and our write volume is modest. If writes grew 100×, I would consider separating the ID generation service and using a write-optimised store." That sentence alone signals maturity.',
  },
  {
    type: 'table',
    headers: ['Decision', 'Option A', 'Option B', 'When B wins'],
    rows: [
      ['ID generation', 'DB auto-increment', 'Dedicated ID service (Snowflake)', 'Very high write throughput across regions'],
      ['Read path', 'Cache-aside (Redis)', 'CDN edge cache', 'Static or semi-static redirect targets'],
      ['Consistency', 'Strong (SQL transaction)', 'Eventual (async replication)', 'Analytics, feeds, non-critical counters'],
      ['Communication', 'Synchronous REST', 'Message queue', 'Decouple slow work (email, indexing)'],
    ],
  },
  { type: 'h2', text: 'What to do when you are stuck' },
  {
    type: 'p',
    text: 'Silence is worse than uncertainty. Say: "I have not built a global chat system before, but I would start by separating the message store from the presence service. Let me think through how delivery guarantees would work." Interviewers reward honesty and recovery.',
  },
  {
    type: 'ol',
    items: [
      'Restate the sub-problem in your own words.',
      'Relate it to something you know (a LeetCode pattern, a system you have used at work).',
      'Propose a simple v1, then one optimisation if scale demands it.',
    ],
  },
  { type: 'h2', text: 'How this connects to your DSA prep' },
  {
    type: 'p',
    text: 'The same skills from LeetCode transfer. Hash maps become caches and indexes. BFS becomes message propagation. Heaps become priority queues for task scheduling. If you have been grinding patterns on this site, you already have the algorithmic vocabulary — system design is about applying it at warehouse scale with networking and storage in the mix.',
  },
  {
    type: 'p',
    text: 'Next in this series: case studies ([URL shortener](/system-design/design-url-shortener), [rate limiter](/system-design/design-rate-limiter), [news feed](/system-design/design-news-feed), [chat](/system-design/design-chat-messaging), [notifications](/system-design/design-notification-system), [file storage](/system-design/design-file-storage-dropbox), [typeahead](/system-design/design-typeahead-autocomplete), [web crawler](/system-design/design-web-crawler), [ride hailing](/system-design/design-ride-hailing-uber), [payments](/system-design/design-payment-system), [video streaming](/system-design/design-video-streaming-netflix), [search engine](/system-design/design-search-engine), [ticket booking](/system-design/design-ticket-booking-system), [e-commerce](/system-design/design-ecommerce-shopping-cart)) and fundamentals ([caching](/system-design/caching-fundamentals-for-interviews), [distributed cache](/system-design/design-distributed-cache-redis), [SQL vs NoSQL](/system-design/sql-vs-nosql-for-interviews), [load balancing](/system-design/load-balancing-and-scaling), [API design](/system-design/api-design-rest-interviews), [unique IDs](/system-design/design-unique-id-generator), [message queues](/system-design/message-queues-async-processing), [CAP theorem](/system-design/cap-theorem-consistency-models), [sharding](/system-design/database-sharding-replication)). Practise one design per week out loud.',
  },
  { type: 'h2', text: 'A sample opening (first three minutes)' },
  {
    type: 'p',
    text: 'Here is dialogue that signals competence. Interviewer: "Design a URL shortener." You: "Before I draw boxes, let me clarify scope. Are we building a consumer product like bit.ly, or an internal link service for one company? Do we need analytics on clicks, custom aliases, or expiration? For scale, should I assume millions or billions of links per month?" That opening buys trust and prevents you from designing the wrong system.',
  },
  {
    type: 'p',
    text: 'Then: "I will assume 100 million new links per month, read-heavy traffic, sub-100ms redirects, and no login requirement for v1. I will start with a simple API, PostgreSQL for storage, Redis for hot redirects, and discuss scaling if we have time." You have not drawn anything yet, but the interviewer knows you are structured.',
  },
  { type: 'h2', text: 'Common mistakes that fail candidates' },
  {
    type: 'ul',
    items: [
      'Jumping to microservices before proving you need them — a monolith with a cache often passes.',
      'Naming technologies without explaining why — "we use Kafka" is worthless without the event flow.',
      'Ignoring the write path on read-heavy systems — creation and redirect have different bottlenecks.',
      'Forgetting failure modes — what happens when Redis or the database is unavailable?',
      'Never checking back with the interviewer — treat it as a design review, not a solo exam.',
    ],
  },
  { type: 'h2', text: 'Tools that help you practise' },
  {
    type: 'p',
    text: 'Use Excalidraw or a whiteboard app and time yourself. Record a 45-minute mock and watch for long silences. Read one case study per week on this site, then redesign it from memory 48 hours later. Pair with our [From LeetCode Patterns to Real Systems](/system-design/from-leetcode-patterns-to-real-systems) article if DSA is your stronger side — it maps hash maps to indexes, BFS to fan-out, and heaps to schedulers.',
  },
  { type: 'h2', text: 'How interview difficulty maps to level' },
  {
    type: 'table',
    headers: ['Level', 'Typical prompt', 'Depth expected'],
    rows: [
      ['Junior / new grad', 'Design a parking lot, pastebin', 'OOP, basic CRUD, one database'],
      ['Mid-level', 'URL shortener, rate limiter, news feed', 'Caching, sharding basics, API design'],
      ['Senior', 'Global chat, multi-region storage', 'Consistency models, CAP trade-offs, ops'],
      ['Staff+', 'Design YouTube, ad bidding', 'Cost modelling, org constraints, migration'],
    ],
  },
  {
    type: 'p',
    text: 'Match your preparation to the roles you apply for. A .NET developer interviewing for a product company at mid-level should nail URL shortener + rate limiter + caching — those three cover the majority of loop questions.',
  },
  { type: 'h2', text: 'Whiteboard layout that interviewers can follow' },
  {
    type: 'p',
    text: 'Divide the board into three zones: left = requirements and estimates (bullets, numbers), centre = architecture diagram (left-to-right data flow), right = deep dive detail (schema, cache keys, one sequence diagram). Interviewers photograph the board or share the Excalidraw link — a messy board hurts even good ideas. Label every arrow: "HTTPS", "async event", "read replica".',
  },
  {
    type: 'p',
    text: 'Start the diagram only after requirements. Candidates who draw AWS icons first look like they memorised a blog post. Candidates who write "POST /urls → validate → DB insert → return short URL" look like engineers.',
  },
  { type: 'h2', text: 'Questions to ask every interviewer' },
  {
    type: 'ul',
    items: [
      'What scale should I design for — thousands, millions, or billions of users?',
      'Is this mobile-first, web-only, or API for third parties?',
      'What consistency level is acceptable — can reads be stale by a few seconds?',
      'Are we optimising for time-to-market or maximum scalability?',
      'Should I include analytics, admin tools, or stick to core user flows?',
    ],
  },
  {
    type: 'p',
    text: 'Asking two or three of these is enough. Write the answers on the board — they become constraints that justify your later decisions.',
  },
)

export default article
