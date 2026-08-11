import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-config-service',
  title: 'Design a Configuration Service',
  description:
    'How to design a config service for interviews: versioned keyspaces, environments, push vs poll, validation, rollbacks, caching at the edge, and audit trails.',
  readMinutes: 12,
  published: '2026-08-11',
  category: 'case-study',
  seoKeywords: [
    'configuration service system design',
    'config service interview',
    'dynamic config system design',
    'distributed configuration design',
  ],
  sections: [
    {
      type: 'p',
      text: 'A config service centralizes runtime knobs - timeouts, pool sizes, endpoint URLs - so you change behaviour without a full release. It sits beside [feature flags](/system-design/design-feature-flag-system) (flags are typed product switches; config is broader ops data) and [service discovery](/system-design/design-service-discovery) (who to call vs how to call).',
    },
    {
      type: 'p',
      text: 'Use the [framework](/system-design/how-to-approach-system-design-interviews): multi-env namespaces, CRUD with validation, fan-out to millions of clients, rollback, and audit.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Hierarchical keys: app / env / region / key.',
        'Get(key), Watch(key or prefix), bulk snapshot.',
        'Publish with schema validation and canary percentage.',
        'Rollback to a prior version; soft delete with history.',
        'ACLs: who can edit prod vs staging.',
      ],
    },
    { type: 'h2', text: 'Non-functional requirements' },
    {
      type: 'ul',
      items: [
        'Read path extremely available - apps should survive control-plane blips on last-known config.',
        'Propagation in seconds for urgent changes (kill timeouts).',
        'Strong audit for prod edits.',
        'Low fan-out cost: do not make every pod hit the DB on every refresh.',
      ],
    },
    {
      type: 'callout',
      title: 'Stale config beats no config',
      text: 'SDKs must keep a local snapshot on disk or memory. If the service is down, keep running with the last good version and alert. Same soft-fail idea as discovery.',
    },
    { type: 'h2', text: 'Architecture' },
    {
      type: 'ol',
      items: [
        'Control plane API + UI writes versioned documents to a primary store.',
        'Publisher pushes immutable snapshots to object storage / CDN and notifies listeners.',
        'Client SDKs poll or stream; apply updates atomically when version increases.',
        'Optional per-datacenter relays to absorb thundering herds.',
      ],
    },
    {
      type: 'table',
      headers: ['Store', 'Role'],
      rows: [
        ['Config DB', 'Source of truth + history'],
        ['Snapshot store', 'Versioned JSON/YAML blobs ([S3](/system-design/design-object-storage-s3))'],
        ['Notify channel', 'Pub/sub or long-poll “version bumped”'],
        ['Client cache', 'In-memory + on-disk last good'],
      ],
    },
    { type: 'h2', text: 'Data model' },
    {
      type: 'p',
      text: 'Store (namespace, key) → {value, version, updated_by, checksum, schema_id}. Overrides cascade: global < env < region < host. Resolve by merging layers on read or pre-materializing resolved snapshots per audience.',
    },
    { type: 'h2', text: 'Safety rails' },
    {
      type: 'ul',
      items: [
        'JSON Schema / type checks before publish.',
        'Canary: 1% of pods get vN+1; auto-rollback on error spike ([metrics](/system-design/design-metrics-monitoring-system)).',
        'Rate-limit destructive edits; require dual approval for prod.',
        'Never put secrets here - point to a [secrets manager](/system-design/design-secrets-manager) reference instead.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'Ops raises http.client.timeout_ms from 2000 to 5000 in prod.',
        'Publish creates version 88; relays push “namespace checkout@88”.',
        'Pods fetch snapshot, swap atomically; p99 timeouts drop.',
        'Error budget burn → one-click rollback to 87.',
      ],
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'Versioned snapshots, push/poll fan-out, last-known-good clients, and validation/canary/rollback. Draw a hard line vs secrets and vs feature flags. That covers config service.',
    },
  ],
}

export default article
