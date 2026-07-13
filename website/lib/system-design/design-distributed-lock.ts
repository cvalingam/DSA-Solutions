import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-distributed-lock',
  title: 'Design a Distributed Lock Service',
  description:
    'How to design a distributed lock for interviews: lease-based locks, Redis vs ZooKeeper vs etcd, fencing tokens, deadlock avoidance, and split-brain risks.',
  readMinutes: 12,
  published: '2026-07-17',
  category: 'fundamentals',
  seoKeywords: [
    'distributed lock system design',
    'Redis distributed lock interview',
    'ZooKeeper lock design',
    'fencing token distributed lock',
  ],
  sections: [
    {
      type: 'p',
      text: 'A distributed lock makes sure only one worker among many touches a critical section — leader election, unique cron runs, inventory decrement. It shows up inside [job schedulers](/system-design/design-distributed-job-scheduler), [ticket booking](/system-design/design-ticket-booking-system), and primary failover. The interview is less about APIs and more about failure: clocks, GC pauses, and believing you hold a lock you already lost.',
    },
    {
      type: 'p',
      text: 'Use the [framework](/system-design/how-to-approach-system-design-interviews): mutual exclusion only, or also fairness? Blocking acquire vs try-lock? How long may a holder die before others proceed?',
    },
    { type: 'h2', text: 'Requirements' },
    {
      type: 'ul',
      items: [
        'acquire(lock_name, holder_id, ttl) → success/fail.',
        'release(lock_name, holder_id) — only the owner can unlock.',
        'Automatic expiry if the holder crashes (lease).',
        'Optional: fencing token so stale holders cannot commit.',
        'Optional: reentrant locks for the same holder.',
      ],
    },
    {
      type: 'callout',
      title: 'Safety over liveness',
      text: 'It is better for the system to pause than for two nodes to both think they are primary. Prefer CP-ish lock services when correctness matters ([CAP](/system-design/cap-theorem-consistency-models)).',
    },
    { type: 'h2', text: 'Lease-based locking' },
    {
      type: 'p',
      text: 'Always use TTLs. Without expiry, a dead holder blocks the world forever. With TTL, a long GC pause can expire your lock while you still run — that is the classic bug. Mitigations: keep critical sections short, renew (heartbeat) while working, and use fencing tokens on the resource side.',
    },
    { type: 'h2', text: 'Redis approach (Redlock debate)' },
    {
      type: 'ol',
      items: [
        'SET lock:name holder_id NX PX ttl_ms — atomic acquire.',
        'Do work; optionally extend with a Lua compare-and-PEXPIRE if value matches.',
        'DEL only if value still equals holder_id (Lua) — never delete blindly.',
      ],
    },
    {
      type: 'p',
      text: 'Single-instance Redis is simple and fine for many product locks. Multi-Redis Redlock tries to get a majority of N nodes; Martin Kleppmann famously criticized it under clock/GC assumptions. In interviews: describe single-Redis + fencing, then say “for strong leadership use ZooKeeper/etcd.” That nuance scores well. Tie Redis ops to [distributed cache](/system-design/design-distributed-cache-redis) familiarity.',
    },
    { type: 'h2', text: 'ZooKeeper / etcd approach' },
    {
      type: 'p',
      text: 'Create an ephemeral sequential node under `/locks/foo/`. The client with the lowest sequence holds the lock; others watch the predecessor. Session expiry deletes ephemeral nodes → lock releases. Consensus gives a clearer safety story than Redis for leader election. Cost: operational heft and higher latency.',
    },
    {
      type: 'table',
      headers: ['Backend', 'Best for', 'Watch-outs'],
      rows: [
        ['Redis NX PX', 'Short critical sections, high QPS', 'Clock/GC; need fencing'],
        ['ZooKeeper', 'Leader election, config', 'Ops complexity'],
        ['etcd / Consul', 'K8s-style leases', 'Same consensus costs'],
        ['DB row lock', 'Low QPS, transactional work', 'Does not scale hot keys'],
      ],
    },
    { type: 'h2', text: 'Fencing tokens' },
    {
      type: 'p',
      text: 'Every successful acquire increments a monotonic token. Storage writes must include the token; the DB rejects older tokens. Even if a zombie still “holds” an expired lock, its writes fail. This is the strongest practical answer to the GC-pause problem — mention it for [payment](/system-design/design-payment-system) or inventory mutations.',
    },
    { type: 'h2', text: 'API sketch' },
    {
      type: 'table',
      headers: ['RPC', 'Semantics'],
      rows: [
        ['TryAcquire(name, owner, ttl)', 'Non-blocking; returns token or conflict'],
        ['Acquire(name, owner, ttl, wait)', 'Block with backoff/watch until timeout'],
        ['Renew(name, owner, token, ttl)', 'Extend lease if still owner'],
        ['Release(name, owner, token)', 'Drop lock if token matches'],
      ],
    },
    { type: 'h2', text: 'Deadlocks and convoys' },
    {
      type: 'ul',
      items: [
        'Always acquire multiple locks in a global name order.',
        'Prefer try-lock + retry with jitter over infinite blocking.',
        'Keep TTLs >> expected critical section, but renew periodically.',
        'Avoid giant coarse locks — lock the smallest resource key (order_id, not “orders”).',
      ],
    },
    { type: 'h2', text: 'Architecture' },
    {
      type: 'p',
      text: 'A lock service can be a thin API over Redis/etcd used by workers, or embedded client libraries talking to the store directly. Put auth and quotas at an [API gateway](/system-design/design-api-gateway) if it is a shared company platform. Metrics: acquire latency, contention rate, expired-while-holding incidents.',
    },
    { type: 'h2', text: 'When not to use a lock' },
    {
      type: 'p',
      text: 'Prefer idempotent writes, compare-and-swap on a version column, or single-partition Kafka consumers when you only need ordering. Locks are coordination — expensive and easy to get wrong. Reach for them when two writers truly cannot interleave, such as “only one primary regenerates this report.”',
    },
    {
      type: 'ul',
      items: [
        'Leader election for a singleton worker pool.',
        'Preventing double-send of a unique email blast.',
        'Serializing schema migrations across app nodes.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'Billing worker A acquires lock:invoice:42 with TTL 30s, token 105.',
        'A heartbeats renew every 10s while generating the PDF.',
        'A crashes; TTL expires; worker B acquires token 106.',
        'Zombie A wakes and tries to upload — storage rejects token 105.',
      ],
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'State mutual exclusion + lease + owner-checked release. Compare Redis vs ZooKeeper honestly. End on fencing tokens. That trio is the distributed lock interview.',
    },
  ],
}

export default article
