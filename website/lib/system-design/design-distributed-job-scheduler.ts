import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-distributed-job-scheduler',
  title: 'Design a Distributed Job Scheduler (Cron at Scale)',
  description:
    'How to design a distributed job scheduler for interviews: cron expressions, durable job store, worker fleets, at-least-once execution with idempotent handlers, retries, and avoiding thundering herds.',
  readMinutes: 13,
  published: '2026-07-10',
  category: 'case-study',
  seoKeywords: [
    'distributed job scheduler system design',
    'cron system design interview',
    'task scheduler architecture',
    'distributed cron design',
  ],
  sections: [
    {
      type: 'p',
      text: 'Every company has “run this job every night at 2 AM” — until one box dies and nobody notices, or ten boxes all fire the same cron. A distributed job scheduler is the grown-up version of crontab: durable schedules, many workers, retries, and observability. Interviewers like it because it mixes [message queues](/system-design/message-queues-async-processing), locking, and clock skew without needing a flashy consumer product.',
    },
    {
      type: 'p',
      text: 'Use the [framework](/system-design/how-to-approach-system-design-interviews): one-shot vs recurring, max job runtime, and whether “at-least-once” execution is acceptable (almost always yes if jobs are idempotent).',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Register a job: schedule (cron or one-shot timestamp), payload/handler name, owner.',
        'Execute the job when due across a fleet of workers.',
        'Retry with backoff on failure; dead-letter after N attempts.',
        'Pause, resume, cancel, and list job history.',
        'Optional: dependencies (job B after A succeeds) as a stretch goal.',
      ],
    },
    { type: 'h2', text: 'Non-functional requirements' },
    {
      type: 'ul',
      items: [
        'No single point of failure — scheduler and workers must survive node loss.',
        'At-least-once delivery of “run” signals; jobs must be idempotent.',
        'Bounded delay: fire within seconds of the scheduled time under normal load.',
        'Fairness: one noisy tenant cannot starve others.',
      ],
    },
    {
      type: 'callout',
      title: 'Idempotency is non-negotiable',
      text: 'Distributed systems will double-fire under retries and network partitions. Design handlers to be safe if run twice — same lesson as [payments](/system-design/design-payment-system).',
    },
    { type: 'h2', text: 'Capacity' },
    {
      type: 'p',
      text: 'Assume 10M registered schedules, 100K firings per minute at peak (think fan-out digests). Workers are CPU/IO bound on the job itself; the scheduler’s job is to enqueue work, not do the work. Separate control plane (when to run) from data plane (running the handler).',
    },
    { type: 'h2', text: 'Architecture' },
    {
      type: 'ol',
      items: [
        'API — create/update/delete schedules; auth via [API gateway](/system-design/design-api-gateway).',
        'Job store — PostgreSQL or Cassandra: schedule definition + next_run_at.',
        'Dispatcher — polls or listens for due jobs, claims them, pushes to queue.',
        'Queue — Kafka / SQS with job_run_id payloads.',
        'Workers — pull jobs, execute, report success/fail.',
        'History / metrics — run logs, latency, failure rates.',
      ],
    },
    { type: 'h3', text: 'Why not every worker runs crontab?' },
    {
      type: 'p',
      text: 'Local cron duplicates and drifts. Central schedule + distributed workers gives one source of truth. Classic anti-pattern: “deploy the same cron on 20 pods.”',
    },
    { type: 'h2', text: 'Claiming due jobs (avoid double fire)' },
    {
      type: 'p',
      text: 'Dispatcher selects rows where `next_run_at <= now() AND status = scheduled`. Claim with optimistic locking: `UPDATE … SET status = running, locked_by = dispatcher_id WHERE id = ? AND status = scheduled`. Only one updater wins. Alternatively Redis `SET job:{id}:lock NX EX 60` before enqueue.',
    },
    {
      type: 'ul',
      items: [
        'After claim, enqueue message with unique run_id.',
        'On success: write history, compute next_run_at from cron, set status = scheduled.',
        'On failure: increment attempts, set next_run_at = now + backoff, or move to DLQ.',
        'Lease timeout: if worker dies, lock expires and job becomes claimable again.',
      ],
    },
    { type: 'h2', text: 'Cron and next_run_at' },
    {
      type: 'p',
      text: 'Store cron expression + timezone. After each successful run, compute next fire time with a cron library. Index `next_run_at` so dispatchers can `SELECT … ORDER BY next_run_at LIMIT N FOR UPDATE SKIP LOCKED` (Postgres) — excellent interview phrase. SKIP LOCKED lets multiple dispatchers poll without blocking each other.',
    },
    { type: 'h2', text: 'Thundering herd' },
    {
      type: 'p',
      text: 'Midnight UTC is when everyone schedules “daily reports.” Spread with jitter: `next_run_at += random(0, 60s)`. Shard schedules by `hash(job_id) % num_dispatcher_partitions` so load spreads. Rate-limit enqueue per tenant.',
    },
    {
      type: 'table',
      headers: ['Problem', 'Mitigation'],
      rows: [
        ['Same second stampede', 'Jitter + partitioned dispatchers'],
        ['Long-running job overlaps next fire', 'Forbid overlap or queue behind previous run_id'],
        ['Clock skew', 'Use DB/NTP time; tolerate ± few seconds'],
        ['Poison message', 'Max attempts + DLQ + alert'],
      ],
    },
    { type: 'h2', text: 'One-shot vs recurring' },
    {
      type: 'p',
      text: 'One-shot: delete or mark completed after success. Recurring: always advance next_run_at. Missed windows (dispatcher down for an hour): either catch up (run once for missed) or skip to next — product decision; say both options aloud.',
    },
    { type: 'h2', text: 'Storage choice' },
    {
      type: 'p',
      text: 'PostgreSQL is enough for millions of schedules with a good `next_run_at` index. At extreme scale, shard by tenant or use a calendar queue in Redis sorted sets (`ZADD due_jobs score=timestamp member=job_id`) similar to [leaderboard](/system-design/design-leaderboard) ZSETs — score is fire time. Redis is fast but needs persistence story (AOF/RDB) or dual-write to SQL for durability.',
    },
    { type: 'h2', text: 'Observability' },
    {
      type: 'ul',
      items: [
        'Metrics: runs started, succeeded, failed, lag (now − scheduled_time).',
        'Trace run_id across dispatcher → queue → worker.',
        'Alert when lag > threshold or DLQ depth grows.',
        'Audit who changed a cron — compliance loves this.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'Host registers `0 2 * * *` nightly billing job, timezone Asia/Kolkata.',
        'At 02:00 IST, dispatcher claims job, enqueues run_id R1.',
        'Worker executes; billing API called with idempotency key R1.',
        'Success → next_run_at set to tomorrow 02:00 + 12s jitter.',
        'If worker crashes mid-run, lease expires; another worker may retry — billing ignores duplicate R1.',
      ],
    },
    { type: 'h2', text: 'Multi-tenant isolation' },
    {
      type: 'p',
      text: 'SaaS schedulers need per-tenant quotas: max jobs, max concurrent runs, enqueue rate. Separate Kafka partitions or SQS queues per tier (free vs paid) so noisy neighbors cannot block VIP digests. Store `tenant_id` on every schedule row and filter dispatcher polls with fair round-robin across tenants when backlog is deep.',
    },
    {
      type: 'callout',
      title: 'Catch-up policy',
      text: 'If the dispatcher was down during a fire window: skip (next cron only), run-once catch-up, or run every missed slot. Batch jobs usually skip; billing usually catch-up once. State the policy explicitly.',
    },
    { type: 'h2', text: 'Comparison with workflow engines' },
    {
      type: 'p',
      text: 'Temporal / Cadence / Step Functions add durable workflows with signals and timers. A plain job scheduler is cron + queue. If the interviewer asks for “saga across services,” escalate to a workflow engine; do not bolt a state machine into crontab. Knowing when to stop is part of the answer.',
    },
    { type: 'h2', text: 'Backfill and manual runs' },
    {
      type: 'p',
      text: 'Operators need “run now” and “re-run failed run_id.” Treat manual triggers as one-shot enqueues with a new run_id so idempotency keys stay unique. Audit every manual fire. For data pipelines, expose a backfill API that enqueues a date-range of logical runs rather than changing the cron definition.',
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'Draw API → job store → dispatcher → queue → workers. Emphasize claim/lock, at-least-once + idempotent handlers, SKIP LOCKED or Redis locks, and jitter for midnight herds. Tie retries to [notification](/system-design/design-notification-system) delivery patterns. That is a complete scheduler answer.',
    },
  ],
}

export default article
