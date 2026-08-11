import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-secrets-manager',
  title: 'Design a Secrets Manager',
  description:
    'How to design a secrets manager for interviews: envelope encryption, rotation, least-privilege access, audit logs, dynamic DB credentials, and break-glass flows.',
  readMinutes: 13,
  published: '2026-08-11',
  category: 'case-study',
  seoKeywords: [
    'secrets manager system design',
    'secret management interview',
    'envelope encryption design',
    'credential rotation system design',
  ],
  sections: [
    {
      type: 'p',
      text: 'Secrets managers store API keys, DB passwords, and certificates so they are not baked into images or [config](/system-design/design-config-service) blobs. The interview mixes security and distributed systems: encryption, access control, rotation, and high availability for something every boot path depends on.',
    },
    {
      type: 'p',
      text: 'Clarify with the [framework](/system-design/how-to-approach-system-design-interviews): static secrets vs dynamic short-lived credentials, human vs machine identity, and regional residency.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'PutSecret / GetSecret / DeleteSecret with versioning.',
        'IAM policies: who (role/user) can read which path.',
        'Automatic rotation hooks for DB users and API tokens.',
        'Audit every access; optional break-glass with extra approval.',
        'SDK caching with TTL and refresh.',
      ],
    },
    { type: 'h2', text: 'Non-functional requirements' },
    {
      type: 'ul',
      items: [
        'Encrypt at rest and in transit; keys in an HSM / KMS.',
        'High availability - secret fetch in the critical path of deploys.',
        'Low latency for cached GETs; cold KMS unwrap is rarer.',
        'Tamper-evident audit store.',
      ],
    },
    {
      type: 'callout',
      title: 'Envelope encryption',
      text: 'Data keys encrypt the secret blob; a master key in KMS encrypts data keys. Rotation of the master rewraps data keys without rewriting every secret. Say this early - it is the expected crypto sketch.',
    },
    { type: 'h2', text: 'Architecture' },
    {
      type: 'ol',
      items: [
        'API fronted by [auth](/system-design/design-authentication-oauth) / IAM.',
        'Metadata DB: secret path, versions, ACL pointers, rotation state.',
        'Encrypted payload store (same DB or [object storage](/system-design/design-object-storage-s3)).',
        'KMS/HSM for master keys; workers for rotation lease.',
        'Clients identify as cloud roles or SPIFFE/mesh identities.',
      ],
    },
    { type: 'h2', text: 'Access path' },
    {
      type: 'ol',
      items: [
        'Client requests secret://prod/checkout/db with role ARN.',
        'Authorize against policy; deny by default.',
        'Load ciphertext + wrapped data key; unwrap via KMS.',
        'Decrypt payload in memory; return over TLS; scrub buffers.',
        'Write audit event (who, what, when, from where).',
      ],
    },
    { type: 'h2', text: 'Rotation' },
    {
      type: 'ul',
      items: [
        'Static: generate new value, dual-publish versions, app flips, revoke old.',
        'Dynamic DB: plugin creates a short-lived user; leases expire automatically.',
        'Use a [distributed lock](/system-design/design-distributed-lock) so only one rotator runs.',
        'Clients should re-resolve on auth failure to pick up new versions.',
      ],
    },
    {
      type: 'table',
      headers: ['Secret type', 'Rotation style'],
      rows: [
        ['Third-party API key', 'Scheduled overwrite + dual-run window'],
        ['Postgres password', 'Alternating users A/B'],
        ['TLS cert', 'Issue new, reload, retire'],
        ['Ephemeral cloud role', 'STS tokens - no long secret'],
      ],
    },
    { type: 'h2', text: 'Failure and abuse' },
    {
      type: 'ul',
      items: [
        'Rate-limit GetSecret; alert on fan-out exfiltration patterns.',
        'Break-glass role time-boxed and heavily audited.',
        'Replica lag: prefer CP for ACL changes ([CAP](/system-design/cap-theorem-consistency-models)).',
        'Never log secret values - redact in [logging](/system-design/design-distributed-logging-system).',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'Checkout pods fetch db creds at boot; cache 15 minutes.',
        'Nightly rotation creates user_v2, updates secret version 14.',
        'Pods refresh on next TTL or on auth error; user_v1 dropped after grace.',
      ],
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'Envelope encryption, IAM on paths, versioned get with SDK cache, and rotation with leases. End on audit and break-glass. That is secrets manager.',
    },
  ],
}

export default article
