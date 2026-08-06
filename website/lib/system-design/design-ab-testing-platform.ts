import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-ab-testing-platform',
  title: 'Design an A/B Testing Platform',
  description:
    'How to design A/B testing for interviews: experiment assignment, sticky bucketing, metrics pipelines, sequential testing pitfalls, exposure logging, and SRM checks.',
  readMinutes: 13,
  published: '2026-08-06',
  category: 'case-study',
  seoKeywords: [
    'A/B testing system design',
    'experimentation platform interview',
    'A/B test assignment design',
    'experiment metrics pipeline',
  ],
  sections: [
    {
      type: 'p',
      text: 'An A/B platform assigns users to variants, logs exposures, and decides whether a change moved metrics. It sits next to [feature flags](/system-design/design-feature-flag-system) (delivery) and a [metrics](/system-design/design-metrics-monitoring-system) / [analytics](/system-design/design-ad-click-aggregator) pipeline (measurement). Interviewers want correct sticky assignment and honest stats, not a shiny UI.',
    },
    {
      type: 'p',
      text: 'Use the [framework](/system-design/how-to-approach-system-design-interviews). Clarify unit of randomization (user, session, device), primary metric, and whether you need multivariate or simple A/B.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Create experiment: variants, traffic %, targeting, primary + guardrail metrics.',
        'Assign(unit_id, experiment) → variant (sticky for the experiment lifetime).',
        'Log exposure when the variant actually affects UX.',
        'Ingest outcome events (purchase, click, latency).',
        'Compute lifts with confidence intervals; detect Sample Ratio Mismatch (SRM).',
      ],
    },
    { type: 'h2', text: 'Non-functional requirements' },
    {
      type: 'ul',
      items: [
        'Assignment must be fast and available in the request path.',
        'Exposure and outcome pipelines handle high event rates with at-least-once delivery.',
        'Analysis jobs finish on a familiar cadence (hourly / daily).',
        'Deterministic assignment: rebuilding from config reproduces the same buckets.',
      ],
    },
    {
      type: 'callout',
      title: 'Assign early, expose honestly',
      text: 'Only units that truly saw the experience count as exposed. Assigning everyone in a country but logging exposure only for page viewers avoids “I diluted my effect” mistakes. Call that out - it scores well.',
    },
    { type: 'h2', text: 'Architecture' },
    {
      type: 'ol',
      items: [
        'Experiment config service (often the same control plane as flags).',
        'Assignment library in app / [API gateway](/system-design/design-api-gateway) edge.',
        'Exposure + outcome events → [Kafka](/system-design/message-queues-async-processing).',
        'Stream or batch join on unit_id into an experiment warehouse.',
        'Stats workers compute metrics; UI shows results and SRM warnings.',
      ],
    },
    { type: 'h2', text: 'Sticky bucketing' },
    {
      type: 'p',
      text: 'hash(experiment_salt + unit_id) mod 10000 maps into traffic bands. Salt is fixed per experiment so assignment never flips mid-flight. Layer experiments carefully: orthogonal salts avoid correlation; mutually exclusive layers share a traffic pool. Same hashing mindset as [unique IDs](/system-design/design-unique-id-generator) - deterministic bits matter.',
    },
    {
      type: 'table',
      headers: ['Concept', 'Why it matters'],
      rows: [
        ['Sticky assignment', 'Same user stays in A or B for the test'],
        ['Exposure log', 'Defines the analysis population'],
        ['SRM check', 'Flags broken randomization / logging bugs'],
        ['Guardrail metrics', 'Catch latency or error regressions'],
      ],
    },
    { type: 'h2', text: 'Metrics pipeline' },
    {
      type: 'ol',
      items: [
        'Normalize events to (experiment_id, unit_id, variant, event_type, value, ts).',
        'Deduplicate exposures by unit within the experiment window.',
        'Aggregate per variant: count, sum, sum_sq for mean and variance.',
        'Apply a pre-registered primary metric test; show CIs, not just p-values.',
      ],
    },
    {
      type: 'p',
      text: 'Peeking daily without correction inflates false positives - mention sequential testing or fixed horizons. You do not need to derive CUPED in a whiteboard round, but saying “variance reduction / covariates if asked” is enough.',
    },
    { type: 'h2', text: 'Failure modes' },
    {
      type: 'ul',
      items: [
        'Logging only successes → biased metrics.',
        'Client clock skew scrambling order - prefer server timestamps.',
        'Cross-talk when two experiments fight over the same UI surface.',
        'Holdouts forever: archive ended experiments and free salt space.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'Experiment pricing_v3: 50/50 on US users, primary = checkout conversion.',
        'User hashes into B; checkout service logs exposure once.',
        'Purchase events join to B; nightly job shows +1.2% lift, CI excludes 0.',
        'SRM passes (49.8/50.2). Ship via flag rollout to 100%.',
      ],
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'Sticky hash assignment, clean exposure logging, event pipeline into aggregates, and SRM/guardrails. Tie delivery to feature flags. That is a solid A/B platform answer.',
    },
  ],
}

export default article
