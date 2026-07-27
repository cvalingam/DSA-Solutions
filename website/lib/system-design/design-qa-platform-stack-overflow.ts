import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-qa-platform-stack-overflow',
  title: 'Design a Q&A Platform (Stack Overflow)',
  description:
    'How to design Stack Overflow / Quora for interviews: questions and answers, voting, reputation, full-text search, caching hot posts, and moderation.',
  readMinutes: 13,
  published: '2026-07-14',
  category: 'case-study',
  seoKeywords: [
    'Stack Overflow system design',
    'Quora system design interview',
    'design Q&A platform architecture',
    'voting reputation system design',
  ],
  sections: [
    {
      type: 'p',
      text: 'A Q&A site looks like a blog until traffic concentrates on a few viral questions. You need durable posts, sorted answers, votes that must not double-count, reputation side effects, and search that actually finds duplicates. It is a read-heavy [news feed](/system-design/design-news-feed) cousin mixed with a [search engine](/system-design/design-search-engine) and a careful counter service.',
    },
    {
      type: 'p',
      text: 'Set scope with the [framework](/system-design/how-to-approach-system-design-interviews): ask/answer/vote/comment/search/tags. Skip ads and Teams billing. Moderation can be rules + queues, not a full Trust & Safety org chart.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Post questions with tags; answer and comment.',
        'Upvote/downvote; accept an answer.',
        'Reputation derived from votes; basic badges.',
        'Search questions by text and tags; related questions.',
        'User profiles and activity history.',
        'Optional: bounties, real-time notifications on answers.',
      ],
    },
    { type: 'h2', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Read-heavy: popular questions cached at the edge/CDN.',
        'Vote idempotency per user per post - strong enough to prevent doubles.',
        'Search lag of a few seconds OK; vote counts can be slightly eventual on the page.',
        'Abuse: rate-limit posting and voting ([rate limiter](/system-design/design-rate-limiter)).',
        'SEO-friendly public URLs - many visits are anonymous Google traffic.',
      ],
    },
    {
      type: 'callout',
      title: 'Hot posts dominate',
      text: 'A tiny fraction of questions get almost all reads. Design for cache hits on the hot set and do not put every page view as a SQL row lock on the question. That single insight separates juniors from mid-levels here.',
    },
    { type: 'h2', text: 'Capacity sketch' },
    {
      type: 'p',
      text: '100M page views/day, write rate much smaller - say 50 QPS asks/answers peak, 500 QPS votes. Average question page 50 KB HTML-equivalent API payload. Cache hit ratio on top 1% URLs should be >90%. Reputation updates are fan-out-on-write to a user counters table, async if needed.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'ol',
      items: [
        'API tier - REST for posts, votes, users ([API design](/system-design/api-design-rest-interviews)).',
        'Post service - questions, answers, comments, accepts.',
        'Vote service - idempotent votes; emits score deltas.',
        'Reputation worker - consumes vote events; updates user reputation.',
        'Search indexer - async to Elasticsearch.',
        'Cache / CDN - anonymous question pages and tag homepages.',
        'Notification - new answer on your question ([notifications](/system-design/design-notification-system)).',
        'Moderation queue - flags, spam scores, review tools.',
      ],
    },
    { type: 'h2', text: 'Data model' },
    {
      type: 'table',
      headers: ['Entity', 'Store', 'Notes'],
      rows: [
        ['Question / Answer', 'SQL', 'Body, author, timestamps, accepted_answer_id'],
        ['Vote', 'SQL unique(user_id, post_id)', 'Direction +1/−1; source of truth'],
        ['Tag / TagMap', 'SQL', 'Many-to-many; denormalize counts'],
        ['User reputation', 'SQL', 'Updated by workers; cache on profile'],
        ['Search doc', 'Elasticsearch', 'Title, body, tags, score'],
        ['Timeline / feeds', 'Optional Redis', 'Personalized home if Quora-like'],
      ],
    },
    {
      type: 'p',
      text: 'Pick [SQL](/system-design/sql-vs-nosql-for-interviews) for posts and votes - relational integrity and unique constraints buy you correctness. Shard by question_id for answers if a single thread becomes huge; most never will.',
    },
    { type: 'h2', text: 'Voting and reputation' },
    {
      type: 'ol',
      items: [
        'POST /vote with user_id, post_id, direction - upsert on unique key.',
        'Compute delta vs previous vote (none → up is +1; up → down is −2, etc.).',
        'Update denormalized score on post (transaction or ordered event).',
        'Emit event; reputation worker applies rules (answer upvote +10, etc.).',
        'Invalidate cached question page fragment for score.',
      ],
    },
    {
      type: 'p',
      text: 'Do not increment score without the votes table - audits and undos become impossible. Eventual reputation is fine; show “score updating…” only if you must. For leaderboard-style global ranks, reuse ideas from the [leaderboard](/system-design/design-leaderboard) article sparingly - Stack Overflow is not a realtime game ranking.',
    },
    { type: 'h2', text: 'Read path and caching' },
    {
      type: 'p',
      text: 'Anonymous GET question → CDN → origin cache (Redis) → SQL. Key by question_id + content_version. On edit/vote, bump version or purge. Authenticated users may need personalized bits (your vote state) layered client-side or via a small uncached include. This is textbook [caching](/system-design/caching-fundamentals-for-interviews) with stampede protection on viral posts.',
    },
    { type: 'h2', text: 'Search and duplicates' },
    {
      type: 'p',
      text: 'Index title/body/tags; rank by text relevance × post score × recency. As-you-type ask box should suggest existing questions ([typeahead](/system-design/design-typeahead-autocomplete)) to reduce duplicates. “Related questions” can be a precomputed similarity list refreshed offline - same spirit as light [recommendations](/system-design/design-recommendation-system).',
    },
    { type: 'h2', text: 'Quora-style feed variant' },
    {
      type: 'p',
      text: 'If the prompt leans Quora: add follow graph and a home feed of answers from followed topics/people. Use fan-out on write for average users and fan-out on read for celebrities - straight from the news feed playbook. Stack Overflow can stay request-response + search.',
    },
    { type: 'h2', text: 'Moderation and abuse' },
    {
      type: 'ul',
      items: [
        'Rate-limit asks/votes/votes per user and IP.',
        'Automate spam signals; send to review queue ([job scheduler](/system-design/design-distributed-job-scheduler) for SLA).',
        'Soft-delete with tombstones for audit; hard-delete attachments from object storage later.',
        'CAPTCHA / proof-of-work on suspicious clients - mention briefly.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'User asks “Why is my HashMap slow?” with tags java, performance.',
        'Indexed in seconds; similar questions shown while typing.',
        'Answer A1 posted; author of question gets a push.',
        '50 upvotes: votes table enforces one per user; score cached on page.',
        'Asker accepts A1; accepted flag flips; reputation worker grants accept bonus.',
      ],
    },
    { type: 'h2', text: 'Interview narrative' },
    {
      type: 'p',
      text: 'Lead with read-heavy caching, SQL votes with unique constraints, and async search/reputation. Contrast Stack Overflow (search + canonical threads) with Quora (feed + follows). Tie notifications and rate limits as supporting boxes. Clean, practical, and distinctly not a generic CRUD app.',
    },
  ],
}

export default article
