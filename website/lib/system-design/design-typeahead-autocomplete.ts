import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-typeahead-autocomplete',
  title: 'Design a Typeahead / Autocomplete System (Google Search Bar)',
  description:
    'System design for search autocomplete: trie vs Elasticsearch, ranking, caching hot prefixes, and handling millions of queries per second in interviews.',
  readMinutes: 12,
  published: '2026-06-18',
  category: 'case-study',
  seoKeywords: ['autocomplete system design', 'typeahead search', 'trie prefix search'],
  sections: [
    {
      type: 'p',
      text: 'Typeahead is "return top 5 suggestions as the user types." It is read-heavy, latency-sensitive, and a natural fit for [tries](/system-design/from-leetcode-patterns-to-real-systems) — the same prefix-tree thinking as LeetCode word search problems. Interviewers care about p99 latency under 100ms and how you rank "ap" → apple, app, application. Use the [interview framework](/system-design/how-to-approach-system-design-interviews) to clarify personal vs global suggestions.',
    },
    { type: 'h2', text: 'Requirements' },
    { type: 'h3', text: 'Functional' },
    {
      type: 'ul',
      items: [
        'Given prefix string, return top K suggestions (e.g. K=5).',
        'Rank by popularity (search frequency) or personal history.',
        'Support billions of past queries; millions of DAU.',
        'Highlight matching substring in UI (client-side; API returns plain text).',
      ],
    },
    { type: 'h3', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Latency under 100ms p99; debounce handled client-side.',
        'Data updates as trends change (hourly or daily batch).',
        'Graceful degradation when trie is stale — return cached popular list.',
        'Abuse-resistant: rate limits and minimum prefix length.',
      ],
    },
    {
      type: 'callout',
      title: 'Clarify scope',
      text: 'Google-scale typeahead vs Netflix title search vs IDE symbol complete — scale and ranking differ. Ask if suggestions are global, per-user, or blended.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'table',
      headers: ['Component', 'Role'],
      rows: [
        ['Autocomplete API', 'GET /suggest?q=app&limit=5'],
        ['Suggestion service', 'Lookup + rank + merge personal/global'],
        ['Trie or inverted index', 'Prefix → candidate terms'],
        ['Popularity store', 'Term → score (Redis or embedded in trie)'],
        ['Analytics pipeline', 'Aggregate query logs → update scores offline'],
        ['CDN / edge cache', 'Cache hot prefixes ("a", "ap", "app")'],
      ],
    },
    { type: 'h2', text: 'Client-side behavior' },
    {
      type: 'p',
      text: 'The browser debounces keystrokes (150–300ms) so "application" does not fire eight API calls. Cancel in-flight fetch when the user types the next character — stale responses must not overwrite newer ones (track request sequence number). Show cached suggestions from the previous prefix while loading ("app" results visible while "appl" loads). Minimum prefix length of 2–3 chars cuts noise and storage for single-letter prefixes that are almost always cache misses at scale.',
    },
    { type: 'h2', text: 'Trie-based approach' },
    {
      type: 'p',
      text: 'Each trie node stores top K children by score along the path. Query "app": walk a→p→p, return node\'s precomputed top 5. Build trie offline from aggregated logs; refresh daily. Memory: compress with array trie or DAFSA for production. Fits in RAM for millions of terms if K is small per node.',
    },
    {
      type: 'ol',
      items: [
        'Offline job: count query frequencies, keep top N terms globally.',
        'Build trie; at each node store heap of top K terms in subtree.',
        'Online: traverse prefix in O(prefix length); return node.topK.',
      ],
    },
    { type: 'h2', text: 'Elasticsearch / prefix index alternative' },
    {
      type: 'p',
      text: 'For richer ranking (freshness, location, user segment), use search index with edge n-grams or completion suggester. Higher latency (~20–50ms) but flexible scoring. Hybrid: trie for ultra-hot prefixes, ES for long tail. Mention [SQL vs NoSQL](/system-design/sql-vs-nosql-for-interviews) — this is a search index problem, not relational.',
    },
    { type: 'h2', text: 'Caching strategy' },
    {
      type: 'p',
      text: '80% of traffic hits short prefixes. [Cache](/system-design/caching-fundamentals-for-interviews) Redis key suggest:app → JSON array of top 5. TTL 5–60 minutes. Warm cache after offline trie rebuild. Use CDN for anonymous global suggestions at edge PoPs — same idea as [URL shortener](/system-design/design-url-shortener) redirect caching.',
    },
    { type: 'h2', text: 'Personalization' },
    {
      type: 'p',
      text: 'Store per-user recent searches in Redis sorted set. On query, merge global trie results with user history (boost matching prefixes). Merge in app tier: take union, re-rank by blended score. Keep personal store small (last 50 queries).',
    },
    { type: 'h2', text: 'Capacity estimation' },
    {
      type: 'p',
      text: '10M DAU, 20 keystrokes per search session, 50% trigger API calls after debounce → 100M suggest requests/day ≈ 1,200 RPS average, ~6K peak. Each response ~200 bytes → ~1.2 MB/s average bandwidth. Trie in RAM: 10M terms × avg 10 bytes + scores ≈ hundreds of MB — feasible on few nodes with replication.',
    },
    { type: 'h2', text: 'API design' },
    {
      type: 'ul',
      items: [
        'GET /v1/suggest?q={prefix}&limit=5 — 200 { suggestions: [{ text, score }] }',
        'Debounce 150–300ms on client — do not call API every keypress.',
        'Return 429 when abusive — [rate limiter](/system-design/design-rate-limiter) per IP.',
      ],
    },
    { type: 'h2', text: 'Failure modes' },
    {
      type: 'table',
      headers: ['Failure', 'Mitigation'],
      rows: [
        ['Trie node missing prefix', 'Return empty array; fall back to popular global list'],
        ['Stale popularity', 'Acceptable for hours; critical news may need real-time stream update'],
        ['Cache stampede on hot prefix', 'Single-flight rebuild; pre-warm top 1000 prefixes'],
      ],
    },
    { type: 'h2', text: 'Trie node structure detail' },
    {
      type: 'p',
      text: 'Each node stores: children map (char → node), and min-heap or sorted array of top K (term, score) pairs in its subtree. When building offline, propagate best candidates up from leaves. Space trade-off: store only top 5 per node vs full term list at leaves — top-K per node is enough for autocomplete.',
    },
    { type: 'h2', text: 'Fuzzy matching (v2)' },
    {
      type: 'p',
      text: 'Typo tolerance ("appl" → "apple") needs edit-distance search or secondary phonetic index — out of scope for v1. Mention as extension: Elasticsearch fuzzy query or SymSpell on top of prefix trie.',
    },
    { type: 'h2', text: 'Latency budget' },
    {
      type: 'table',
      headers: ['Step', 'Target'],
      rows: [
        ['CDN / Redis cache hit', '5–15ms'],
        ['Trie traversal in memory', '< 1ms'],
        ['Personal merge + re-rank', '5–10ms'],
        ['Miss → ES fallback', '20–50ms'],
      ],
    },
    { type: 'h2', text: 'Offline analytics pipeline' },
    {
      type: 'ol',
      items: [
        'Ingest search logs to data warehouse (BigQuery/S3).',
        'Hourly job: aggregate query_text counts, filter bots.',
        'Rebuild trie artifact; upload to Redis / app servers.',
        'Atomic swap: point read path to new version flag.',
        'Drop queries shorter than 2 chars if noisy.',
      ],
    },
    { type: 'h2', text: 'Worked trie example' },
    {
      type: 'p',
      text: 'Terms: app(100), apple(80), apply(50), apt(40). Node at "ap" stores top-3: app, apple, apply. Query "ap" returns those three without scanning full dictionary. Query "app" returns app, apple, apply from child node. Insert new trending term offline — rebuild affected subtree tops only.',
    },
    { type: 'h2', text: 'Ranking signals' },
    {
      type: 'p',
      text: 'Popularity (global search count) is v1. v2 blends: recency boost for trending queries, user affinity, locale, and safe-search filters. All scoring happens on a bounded candidate set from the trie — never score the whole dictionary at request time. Precompute scores offline; online merge is arithmetic on ≤50 candidates.',
    },
    { type: 'h2', text: 'Scaling the read path' },
    {
      type: 'p',
      text: 'Autocomplete API is stateless behind [load balancer](/system-design/load-balancing-and-scaling). Trie artifact loaded in memory per node OR served from local SSD snapshot on boot. Blue-green deploy: new fleet warms trie, flip traffic. For multi-region: replicate read-only trie to each region; analytics pipeline still global but suggest latency drops for international users.',
    },
    { type: 'h2', text: 'Abuse and safety' },
    {
      type: 'ul',
      items: [
        'Minimum prefix length 2–3 chars before API call.',
        '[Rate limit](/system-design/design-rate-limiter) per IP and per API key.',
        'Blocklist offensive terms from trie during offline build.',
        'Do not log full queries with PII in plain text — hash user_id in analytics.',
      ],
    },
    { type: 'h2', text: 'Memory compression (DAFSA)' },
    {
      type: 'p',
      text: 'A naive trie with hash maps per node uses heavy pointer overhead. Production systems use array-backed tries, double-array trie, or DAFSA (minimal acyclic automaton) built offline — same prefix logic as LeetCode trie problems, but the artifact is a flat byte array loaded mmap-style on boot. Interview line: "We build the structure offline; online path is read-only traversal with no allocation." That signals you understand ops cost, not just algorithm class.',
    },
    { type: 'h2', text: 'Data freshness trade-off' },
    {
      type: 'p',
      text: 'Hourly trie rebuild means breaking news may lag. Breaking-glass path: stream trending queries into Redis sorted set, merge at read time with offline trie for prefixes matching news keywords. Most interviews accept hourly batch — mention real-time stream as v2.',
    },
    {
      type: 'table',
      headers: ['Approach', 'Latency', 'Freshness'],
      rows: [
        ['In-memory trie only', '< 5ms', 'Hours (batch rebuild)'],
        ['Elasticsearch completion', '20–50ms', 'Seconds (near real-time index)'],
        ['Hybrid trie + Redis trends', '< 15ms', 'Minutes for trending layer'],
      ],
    },
    { type: 'h2', text: 'Sample opening (first three minutes)' },
    {
      type: 'p',
      text: 'Interviewer: "Design search autocomplete." You: "Users type a prefix; we return top 5 suggestions under 100ms. I will assume global popularity ranking with optional personal history, offline trie built from query logs, Redis cache for hot prefixes, and cursor pagination not needed because responses are tiny. Ranking runs on a bounded candidate set, not the full index."',
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'Summarise: "Offline aggregate logs → trie with top-K per node, online O(prefix) lookup, Redis cache hot prefixes, optional personal merge from user history." Mention [API](/system-design/api-design-rest-interviews) and latency budget under 100ms.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Clarified global vs personal suggestions and scale.',
        'Explained trie with top-K per node and offline rebuild.',
        'Named Redis/CDN cache for hot prefixes.',
        'Gave latency budget under 100ms.',
        'Mentioned cursor-free prefix API and rate limiting.',
      ],
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'Typeahead is prefix lookup plus ranking — trie for speed, batch analytics for scores, cache for traffic concentration. Connect to trie and heap patterns from DSA prep.',
    },
  ],
}

export default article
