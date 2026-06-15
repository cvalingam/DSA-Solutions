import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'from-leetcode-patterns-to-real-systems',
  title: 'From LeetCode Patterns to Real Systems',
  description:
    'How binary search, BFS, heaps, hash maps, and LRU cache problems map to production system design — databases, queues, caches, and load balancers explained for developers who learned DSA first.',
  readMinutes: 12,
  published: '2026-06-06',
  category: 'bridge',
  sections: [
    {
      type: 'p',
      text: 'If you have spent months on LeetCode, you have built an intuition for algorithms that many system design candidates lack. The gap is vocabulary: the same ideas appear in distributed systems under different names. This article bridges that gap so your DSA prep feels like preparation for system design, not a separate universe. Start with the [interview framework](/system-design/how-to-approach-system-design-interviews), then read the [URL shortener](/system-design/design-url-shortener) case study with these mappings in mind.',
    },
    { type: 'h2', text: 'Hash maps → indexes and caches' },
    {
      type: 'p',
      text: 'Two Sum asks: can I find a complement in O(1) time? You use a hash map. In production, a database index is a sorted or hashed structure that avoids full table scans. Redis is literally an in-memory hash map with optional persistence. When you design a [URL shortener redirect](/system-design/design-url-shortener), you are doing O(1) lookup by key at millions of requests per second.',
    },
    {
      type: 'p',
      text: 'Interview translation: "We need fast lookup by short code, so primary key index on short_code, plus Redis cache-aside for hot keys." You just described a hash map at two layers.',
    },
    { type: 'h2', text: 'Binary search → partitioning and load balancing' },
    {
      type: 'p',
      text: 'Binary search works because the answer space is monotonic: if X is too small, everything below is too small. In systems, consistent hashing partitions keys across servers — given a key, you binary-search (or hash-mod) to find the right shard. Load balancers use similar logic to route requests to healthy backends.',
    },
    {
      type: 'p',
      text: 'LeetCode 410 (Split Array Largest Sum) and "binary search on answer" problems train you to recognise monotonic predicates. System design uses the same skill: "Find the minimum cache size such that p99 latency stays under 50ms."',
    },
    { type: 'h2', text: 'BFS and DFS → message propagation and dependency graphs' },
    {
      type: 'p',
      text: 'Number of Islands is BFS on a grid. In systems, BFS models level-by-level fan-out: infecting neighbours, propagating config updates, or finding shortest path in an unweighted service dependency graph. Topological sort (Course Schedule) is how build systems and workflow engines detect circular dependencies before deployment.',
    },
    {
      type: 'p',
      text: 'Designing a news feed? Fan-out on write is BFS from the poster to all followers. Fan-out on read is DFS/BFS from the reader merging multiple timelines. You have done both — just on adjacency lists instead of microservices.',
    },
    { type: 'h2', text: 'Heaps → priority queues and scheduling' },
    {
      type: 'p',
      text: 'Merge K Sorted Lists and Find Median from Data Stream use heaps. In production: task schedulers, rate limiter token refill queues, Dijkstra priority queues for routing. Kubernetes schedules pods by priority and resource fit — a heap problem with extra constraints.',
    },
    {
      type: 'p',
      text: 'When an interviewer asks how you would process urgent jobs first, say priority queue backed by a heap — O(log n) insert — and mention that .NET 6+ has PriorityQueue<TElement, TPriority> built in, the same abstraction you use on LeetCode.',
    },
    { type: 'h2', text: 'LRU Cache → distributed caching' },
    {
      type: 'p',
      text: 'LeetCode 146 implements get/put in O(1) with a hash map plus doubly linked list. Redis LRU eviction policies (allkeys-lru, volatile-lru) solve the same problem at server scale: limited memory, evict least recently used keys. The interview insight: caching is not magic — it is an LRU with TTL and network latency. Our [caching fundamentals](/system-design/caching-fundamentals-for-interviews) article walks through cache-aside, TTL, and thundering herd in detail.',
    },
    { type: 'h2', text: 'Sliding window → rate limiting and log aggregation' },
    {
      type: 'p',
      text: 'Longest Substring Without Repeating Characters maintains a window with frequency counts. [Rate limiters](/system-design/design-rate-limiter) count requests in a sliding time window. Log aggregators bucket events per minute. Same invariant: add on enter, remove on exit, check constraint on the window.',
    },
    { type: 'h2', text: 'Union-Find → network connectivity and disjoint services' },
    {
      type: 'p',
      text: 'Union-Find detects connected components in O(α(n)) amortized time. In infrastructure, it models network reliability (which nodes stay reachable after a failure), fraud rings (are these accounts in the same cluster?), and shard rebalancing (group keys that must move together).',
    },
    {
      type: 'p',
      text: 'Interview phrase: "I would model service dependencies as an undirected graph and use Union-Find to detect if removing one node splits the system into disconnected components."',
    },
    { type: 'h2', text: 'Dynamic programming → capacity planning' },
    {
      type: 'p',
      text: 'DP optimises over overlapping subproblems. Autoscaling rules optimise cost vs latency — same structure, different objective. CDN cache placement: which keys to keep at edge given storage budget? You will not write recurrence relations on a whiteboard, but the mindset — define state, avoid recomputation — transfers directly.',
    },
    { type: 'h2', text: 'What does not transfer directly' },
    {
      type: 'p',
      text: 'Be honest about the gaps. LeetCode ignores network latency, partial failures, and operational cost. A O(n) algorithm that ships 10GB over the wire is worse than O(n log n) with aggressive caching. System design adds CAP theorem trade-offs, replication lag, and human factors (on-call, deployments). Learn those separately — but your pattern recognition is already half the battle.',
    },
    { type: 'h2', text: 'Two pointers → read replicas and load balancing' },
    {
      type: 'p',
      text: 'Two pointers converge from both ends of a sorted array. Read replicas split read load from a primary writer — same "divide the work" intuition. A load balancer round-robins across healthy app instances. When you explain horizontal scaling, you are describing algorithmic partitioning applied to servers.',
    },
    { type: 'h2', text: 'Graphs → service maps and dependency chains' },
    {
      type: 'p',
      text: 'Course Schedule II gives you a topological order. Your CI/CD pipeline and microservice startup order use the same algorithm — service B cannot start until service A is healthy. When an interviewer asks "what breaks if the payment service goes down?", you are traversing a dependency graph.',
    },
    {
      type: 'p',
      text: 'Number of Islands on a grid maps to region failure in cloud availability zones: flood-fill from an outage and see what else loses connectivity. BFS from the failed node lists all impacted services within N hops.',
    },
    { type: 'h2', text: 'Trie → autocomplete and routing tables' },
    {
      type: 'p',
      text: 'Implement Trie (LeetCode 208) for prefix search. DNS resolution, IP routing tables, and search autocomplete all use prefix trees. Typeahead on a URL shortener custom alias check? Trie or hash set of reserved prefixes. Mentioning trie shows you connect string problems to infrastructure.',
    },
    { type: 'h2', text: 'Monotonic stack → request scheduling' },
    {
      type: 'p',
      text: 'Daily Temperatures finds the next greater element for each position in O(n). In systems, "next greater" appears when a higher-priority job preempts the current one, or when a load spike exceeds the previous max — stack-based schedulers process events in order without re-scanning.',
    },
    {
      type: 'p',
      text: 'Less common in interviews than hash maps or BFS, but a strong bonus mention for senior loops when discussing job queues or event-driven architectures.',
    },
    { type: 'h2', text: 'Practice exercise: pick one LeetCode pattern per day' },
    {
      type: 'table',
      headers: ['LeetCode pattern', 'System design phrase to practise'],
      rows: [
        ['Two Sum / hash map', 'O(1) lookup via Redis cache-aside on redirect'],
        ['Binary search on answer', 'Minimum shard count for p99 < 50ms'],
        ['BFS', 'Fan-out notification to N followers level by level'],
        ['Heap', 'Priority queue for background job workers'],
        ['Union-Find', 'Detect circular service dependencies before deploy'],
        ['Sliding window', 'Rate limit 100 requests per rolling minute'],
      ],
    },
    {
      type: 'p',
      text: 'Say each phrase out loud while drawing one box and one arrow. That bridges muscle memory from coding problems to whiteboard vocabulary. Within two weeks the words feel natural in a mock interview.',
    },
  ],
}

// Add closing section with links to study resources
article.sections.push(
  { type: 'h2', text: 'A practical study plan' },
  {
    type: 'ol',
    items: [
      'Finish core DSA patterns on this site (arrays through graphs).',
      'Read the [system design framework](/system-design/how-to-approach-system-design-interviews) and one case study per week.',
      'Work through [URL shortener](/system-design/design-url-shortener), [rate limiter](/system-design/design-rate-limiter), and [caching](/system-design/caching-fundamentals-for-interviews) in order.',
      'For each pattern you learn, write one sentence: "In production this looks like ___."',
      'Mock one 45-minute design out loud — record yourself and check for silence gaps.',
      'Skim real postmortems (AWS, Cloudflare blogs) to see how failures happen in practice.',
    ],
  },
  {
    type: 'p',
    text: 'You are not starting from zero. You are translating skills you already have into a new interview format. That is much faster than learning system design cold.',
  },
)

export default article
