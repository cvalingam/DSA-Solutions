import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-search-engine',
  title: 'Design a Search Engine (Google)',
  description:
    'System design for web search: inverted index, query processing, ranking, autocomplete, and scaling reads to billions of queries for interview prep.',
  readMinutes: 12,
  published: '2026-06-24',
  category: 'case-study',
  seoKeywords: [
    'search engine system design',
    'Google search architecture interview',
    'inverted index design',
    'web search ranking',
  ],
  sections: [
    {
      type: 'p',
      text: 'Search engine design sits one layer above the [web crawler](/system-design/design-web-crawler): the crawler discovers pages; the search system indexes them and answers queries in milliseconds. Interviewers want inverted indexes, ranking intuition, and how you scale read-heavy query traffic - not a PhD in information retrieval. Use the [framework](/system-design/how-to-approach-system-design-interviews) to scope: web search vs enterprise document search vs autocomplete-only.',
    },
    { type: 'h2', text: 'Requirements' },
    { type: 'h3', text: 'Functional' },
    {
      type: 'ul',
      items: [
        'User types query; system returns ranked list of URLs with snippets.',
        'Support phrase search, spelling correction, and safe-search filters.',
        'Index updates as crawler discovers new/changed pages.',
        'Autocomplete suggestions as user types (optional deep dive).',
      ],
    },
    { type: 'h3', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        '5B queries/day ≈ 60K QPS average; peak 3× in business hours.',
        'p99 query latency under 200 ms end-to-end.',
        'Index freshness: hours for news, days for long-tail.',
        'High availability - search downtime is front-page news.',
      ],
    },
    {
      type: 'callout',
      title: 'Crawler is upstream',
      text: 'If the interviewer has not covered crawling, sketch it in two minutes: frontier queue, politeness, dedup - then say "documents land in the indexing pipeline." Do not spend twenty minutes on robots.txt unless asked.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'table',
      headers: ['Component', 'Role'],
      rows: [
        ['Query service', 'Parse query, fan-out to index shards, merge, rank, render'],
        ['Inverted index shards', 'term → posting list (doc_id, positions, fields)'],
        ['Document store', 'doc_id → URL, title, body text for snippets'],
        ['Indexer pipeline', 'Tokenize, stem, build postings from crawler events'],
        ['PageRank / rank features (offline)', 'Precomputed signals merged at query time'],
        ['Autocomplete ([typeahead](/system-design/design-typeahead-autocomplete))', 'Prefix trie + popular query log'],
        ['Spell checker', 'Edit distance against dictionary / query log'],
      ],
    },
    { type: 'h2', text: 'Inverted index' },
    {
      type: 'p',
      text: 'Core data structure: each term maps to a posting list of documents containing it. Posting entry: `(doc_id, term_frequency, field_bitmap, positions[])`. Boolean AND of terms = intersect posting lists (merge join on sorted doc_ids - same skill as merge intervals on LeetCode). Phrase query requires position check: "new york" means "new" immediately before "york" in the same field. Shards partition by term hash: all postings for "cat" live on shard `hash("cat") % N`.',
    },
    { type: 'h2', text: 'Indexing pipeline' },
    {
      type: 'ol',
      items: [
        'Crawler emits `(url, html_s3_key, fetch_time)` on [Kafka](/system-design/message-queues-async-processing).',
        'Indexer parses HTML: title, headings, body text; drop boilerplate/nav.',
        'Tokenize, lowercase, stem ("running" → "run"), remove stop words (optional).',
        'Assign doc_id; write forward index (doc → terms) and inverted updates.',
        'Batch merge small index segments into larger segments (LSM-style).',
        'Offline job recomputes PageRank, anchor text, spam scores.',
      ],
    },
    {
      type: 'p',
      text: 'Indexing is write-heavy and async - hours of lag is acceptable. Query path reads only merged, immutable index segments plus small real-time buffer for fresh docs. Dual-path indexing (batch + incremental) is a common senior talking point.',
    },
    { type: 'h2', text: 'Query path' },
    {
      type: 'ol',
      items: [
        'Normalize query: lowercase, spell-correct, expand synonyms if configured.',
        'Determine which index shard owns each query term (typically one shard per term, not every shard).',
        'Parallel RPC to those shards: each returns top-K doc candidates with scores.',
        'Merge shard results; apply ranking model (BM25 + PageRank + freshness + user context).',
        'Fetch snippets from document store; highlight query terms.',
        'Return JSON results; log query for analytics and autocomplete.',
      ],
    },
    { type: 'h2', text: 'Ranking (what to say without overclaiming)' },
    {
      type: 'p',
      text: 'v1: BM25 text relevance + PageRank authority + recency decay. Senior: learning-to-rank with hundreds of features, click-through rate as feedback loop. Interview sweet spot: "I combine lexical match score with precomputed PageRank and boost recent news for time-sensitive queries." Personalization (search history) is a separate [cache](/system-design/caching-fundamentals-for-interviews) layer - optional.',
    },
    { type: 'h2', text: 'Capacity estimation' },
    {
      type: 'p',
      text: '10B web pages, average 50 terms/page after stemming → 500B postings. Compressed posting list ~4 bytes/doc entry is optimistic - real systems use delta encoding and often land in tens of TB, not 2 TB. Order-of-magnitude is enough in interviews. 60K QPS × ~3 terms avg (after stop words) ≈ one shard RPC per term → ~180K internal shard reads/sec before replication - need replicated index servers in each region. Query logs: 5B rows/day → [Kafka](/system-design/message-queues-async-processing) to data warehouse, not SQL.',
    },
    { type: 'h2', text: 'Sharding and replication' },
    {
      type: 'p',
      text: 'Shard by term hash for even spread - hot terms like "the" are stop-word removed. Each shard has read replicas in multiple regions; query router picks nearest replica. [Database sharding](/system-design/database-sharding-replication) principles apply: avoid cross-shard joins at query time; merge only top-K lists. Rebalance when shard size skews (split hot terms).',
    },
    { type: 'h2', text: 'Autocomplete integration' },
    {
      type: 'p',
      text: 'Separate low-latency path: prefix trie built from top 10M queries by frequency, cached in Redis per prefix ([typeahead article](/system-design/design-typeahead-autocomplete)). Does not hit full inverted index. Spell correction uses edit-distance-1 against vocabulary or "did you mean" from query log co-occurrence.',
    },
    { type: 'h2', text: 'Consistency model' },
    {
      type: 'p',
      text: 'Index segments are immutable once published - readers never see half-written postings. New crawler docs go to a "fresh" tier merged periodically. Under [CAP](/system-design/cap-theorem-consistency-models), search is AP on reads: stale results for minutes beat unavailable search. Payment-grade consistency not required.',
    },
    { type: 'h2', text: 'Failure modes' },
    {
      type: 'table',
      headers: ['Failure', 'Mitigation'],
      rows: [
        ['Index shard timeout', 'Return partial results + degrade message; retry other replicas'],
        ['Hot term shard overload', 'Dedicated replica pool; cache popular query results'],
        ['Indexer backlog', 'Scale consumers; prioritize news domains'],
        ['Spam / SEO abuse', 'Offline classifier; demote in rank features'],
        ['Snippet store miss', 'Fallback to URL + title only'],
      ],
    },
    { type: 'h2', text: 'API sketch' },
    {
      type: 'ul',
      items: [
        'GET /search?q=...&page=1 - ranked results + snippets',
        'GET /suggest?q=pre - autocomplete (separate service)',
        'Internal: POST /index/document - crawler pipeline only',
      ],
    },
    { type: 'h2', text: 'Sample opening (first three minutes)' },
    {
      type: 'p',
      text: 'Interviewer: "Design Google search." You: "I will assume web-scale query volume with an existing crawler feeding an async indexer. Queries hit a router that fans out to term-sharded inverted indexes, merges top candidates, ranks with BM25 plus PageRank, and fetches snippets. Autocomplete and spell-check are separate fast paths. I will estimate QPS and index size next."',
    },
    { type: 'h2', text: 'Worked example: query "distributed cache"' },
    {
      type: 'p',
      text: 'Tokenizer emits ["distribut", "cache"] after stemming. Router contacts shards holding each term. Shard for "cache" returns 50K doc_ids; shard for "distribut" returns 12K. Intersect sorted lists → 800 candidates. Ranker scores top 100 with BM25 + PageRank. Snippet service pulls titles and highlights "cache" in context. Total shard RPC time budget: 50 ms; merge + rank: 20 ms; snippet fetch parallelized. Misspell "distribted" → spell checker suggests "distributed" before shard fan-out.',
    },
    { type: 'h2', text: 'Deep dive: posting list compression' },
    {
      type: 'p',
      text: 'Raw posting lists are huge. Production systems delta-encode doc_ids (store gaps, not absolute ids), variable-byte encode integers, and partition by document frequency (rare terms inline, common terms in skip lists). You do not need to implement this - saying "postings are compressed and merged in segments" signals you understand why the index fits on disk and not in one giant hash map.',
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'Close with: "Term-sharded inverted index, parallel top-K merge, BM25 plus PageRank, async indexer from crawler Kafka stream, autocomplete on separate trie." Mention compression and spell-check if time allows.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Explained inverted index and posting list intersection.',
        'Separated indexing (async) from query (sync, low latency).',
        'Described sharding by term and merging top-K across shards.',
        'Mentioned ranking signals without pretending to know ML details.',
        'Connected to crawler upstream and typeahead sidecar.',
      ],
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'Search is inverted indexes at scale plus a ranking layer. Crawl offline, query online. If you know [tries](/system-design/design-typeahead-autocomplete) and [message queues](/system-design/message-queues-async-processing), you already have half the vocabulary - this article connects them into a complete Google-style answer.',
    },
  ],
}

export default article
