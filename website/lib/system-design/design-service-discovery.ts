import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-service-discovery',
  title: 'Design a Service Discovery System',
  description:
    'How to design service discovery for interviews: client-side vs server-side discovery, registries (Consul/etcd), health checks, DNS vs push watch, and consistency trade-offs.',
  readMinutes: 12,
  published: '2026-08-05',
  category: 'fundamentals',
  seoKeywords: [
    'service discovery system design',
    'Consul service discovery interview',
    'client side vs server side discovery',
    'service registry design',
  ],
  sections: [
    {
      type: 'p',
      text: 'Service discovery answers a boring but critical question: given name checkout-service, which healthy IPs and ports can I call right now? Without it, microservices drown in hardcoded hosts. It pairs with [load balancing](/system-design/load-balancing-and-scaling), [API gateways](/system-design/design-api-gateway), and [distributed locks](/system-design/design-distributed-lock) on the same etcd/Consul family of tools.',
    },
    {
      type: 'p',
      text: 'Clarify scope with the [framework](/system-design/how-to-approach-system-design-interviews): registration, health, query, and notifications when membership changes. Kubernetes kube-proxy/DNS is one answer - interviewers still want the general registry design.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Register(service, instance_id, host, port, metadata, TTL).',
        'Deregister or expire stale instances.',
        'Discover(service) → list of healthy instances.',
        'Watch(service) stream of membership changes (optional but strong).',
        'Health checks: active (registry probes) and/or passive (heartbeats).',
      ],
    },
    { type: 'h2', text: 'Non-functional requirements' },
    {
      type: 'ul',
      items: [
        'Discoveries are latency-sensitive (inline on every new connection path if uncached).',
        'Prefer availability of slightly stale lists over hard outages ([CAP](/system-design/cap-theorem-consistency-models) nuance).',
        'Survive registry node loss; avoid split-brain that points everyone at a black hole.',
        'Scale to tens of thousands of instances and high watch fan-out.',
      ],
    },
    {
      type: 'callout',
      title: 'Stale is better than unavailable',
      text: 'Clients should keep a last-known-good list if the registry blips. Routing to a dead instance plus retry is usually better than failing closed with “no backends.” Soft-fail discovery, hard-fail auth.',
    },
    { type: 'h2', text: 'Client-side vs server-side discovery' },
    {
      type: 'table',
      headers: ['Mode', 'How it works', 'Pros', 'Cons'],
      rows: [
        ['Client-side', 'App queries registry, picks instance (or uses library LB)', 'No extra hop; rich client policies', 'Every language needs a client'],
        ['Server-side', 'Client calls LB/DNS; LB queries registry', 'Simple clients', 'Extra hop; LB becomes critical'],
      ],
    },
    {
      type: 'p',
      text: 'Say both. Netflix Eureka popularized client-side; Kubernetes Service + kube-proxy looks more server-side from the app’s view. Many companies mix: thin DNS for coarse discovery, client libraries for advanced filters (zone aware, canary metadata).',
    },
    { type: 'h2', text: 'Registry design' },
    {
      type: 'ol',
      items: [
        'Consensus store (etcd / Consul / ZK) or a strongly repaired CP cluster holds service → instances.',
        'Instances heartbeat (lease). Missed renewals → mark critical → remove after grace.',
        'Read path: in-memory indexes on every registry server; watches notify subscribers.',
        'Optional DNS interface: synthesize A/SRV records from the same data ([DNS](/system-design/design-dns-system)).',
      ],
    },
    {
      type: 'p',
      text: 'Leases reuse the same mental model as [distributed locks](/system-design/design-distributed-lock): TTL + renew. Do not rely on clients to deregister on SIGKILL - expiry is mandatory. Passive health (remove after N failed RPCs) complements active checks.',
    },
    { type: 'h2', text: 'Health checking' },
    {
      type: 'ul',
      items: [
        'Heartbeat TTL: cheap, detects process death.',
        'Active HTTP/TCP probe from registry or sidecars: detects “process up, app wedged.”',
        'Grace periods on deploy so new instances warm before taking traffic.',
        'Status levels: passing / warning / critical - only passing enter default discover sets.',
      ],
    },
    { type: 'h2', text: 'Consistency and caching' },
    {
      type: 'p',
      text: 'Writes (register) should be acknowledged by a quorum so two clients do not see conflicting truths for long. Reads often from local follower caches with a few hundred ms lag - fine for discovery. Clients cache discover results for seconds and refresh via watch to cut registry QPS. Same invalidation ideas as [caching fundamentals](/system-design/caching-fundamentals-for-interviews).',
    },
    { type: 'h2', text: 'Integration points' },
    {
      type: 'ul',
      items: [
        'Sidecar / service mesh (Envoy, Linkerd) subscribe to discovery and own retries.',
        'API gateway resolves upstreams via discovery rather than static pools.',
        'Job workers discover partition leaders or broker lists dynamically.',
        'Multi-zone: prefer same-zone instances, fall back cross-zone with cost awareness.',
      ],
    },
    { type: 'h2', text: 'Failure modes to name' },
    {
      type: 'ul',
      items: [
        'Thundering herd: every instance re-registers after registry blip - jitter renewals.',
        'Split brain network: clients in partition A see different membership than B.',
        'Zombie instance: heartbeat continues but app is wrong - need deeper health checks.',
        'Delete storm on mass expire - rate-limit cascading deploys.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'checkout-v2 pods start; each registers with zone=use1-az1 and TTL 15s.',
        'API gateway watches checkout; receives endpoints; routes with least-requests.',
        'One pod dies; lease expires in ~15s; watch pushes removal; LB stops selecting it.',
        'During registry maintenance, gateway keeps last-known list and retries remaining pods.',
      ],
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'Contrast client-side vs server-side. Put leases and health at the centre. Add watches or DNS, talk stale-cache soft failure, and mention mesh/gateway integration. That covers service discovery cleanly.',
    },
  ],
}

export default article
