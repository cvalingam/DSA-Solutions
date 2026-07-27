import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-rate-limiter',
  title: 'Design a Distributed Rate Limiter',
  description:
    'How to design an API rate limiter for interviews: token bucket vs sliding window, where to enforce limits, Redis Lua scripts, and handling multi-server deployments without race conditions.',
  readMinutes: 15,
  published: '2026-06-06',
  category: 'case-study',
  sections: [
    {
      type: 'p',
      text: 'Every production API eventually needs rate limiting. Without it, one misconfigured client - or one angry bot - can take down your database. In interviews, "design a rate limiter" tests whether you understand distributed state, time windows, and the difference between a correct algorithm on paper and one that works under concurrent requests.',
    },
    {
      type: 'p',
      text: 'We will design a service that enforces rules like "100 requests per minute per API key" and returns HTTP 429 Too Many Requests when exceeded. This applies to public REST APIs, login endpoints, and internal microservice protection. It pairs naturally with the [URL shortener](/system-design/design-url-shortener) design, where you rate-limit link creation, and relies on Redis - the same store used in our [caching](/system-design/caching-fundamentals-for-interviews) article.',
    },
    { type: 'h2', text: 'Requirements' },
    {
      type: 'ul',
      items: [
        'Limit requests per client identity (API key, user ID, or IP address).',
        'Configurable limits: e.g. 100 req/min, 10,000 req/day per tier.',
        'Low overhead - should not add more than a few milliseconds per request.',
        'Accurate enough across multiple API servers (distributed deployment).',
        'Return clear headers: X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After.',
      ],
    },
    {
      type: 'callout',
      title: 'Clarify with the interviewer',
      text: 'Is strict accuracy required (never exceed limit by even 1 request), or is approximate limiting acceptable? Strict limits cost more in coordination. Many products accept slight burst overage.',
    },
    { type: 'h2', text: 'Where to enforce the limit' },
    {
      type: 'p',
      text: 'Three common placements:',
    },
    {
      type: 'ul',
      items: [
        'API gateway / load balancer - centralised, protects all backends, best for uniform policies.',
        'Sidecar or middleware in each service - flexible per-route rules.',
        'Dedicated rate-limiter microservice - called synchronously before business logic.',
      ],
    },
    {
      type: 'p',
      text: 'For the interview, propose gateway-level enforcement for external traffic, with Redis as shared state. Mention that internal service-to-service calls might use lighter limits or mTLS identity instead of IP.',
    },
    { type: 'h2', text: 'Algorithms compared' },
    {
      type: 'table',
      headers: ['Algorithm', 'Idea', 'Pros', 'Cons'],
      rows: [
        ['Fixed window', 'Count requests per clock minute', 'Simple', 'Burst at window boundaries (200 at 0:59 and 0:00)'],
        ['Sliding window log', 'Store timestamp of each request', 'Accurate', 'Memory heavy at high QPS'],
        ['Sliding window counter', 'Blend current + previous window', 'Good balance', 'Slightly approximate'],
        ['Token bucket', 'Tokens refill at steady rate; each request costs 1', 'Allows controlled bursts', 'Needs atomic updates in distributed setup'],
        ['Leaky bucket', 'Queue drains at fixed rate', 'Smooth output rate', 'Less common for HTTP APIs'],
      ],
    },
    {
      type: 'p',
      text: 'Token bucket is the most interview-friendly default. It matches how developers think about "you have 100 tokens, they refill every minute, bursts are OK up to bucket size."',
    },
    { type: 'h2', text: 'Token bucket in plain English' },
    {
      type: 'p',
      text: 'Each client has a bucket with capacity C (max burst) and refill rate R tokens per second. On each request: if tokens ≥ 1, decrement and allow; else reject with 429. Example: 100 requests/minute ≈ refill 1.67 tokens/sec, capacity 100. A idle client can burst 100 immediately, then steady state at 100/minute.',
    },
    { type: 'h2', text: 'Distributed implementation with Redis' },
    {
      type: 'p',
      text: 'Multiple API servers must share counters. In-memory limits per server are wrong - a client could send 100 requests to each of ten servers. Redis (or similar) holds per-client state.',
    },
    {
      type: 'ol',
      items: [
        'Key: rate_limit:{clientId}:{ruleId}',
        'Store: last_refill_timestamp, current_tokens',
        'On request: run atomically via Lua script or Redis transaction',
        'Compute elapsed time since last refill, add tokens (capped at capacity), try to consume 1',
        'Return allow/deny to API gateway',
      ],
    },
    {
      type: 'callout',
      title: 'Why Lua?',
      text: 'Read-modify-write across network without atomicity races. Two simultaneous requests might both see 1 token left and both pass. A Lua script executes atomically on the Redis server - the same reason you would not implement a distributed lock with naive GET/SET.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'p',
      text: 'Draw the request path left to right. Every box should have one job. In an interview, narrate the flow before adding detail - interviewers follow you more easily than when you jump straight to Redis key names.',
    },
    {
      type: 'ol',
      items: [
        'Client sends HTTPS request with API key (header or query param).',
        'API Gateway terminates TLS, authenticates the key, and extracts clientId.',
        'Gateway calls the rate limiter (inline middleware or sidecar) before routing to backend.',
        'Rate limiter runs atomic Lua against Redis: allow → forward; deny → 429 with headers.',
        'Backend processes the business request only if the gateway forwards it.',
        'Optional: async publish denial events to Kafka for abuse dashboards.',
      ],
    },
    { type: 'h3', text: 'Components and responsibilities' },
    {
      type: 'table',
      headers: ['Component', 'Role', 'Why separate it'],
      rows: [
        ['API Gateway', 'Auth, TLS, routing, rate-limit hook', 'Single choke point for all public traffic'],
        ['Rate limiter service', 'Token bucket logic, header injection', 'Keeps policy out of every microservice'],
        ['Redis cluster', 'Shared counters per clientId + ruleId', 'Atomic updates across N app servers'],
        ['Backend services', 'Business logic only', 'Never trust clients to self-limit'],
        ['Analytics queue', 'Log 429s and near-limit clients', 'Ops and fraud teams need visibility'],
      ],
    },
    {
      type: 'p',
      text: 'Latency budget: Redis round-trip is ~1-3ms in-region. Lua script adds sub-millisecond CPU on the Redis node. Total added p99 should stay under 5ms - acceptable on a 200ms API. If Redis is remote or cross-region, consider local caching of "definitely blocked" clients with short TTL (advanced).',
    },
    {
      type: 'callout',
      title: 'Hot keys (mention if senior loop)',
      text: 'One viral API key creates a Redis hot key - single shard overloaded. Mitigations: local token bucket per gateway node with periodic sync to Redis; dedicate a replica for read-heavy hot keys; or rate-limit at the API gateway before Redis. Do not shard one client\'s counter by request ID - that bypasses the limit entirely.',
    },
    { type: 'h2', text: 'Response contract' },
    {
      type: 'p',
      text: 'Clients need predictable signals to back off and retry. Returning bare 429 without headers forces exponential guesswork. Stripe, GitHub, and Twitter all document standard headers - use the same names in your interview answer.',
    },
    {
      type: 'table',
      headers: ['Header', 'When sent', 'Meaning'],
      rows: [
        ['X-RateLimit-Limit', 'Every response', 'Max requests allowed in the current window (e.g. 100)'],
        ['X-RateLimit-Remaining', 'Every response', 'Requests left before limit (e.g. 42)'],
        ['X-RateLimit-Reset', 'Every response', 'Unix epoch when the bucket/window resets'],
        ['Retry-After', '429 only', 'Seconds until the client should retry'],
      ],
    },
    { type: 'h3', text: 'Example: allowed request' },
    {
      type: 'p',
      text: 'HTTP/1.1 200 OK - X-RateLimit-Limit: 100 - X-RateLimit-Remaining: 42 - X-RateLimit-Reset: 1717693200 - body: { "data": "..." }. Remaining decrements on every call, even on 200, so clients can throttle themselves proactively.',
    },
    { type: 'h3', text: 'Example: rate limited request' },
    {
      type: 'p',
      text: 'HTTP/1.1 429 Too Many Requests - Retry-After: 30 - X-RateLimit-Limit: 100 - X-RateLimit-Remaining: 0 - X-RateLimit-Reset: 1717693200 - body: { "error": "rate_limit_exceeded", "message": "Try again in 30 seconds" }. Well-behaved SDKs sleep for Retry-After before retrying; poorly behaved bots get blocked longer at the WAF layer.',
    },
    {
      type: 'p',
      text: 'In ASP.NET Core, set headers in middleware via context.Response.Headers before calling next() or short-circuiting with 429. Attach headers on success too - not only on failure - so monitoring tools can graph consumption per API key.',
    },
    { type: 'h2', text: 'Edge cases to mention' },
    {
      type: 'ul',
      items: [
        'Clock skew between servers - use Redis server time in Lua, not app server clocks.',
        'Redis outage: fail open (allow traffic) vs fail closed (reject). Payment APIs fail closed; read-only blogs often fail open.',
        'Different limits per endpoint - login might be 5/min, search 1000/min.',
        'Whitelists for internal services and health checks.',
      ],
    },
    { type: 'h2', text: 'Sliding window counter (alternative worth knowing)' },
    {
      type: 'p',
      text: 'Some teams prefer sliding window counter over token bucket: weight the previous minute and current minute by elapsed fraction. Example at 0:30 into the minute: count = 0.5 × (previous minute requests) + (current minute requests). Simpler Redis implementation with INCR and two keys, slightly approximate but very fast. Mention it if the interviewer asks for alternatives to token bucket.',
    },
    { type: 'h2', text: 'Real-world API examples' },
    {
      type: 'p',
      text: 'Stripe returns rate limit headers on every response and uses 429 with Retry-After. GitHub documents primary and secondary limits per endpoint. Twitter API tiers map to different token buckets. Showing you have seen these in production APIs - even as a consumer - signals polish. In a .NET API, implement middleware that calls Redis before the controller and attaches headers in OnStarting.',
    },
    { type: 'h2', text: 'Hierarchical limits' },
    {
      type: 'ul',
      items: [
        'Global limit - protect the whole platform (e.g. 50k req/sec total).',
        'Per-tenant limit - API key or subscription tier (100/min free, 10k/min pro).',
        'Per-endpoint limit - stricter on POST /login than GET /search.',
        'Per-IP limit - catch abuse when API keys are stolen or absent.',
      ],
    },
    {
      type: 'p',
      text: 'Check limits in order from cheapest to most expensive. Reject early on IP before hitting database-backed tenant lookup. Senior candidates discuss cost: every Redis round-trip adds latency - batch or pipeline when checking multiple rules.',
    },
    { type: 'h2', text: 'Connection to LeetCode' },
    {
      type: 'p',
      text: 'This is sliding window and hash map thinking at infrastructure scale. If you have solved problems involving time-based expiry (LRU cache, hit counter), you already understand the core challenge: evicting stale state efficiently. The rate limiter is an LRU with a refill policy instead of capacity eviction. Read [From LeetCode Patterns to Real Systems](/system-design/from-leetcode-patterns-to-real-systems) for the full mapping.',
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'Propose token bucket in Redis with atomic Lua scripts, enforce at the gateway, return standard headers, and discuss fail-open vs fail-closed. That answer is complete for most mid-level loops. Senior candidates can add hierarchical limits (per user AND per IP) and adaptive throttling under load.',
    },
    { type: 'h2', text: 'Fixed vs sliding window - when to mention each' },
    {
      type: 'p',
      text: 'Fixed window is easiest to explain: reset counter every minute. Its flaw is boundary bursting. Sliding window log is accurate but memory-heavy. Token bucket is the sweet spot for APIs that allow controlled bursts - mobile clients batch requests on reconnect, for example. If the interviewer is a stickler for exact counts, propose sliding window counter; if they want simplicity, token bucket wins.',
    },
    {
      type: 'p',
      text: 'Interviewer: "Two requests arrive at the same millisecond with one token left." You: "That is why I use a Lua script in Redis - read, compute refill, decrement, and write happen atomically on the server. Without that, both app servers could pass." Interviewer: "Redis is down." You: "For a public blog API I fail open so the site stays up; for payments I fail closed. It depends on the product." Short answers with trade-offs beat long monologues.',
    },
    { type: 'h2', text: 'Where this appears in other designs' },
    {
      type: 'ul',
      items: [
        '[URL shortener](/system-design/design-url-shortener) - limit POST /urls per IP to stop spam links.',
        'Login endpoint - 5 attempts per minute per account against credential stuffing.',
        'Third-party API integration - respect provider limits with client-side token bucket.',
        'Internal microservices - prevent one noisy neighbour from exhausting shared DB connections.',
      ],
    },
  ],
}

export default article
