import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-health-check-system',
  title: 'Design a Health Check / Status System',
  description:
    'How to design health checks for interviews: liveness vs readiness, dependency probes, status pages, aggregation, flapping control, and load balancer integration.',
  readMinutes: 11,
  published: '2026-08-11',
  category: 'fundamentals',
  seoKeywords: [
    'health check system design',
    'liveness readiness interview',
    'status page system design',
    'service health monitoring design',
  ],
  sections: [
    {
      type: 'p',
      text: 'Health checks tell orchestrators and humans whether an instance should receive traffic. Done wrong, you flap pods out of the pool during blips or keep serving while wedged. Tie this to [service discovery](/system-design/design-service-discovery), [load balancing](/system-design/load-balancing-and-scaling), and [metrics](/system-design/design-metrics-monitoring-system).',
    },
    {
      type: 'p',
      text: 'Scope with the [framework](/system-design/how-to-approach-system-design-interviews): process liveness, readiness including deps, public status page, and aggregation rules.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'GET /healthz (liveness) and GET /readyz (readiness).',
        'Optional deep checks: DB ping, queue depth, disk free.',
        'Central aggregator builds service-level status from instance reports.',
        'Public status page with component list and incident history.',
        'Admin override: force unhealthy for drain.',
      ],
    },
    { type: 'h2', text: 'Non-functional requirements' },
    {
      type: 'ul',
      items: [
        'Probe endpoints cheap and bounded (hard timeouts).',
        'Avoid thundering herds against shared DBs every second from every replica.',
        'Stable signals: hysteresis so one failure does not yank a node.',
        'Status page available even when the product is down (host separately).',
      ],
    },
    {
      type: 'callout',
      title: 'Liveness is not readiness',
      text: 'Liveness = “restart me if I am deadlocked.” Readiness = “do not send traffic yet / anymore.” Checking the DB inside liveness can restart every pod during a DB blip - a classic outage amplifier.',
    },
    { type: 'h2', text: 'Probe design' },
    {
      type: 'table',
      headers: ['Probe', 'Checks', 'On fail'],
      rows: [
        ['Liveness', 'Process up, event loop alive', 'Restart container'],
        ['Readiness', 'Warmup done, critical deps OK', 'Remove from LB'],
        ['Startup', 'Slow init finished', 'Hold probes until ready'],
      ],
    },
    {
      type: 'p',
      text: 'Deep dependency checks belong mostly on readiness, with caching (“DB OK for last 5s”) so 100 pods do not stampede. Prefer passive signals (error rate from the mesh) alongside active pings.',
    },
    { type: 'h2', text: 'Aggregation and status page' },
    {
      type: 'ol',
      items: [
        'Agents push heartbeat + check results to a central store.',
        'Rules: component red if >X% instances fail or a synthetic journey fails.',
        'Status page reads from a separately hosted store/CDN snapshot.',
        'Incidents: update manually or auto-open when burn rates spike.',
      ],
    },
    { type: 'h2', text: 'Flapping control' },
    {
      type: 'ul',
      items: [
        'Require N consecutive failures before marking down.',
        'Require M successes before marking up.',
        'Jitter probe intervals; align with LB health check settings.',
        'Circuit-break deep checks if the dependency status service itself is sick.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'API pods expose /healthz (noop) and /readyz (cached Redis ping).',
        'Redis blip: readiness fails after 3 probes; LB drains pods.',
        'Liveness stays green - no mass restart.',
        'Status page marks “API degraded” from aggregator rules; clears when ready ratio recovers.',
      ],
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'Separate liveness and readiness. Bound deep checks, add hysteresis, host the status page independently. That is health check system design.',
    },
  ],
}

export default article
