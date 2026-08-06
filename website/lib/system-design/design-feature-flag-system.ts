import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-feature-flag-system',
  title: 'Design a Feature Flag System',
  description:
    'How to design feature flags for interviews: boolean and percentage rollouts, targeting rules, SDK polling vs streaming, kill switches, audit logs, and consistency.',
  readMinutes: 12,
  published: '2026-08-06',
  category: 'case-study',
  seoKeywords: [
    'feature flag system design',
    'feature toggle interview',
    'LaunchDarkly system design',
    'percentage rollout design',
  ],
  sections: [
    {
      type: 'p',
      text: 'Feature flags let you ship dark code and turn behaviour on per user, cohort, or percentage without redeploying. Every serious product uses them for kill switches, canaries, and experiments. The interview is less “store a bool in Redis” and more “how do millions of clients evaluate flags fast, safely, and with an audit trail.”',
    },
    {
      type: 'p',
      text: 'Scope with the [framework](/system-design/how-to-approach-system-design-interviews): create/update flags, evaluate in SDKs, percentage and attribute targeting, change propagation under a few seconds, and emergency kill. Pair mentally with [A/B testing](/system-design/design-ab-testing-platform) and [config](/system-design/design-service-discovery) style control planes.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'CRUD flags: key, type (bool / string / number / JSON), default, targeting rules.',
        'Evaluate(flag_key, user_context) → variation.',
        'Percentage rollout sticky per user_id (same user always same bucket).',
        'Environments: dev / staging / prod with separate states.',
        'Audit log of who changed what; kill switch that forces off globally.',
      ],
    },
    { type: 'h2', text: 'Non-functional requirements' },
    {
      type: 'ul',
      items: [
        'SDK evaluation in microseconds locally after rules are cached.',
        'Rule changes reach most clients within seconds to low tens of seconds.',
        'High availability of evaluation even if the control plane is briefly down (stale cache).',
        'Strong auditability for compliance; no silent flag flips.',
      ],
    },
    {
      type: 'callout',
      title: 'Fail open or fail closed on purpose',
      text: 'Decide per flag: if the SDK cannot refresh, should the last known rules apply, or a hard default? Kill switches usually fail closed (off). Growth experiments often keep the last known assignment so UX does not flicker.',
    },
    { type: 'h2', text: 'Architecture' },
    {
      type: 'ol',
      items: [
        'Control plane API + UI writes flag definitions to a primary store.',
        'Publisher pushes snapshots or diffs to a CDN / edge config channel.',
        'Server SDKs poll or stream updates; embed an in-process evaluator.',
        'Optional relay in each datacenter for air-gapped or high-QPS apps.',
        'Analytics sink receives evaluation events for [dashboards](/system-design/design-metrics-monitoring-system).',
      ],
    },
    { type: 'h2', text: 'Data model' },
    {
      type: 'table',
      headers: ['Entity', 'Fields'],
      rows: [
        ['Flag', 'key, type, default, rules[], off_variation, version'],
        ['Rule', 'clauses (attr op value), percentage, serve variation'],
        ['Segment', 'named user sets reused across flags'],
        ['Audit', 'actor, before/after JSON, timestamp'],
      ],
    },
    {
      type: 'p',
      text: 'Version every flag document. SDKs apply updates only if version increases. Sticky percentages hash (flag_key + user_id) into 0..9999 and compare to the rollout band - same idea as consistent bucketing in experiments.',
    },
    { type: 'h2', text: 'Evaluation path' },
    {
      type: 'ol',
      items: [
        'Load cached flag for the environment.',
        'Walk rules in order; first match wins.',
        'On percentage rule, deterministic hash → bucket.',
        'If nothing matches, return default / off variation.',
        'Optionally emit an eval event asynchronously (sample if volume is huge).',
      ],
    },
    { type: 'h2', text: 'Propagation' },
    {
      type: 'p',
      text: 'Polling every 30s is simple and fine early on. Streaming (SSE/WebSocket) from a fan-out service cuts latency. Put immutable snapshots on a [CDN](/system-design/design-cdn-content-delivery-network) for mobile/browser SDKs with short TTLs. Server fleets often pull from an internal relay to avoid stampeding the control plane - related to [caching](/system-design/caching-fundamentals-for-interviews) stampedes.',
    },
    { type: 'h2', text: 'Safety' },
    {
      type: 'ul',
      items: [
        'Require dual control for prod kill switches on critical payments paths.',
        'Schema-validate targeting JSON before publish.',
        'Guardrails: max percentage step-ups per hour.',
        'Store secrets out of flag payloads; flags are config, not a vault.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'Flag new_checkout defaults off; rule: country=US AND hash% < 10% → on.',
        'Publish version 42; relays push to checkout pods in ~2s.',
        'User u123 in US hashes to 7% → sees new UI; u999 hashes to 55% → old UI.',
        'Error spike → kill switch forces off; pods refresh and serve default.',
      ],
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'Separate control plane from local evaluation. Sticky hashing for percentages. Versioned push/poll of rules with stale-cache survival. End on kill switches and audit. That is the feature flag interview.',
    },
  ],
}

export default article
