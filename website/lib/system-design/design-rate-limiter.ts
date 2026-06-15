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
      text: 'Every production API eventually needs rate limiting. Without it, one misconfigured client — or one angry bot — can take down your database. In interviews, "design a rate limiter" tests whether you understand distributed state, time windows, and the difference between a correct algorithm on paper and one that works under concurrent requests.',
    },
    {
      type: 'p',
      text: 'We will design a service that enforces rules like "100 requests per minute per API key" and returns HTTP 429 Too Many Requests when exceeded. This applies to public REST APIs, login endpoints, and internal microservice protection.',
    },
    { type: 'h2', text: 'Requirements' },
    {
      type: 'ul',
      items: [
        'Limit requests per client identity (API key, user ID, or IP address).',
        'Configurable limits: e.g. 100 req/min, 10,000 req/day per tier.',
        'Low overhead — should not add more than a few milliseconds per request.',
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
        'API gateway / load balancer — centralised, protects all backends, best for uniform policies.',
        'Sidecar or middleware in each service — flexible per-route rules.',
        'Dedicated rate-limiter microservice — called synchronously before business logic.',
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
      text: 'Multiple API servers must share counters. In-memory limits per server are wrong — a client could send 100 requests to each of ten servers. Redis (or similar) holds per-client state.',
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
      text: 'Read-modify-write across network without atomicity races. Two simultaneous requests might both see 1 token left and both pass. A Lua script executes atomically on the Redis server — the same reason you would not implement a distributed lock with naive GET/SET.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'p',
      text: 'Client → API Gateway → Rate Limiter check (Redis) → if allowed, forward to backend; else 429. Optionally log denials to analytics for abuse detection. Hot keys (one viral API key) can shard Redis keys: rate_limit:{clientId}:{ruleId}:{shard} where shard = hash(requestId) % N, then sum allowances — advanced topic, mention if pressed.',
    },
    { type: 'h2', text: 'Response contract' },
    {
      type: 'p',
      text: 'On success: HTTP 200 with X-RateLimit-Limit: 100, X-RateLimit-Remaining: 42, X-RateLimit-Reset: 1717693200 (Unix epoch when bucket refills). On failure: HTTP 429, Retry-After: 30 (seconds). This matches Stripe and GitHub API conventions — interviewers notice when you know real-world polish.',
    },
    { type: 'h2', text: 'Edge cases to mention' },
    {
      type: 'ul',
      items: [
        'Clock skew between servers — use Redis server time in Lua, not app server clocks.',
        'Redis outage: fail open (allow traffic) vs fail closed (reject). Payment APIs fail closed; read-only blogs often fail open.',
        'Different limits per endpoint — login might be 5/min, search 1000/min.',
        'Whitelists for internal services and health checks.',
      ],
    },
    { type: 'h2', text: 'Connection to LeetCode' },
    {
      type: 'p',
      text: 'This is sliding window and hash map thinking at infrastructure scale. If you have solved problems involving time-based expiry (LRU cache, hit counter), you already understand the core challenge: evicting stale state efficiently. The rate limiter is an LRU with a refill policy instead of capacity eviction.',
    },
    { type: 'h2', text: 'Closing summary' },
    {
      type: 'p',
      text: 'Propose token bucket in Redis with atomic Lua scripts, enforce at the gateway, return standard headers, and discuss fail-open vs fail-closed. That answer is complete for most mid-level loops. Senior candidates can add hierarchical limits (per user AND per IP) and adaptive throttling under load.',
    },
  ],
}

export default article
