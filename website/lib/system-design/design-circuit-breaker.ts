import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-circuit-breaker',
  title: 'Design a Circuit Breaker',
  description:
    'How to design circuit breakers for interviews: closed/open/half-open states, failure thresholds, bulkheads, timeouts, fallbacks, and where they sit vs retries and rate limits.',
  readMinutes: 12,
  published: '2026-08-11',
  category: 'fundamentals',
  seoKeywords: [
    'circuit breaker system design',
    'circuit breaker interview',
    'Hystrix Resiliency design',
    'half open circuit breaker',
  ],
  sections: [
    {
      type: 'p',
      text: 'A circuit breaker stops calling a sick dependency so your service fails fast instead of waiting on timeouts until its own thread pool dies. It pairs with [retries](/system-design/message-queues-async-processing), [rate limiters](/system-design/design-rate-limiter), and [API gateways](/system-design/design-api-gateway). Interviewers want the state machine and the tuning knobs, not a library name drop.',
    },
    {
      type: 'p',
      text: 'Scope with the [framework](/system-design/how-to-approach-system-design-interviews): per-dependency breaker, error rate window, open duration, half-open probes, and a fallback path.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Wrap outbound calls: allow, short-circuit, or probe.',
        'Track successes/failures in a rolling window or bucketed counters.',
        'Open the circuit when failure rate or consecutive failures cross a threshold.',
        'After a cool-down, enter half-open and allow limited trial calls.',
        'Expose metrics and a manual force-open / force-close switch.',
      ],
    },
    { type: 'h2', text: 'Non-functional requirements' },
    {
      type: 'ul',
      items: [
        'Decision latency near zero (in-process check).',
        'Isolation: one dependency failure must not cascade.',
        'Tunable under incident without redeploy when possible ([feature flags](/system-design/design-feature-flag-system)).',
        'Correctness under concurrency - concurrent probes in half-open must be capped.',
      ],
    },
    {
      type: 'callout',
      title: 'Fail fast is the feature',
      text: 'An open circuit returns an error (or fallback) immediately. That looks worse in a dashboard than a 30s hang - until you realize hangs exhaust every worker. Sell the trade-off out loud.',
    },
    { type: 'h2', text: 'State machine' },
    {
      type: 'table',
      headers: ['State', 'Behaviour'],
      rows: [
        ['Closed', 'Calls flow; failures counted'],
        ['Open', 'Calls rejected / fallback; timer running'],
        ['Half-open', 'Small number of trial calls; success closes, failure reopens'],
      ],
    },
    {
      type: 'ol',
      items: [
        'Closed → Open when failures/time-window exceed threshold (and volume is large enough to avoid flapping).',
        'Open → Half-open when cool-down elapses.',
        'Half-open → Closed after N successes; → Open on first (or threshold) failure.',
      ],
    },
    { type: 'h2', text: 'Where it lives' },
    {
      type: 'ul',
      items: [
        'Client library next to the HTTP/gRPC stub (most common).',
        'Sidecar / mesh (Envoy outlier detection) for polyglot fleets.',
        'Gateway for coarse protection of upstreams.',
      ],
    },
    {
      type: 'p',
      text: 'Count timeouts and 5xx as failures; do not count most 4xx. Combine with bounded timeouts - a breaker without a timeout still threads-block. Bulkheads (separate pools) keep payment calls from starving search.',
    },
    { type: 'h2', text: 'Fallbacks' },
    {
      type: 'ul',
      items: [
        'Cached last-good response ([caching](/system-design/caching-fundamentals-for-interviews)).',
        'Default / degraded mode (recommendations empty list).',
        'Queue for later ([webhooks](/system-design/design-webhook-delivery-system) style) when sync is not required.',
        'Never invent money movement in a fallback.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'Checkout calls inventory; error rate hits 50% over 20 requests → Open.',
        'For 30s, checkout serves “inventory unavailable” quickly.',
        'Half-open allows 2 probes; both succeed → Closed; traffic resumes.',
      ],
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'Draw closed/open/half-open. Name thresholds, cool-downs, and timeouts. Separate breakers per dependency and mention bulkheads. That is the circuit breaker interview.',
    },
  ],
}

export default article
