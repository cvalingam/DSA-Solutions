import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'load-balancing-and-scaling',
  title: 'Load Balancing and Horizontal Scaling for Interviews',
  description:
    'L4 vs L7 load balancers, round-robin vs consistent hashing, health checks, auto-scaling, and how to explain scaling a stateless API tier in system design interviews.',
  readMinutes: 10,
  published: '2026-06-17',
  category: 'fundamentals',
  sections: [
    {
      type: 'p',
      text: 'Almost every system design ends with "we put a load balancer in front." Interviewers want to know you understand what that actually does - and when horizontal scaling stops helping because state is stuck on one machine. This article covers the vocabulary and trade-offs you need, tied to designs like our [rate limiter](/system-design/design-rate-limiter) and [URL shortener](/system-design/design-url-shortener).',
    },
    { type: 'h2', text: 'Vertical vs horizontal scaling' },
    {
      type: 'table',
      headers: ['Approach', 'How', 'Limit'],
      rows: [
        ['Vertical (scale up)', 'Bigger CPU/RAM on one server', 'Hardware ceiling, single point of failure'],
        ['Horizontal (scale out)', 'More identical servers behind a load balancer', 'Requires stateless app tier or shared state layer'],
      ],
    },
    {
      type: 'p',
      text: 'Start vertical for simplicity. Scale horizontally when CPU or connection count exceeds one box. Databases scale differently - read replicas, sharding - covered briefly below.',
    },
    { type: 'h2', text: 'Load balancer responsibilities' },
    {
      type: 'ul',
      items: [
        'Distribute incoming requests across healthy backends.',
        'Terminate TLS (optional - also done at CDN edge).',
        'Health checks: remove unhealthy instances from the pool.',
        'Sticky sessions when needed (WebSocket, session in memory - avoid if possible).',
        'Single DNS entry for clients: api.example.com → LB → N app servers.',
      ],
    },
    { type: 'h2', text: 'Layer 4 vs Layer 7' },
    {
      type: 'table',
      headers: ['Layer', 'Operates on', 'Use when'],
      rows: [
        ['L4 (transport)', 'IP + TCP port', 'Raw throughput, WebSocket TCP proxy, gaming'],
        ['L7 (application)', 'HTTP headers, path, cookies', 'Route /api to API fleet, /static to CDN, canary by header'],
      ],
    },
    {
      type: 'p',
      text: 'Most REST APIs use L7 (nginx, HAProxy, AWS ALB). High-connection chat gateways may combine L4 for connection distribution with L7 routing for HTTP APIs.',
    },
    { type: 'h2', text: 'Load balancing algorithms' },
    {
      type: 'table',
      headers: ['Algorithm', 'Behaviour', 'Gotcha'],
      rows: [
        ['Round robin', 'Each server gets next request', 'Ignores server load'],
        ['Weighted round robin', 'More traffic to bigger instances', 'Good for mixed instance sizes'],
        ['Least connections', 'Send to server with fewest open connections', 'Better for long-lived requests'],
        ['Consistent hashing', 'Same key → same server', 'Used for caches and sharded data; minimizes remapping on node add/remove'],
      ],
    },
    {
      type: 'callout',
      title: 'Consistent hashing connection',
      text: 'When you shard a [cache](/system-design/caching-fundamentals-for-interviews) or rate limiter across Redis nodes, consistent hashing keeps most keys on the same node when you add a shard. Mention this when discussing distributed [rate limiting](/system-design/design-rate-limiter).',
    },
    { type: 'h2', text: 'Stateless application tier' },
    {
      type: 'p',
      text: 'To scale app servers horizontally, session data must not live only in server RAM. Store sessions in Redis, use JWTs, or pass user context from API gateway. Any server can handle any request. This is the pattern behind most microservice fleets.',
    },
    {
      type: 'ol',
      items: [
        'Client → DNS → Load Balancer → App Server (any instance).',
        'App server reads/writes shared DB or cache.',
        'No affinity required unless WebSocket (then sticky by user_id or dedicated connection registry).',
      ],
    },
    { type: 'h2', text: 'Auto-scaling' },
    {
      type: 'p',
      text: 'Cloud auto-scaling groups add/remove instances based on CPU, request rate, or queue depth. Scale-out is fast (minutes); scale-in should drain connections first. Mention cold start: new instances need warmup before taking full traffic - use health checks that verify app readiness, not just TCP listen.',
    },
    { type: 'h2', text: 'Scaling the data layer' },
    {
      type: 'ul',
      items: [
        'Read replicas: scale reads; writes still go to primary.',
        'Sharding: partition data by user_id hash across DB nodes.',
        'Connection pooling: PgBouncer between thousands of app servers and limited DB connections.',
        'CDN: scale static assets and cacheable GET responses at the edge.',
      ],
    },
    { type: 'h2', text: 'Failure modes' },
    {
      type: 'table',
      headers: ['Scenario', 'Mitigation'],
      rows: [
        ['Single LB dies', 'DNS to multiple LBs or cloud-managed redundant LB'],
        ['Thundering herd on scale-out', 'Jittered backoff, cache warming, gradual traffic shift'],
        ['Uneven shard load', 'Resharding, virtual nodes in consistent hashing'],
      ],
    },
    { type: 'h2', text: 'DNS and the entry point' },
    {
      type: 'p',
      text: 'Clients resolve api.example.com via DNS. DNS may return the load balancer VIP or multiple A records for geo routing. TTL matters: low TTL enables faster failover; high TTL reduces DNS load. The load balancer is the traffic cop; DNS is the address book. Mention both when drawing the first box in a diagram.',
    },
    { type: 'h2', text: 'Health checks in depth' },
    {
      type: 'p',
      text: 'Liveness checks: is the process up? Readiness checks: can this instance accept traffic (DB connected, cache warmed)? Send readiness failures to drain an instance before deploy. Active health probes hit GET /health every 5s; passive checks mark instances unhealthy after N consecutive 5xx responses. This prevents routing to a server that listens on port 80 but cannot serve requests.',
    },
    { type: 'h2', text: 'Deploying without downtime' },
    {
      type: 'ul',
      items: [
        'Rolling deploy: replace instances one at a time behind the LB.',
        'Blue-green: switch LB target group from old fleet to new fleet atomically.',
        'Canary: route 5% of traffic to new version; watch error rate before full cutover.',
      ],
    },
    {
      type: 'p',
      text: 'These patterns apply to the stateless tier in our [news feed](/system-design/design-news-feed) and [chat](/system-design/design-chat-messaging) designs - WebSocket gateways need connection draining on scale-in, which is harder than stateless HTTP.',
    },
    { type: 'h2', text: 'When horizontal scaling does not help' },
    {
      type: 'p',
      text: 'Adding app servers does not fix a saturated primary database or a single hot Redis key. Identify the bottleneck first: CPU on app tier → scale out; disk I/O on DB → replicas, sharding, or cache; one partition key → resharding. Say this explicitly in interviews to avoid the "just add more servers" trap.',
    },
    { type: 'h2', text: 'Worked example: scaling the URL shortener' },
    {
      type: 'p',
      text: 'Start with one app server and PostgreSQL. Traffic grows → add an L7 load balancer and N stateless app instances ([URL shortener](/system-design/design-url-shortener)). Read QPS still spikes on redirects → add Redis cache-aside. DB reads saturate → add read replicas. Write QPS exceeds primary capacity → shard url_mappings by hash of short_code. Each step solves a measured bottleneck - that narrative is what interviewers want.',
    },
    {
      type: 'table',
      headers: ['Bottleneck signal', 'Scale lever'],
      rows: [
        ['App CPU > 70% sustained', 'Horizontal scale behind LB'],
        ['DB read latency on redirects', 'Redis + read replicas'],
        ['DB write TPS on create', 'Sharding or async write queue'],
        ['Single Redis memory limit', 'Redis Cluster with consistent hashing'],
        ['Global latency', 'CDN for redirects + regional caches'],
      ],
    },
    { type: 'h2', text: 'API gateway vs load balancer' },
    {
      type: 'p',
      text: 'A load balancer distributes traffic to identical app servers. An API gateway adds cross-cutting concerns: authentication, [rate limiting](/system-design/design-rate-limiter), request validation, SSL termination, and routing /v1 vs /v2. In diagrams, gateway sits between LB and services, or LB and gateway merge into one managed product (AWS ALB + API Gateway). Say "gateway enforces auth and rate limits; LB balances healthy backends."',
    },
    { type: 'h2', text: 'Sticky sessions and WebSockets' },
    {
      type: 'p',
      text: 'HTTP requests should be stateless - any server handles any request. WebSocket connections are stateful TCP pipes. Options: (1) sticky sessions by user_id cookie so the same user lands on the same chat server, (2) connection registry in Redis so any server can find any user\'s socket ([chat design](/system-design/design-chat-messaging)). Prefer (2) at scale; sticky sessions break when instances die mid-connection.',
    },
    { type: 'h2', text: 'Capacity back-of-envelope' },
    {
      type: 'p',
      text: 'One modest app server handles ~1,000-5,000 simple HTTP req/sec depending on work per request. If peak is 50,000 req/sec and each server sustains 2,500, you need ~20 instances plus headroom for deploys. WebSocket servers are connection-bound: 50K concurrent sockets per box is a planning number - millions of users online means hundreds of gateway nodes. State these assumptions aloud in interviews.',
    },
    { type: 'h2', text: 'Latency budget through the stack' },
    {
      type: 'table',
      headers: ['Hop', 'Typical cost'],
      rows: [
        ['DNS lookup (cached)', '0-5ms'],
        ['TLS handshake (first request)', '20-50ms'],
        ['Load balancer', '1-5ms'],
        ['App server logic', '2-20ms'],
        ['Redis round-trip', '0.5-2ms'],
        ['DB replica query (cache miss)', '5-20ms'],
      ],
    },
    {
      type: 'p',
      text: 'A [cached redirect](/system-design/design-url-shortener) stays under 50ms p99. Uncached paths budget for DB. If your diagram has six network hops, call out which you would eliminate with edge cache.',
    },
    { type: 'h2', text: 'What to say in the last five minutes' },
    {
      type: 'p',
      text: 'Summarise: "Stateless app tier behind L7 LB, auto-scale on CPU or RPS, shared Redis and DB for state, read replicas for read-heavy paths, consistent hashing if we shard caches. WebSockets need a connection registry instead of blind round-robin." That covers 90% of scale follow-ups.',
    },
    { type: 'h2', text: 'Mock interview checklist' },
    {
      type: 'ol',
      items: [
        'Distinguished vertical vs horizontal scaling with a real trigger (CPU, connections).',
        'Named L7 for HTTP and explained when L4 matters.',
        'Described stateless tier and where state lives (Redis, DB).',
        'Mentioned health checks (liveness vs readiness).',
        'Explained what happens when scaling app servers does not fix DB saturation.',
        'Referenced a case study: [URL shortener](/system-design/design-url-shortener), [feed](/system-design/design-news-feed), or [rate limiter](/system-design/design-rate-limiter).',
      ],
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'Say L7 LB for HTTP APIs, stateless app tier, shared Redis/DB for state, auto-scale on CPU or RPS, and consistent hashing when you shard. That one paragraph satisfies most "how do you scale this?" follow-ups.',
    },
  ],
}

export default article
