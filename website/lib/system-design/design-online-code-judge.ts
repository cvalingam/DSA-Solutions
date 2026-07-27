import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-online-code-judge',
  title: 'Design an Online Code Judge (LeetCode-style)',
  description:
    'How to design an online judge for interviews: code submission, sandboxed execution, judging queues, plagiarism, and scaling contest load spikes.',
  readMinutes: 13,
  published: '2026-07-18',
  category: 'case-study',
  seoKeywords: [
    'online judge system design',
    'LeetCode system design interview',
    'code execution sandbox architecture',
    'coding contest platform design',
  ],
  sections: [
    {
      type: 'p',
      text: 'An online judge accepts source code, runs it against hidden tests in a sandbox, and returns Accepted or Wrong Answer. It is meta for this site - and a favorite interview because it mixes [async queues](/system-design/message-queues-async-processing), multi-tenant isolation, and spiky contest traffic. You do not need to invent Docker from scratch; you need clear trust boundaries.',
    },
    {
      type: 'p',
      text: 'Scope via the [framework](/system-design/how-to-approach-system-design-interviews): languages supported, interactive problems, and contest mode vs practice mode.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Users submit code for a problem; system returns verdict + runtime/memory.',
        'Support multiple languages (C++, Java, Python, C#).',
        'Store submission history; show public/private test feedback carefully.',
        'Admin uploads problems and test cases.',
        'Optional: contests with leaderboards ([leaderboard](/system-design/design-leaderboard)).',
      ],
    },
    { type: 'h2', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Isolate submissions - no filesystem escape, no crypto miner on your hosts.',
        'Fair scheduling: one user cannot starve the queue.',
        'Handle contest start storms (10K submits in a minute).',
        'Deterministic judging - same code → same verdict.',
      ],
    },
    {
      type: 'callout',
      title: 'Security first',
      text: 'Treat every submission as hostile. Sandbox is not optional. Mention seccomp, cgroups, network namespace off, read-only root, and time/memory kill switches.',
    },
    { type: 'h2', text: 'High-level flow' },
    {
      type: 'ol',
      items: [
        'Client POST /submit {problem_id, language, source}.',
        'API stores submission row (Queued), pushes job to Kafka/SQS.',
        'Worker pulls job, fetches tests, runs in sandbox per test case.',
        'Worker writes verdict, runtime, memory; status → Done.',
        'Client polls or receives WebSocket/[notification](/system-design/design-notification-system) update.',
      ],
    },
    { type: 'h2', text: 'Data model' },
    {
      type: 'table',
      headers: ['Entity', 'Fields', 'Store'],
      rows: [
        ['Problem', 'id, statement, limits, visibility', 'PostgreSQL'],
        ['TestCase', 'problem_id, input, output, score, sample?', 'Object storage + DB metadata'],
        ['Submission', 'user_id, code_uri, status, verdict, time_ms', 'PostgreSQL'],
        ['Job', 'submission_id', 'Queue'],
      ],
    },
    {
      type: 'p',
      text: 'Keep large source and I/O blobs in S3; DB holds pointers. Same split as [Pastebin](/system-design/design-pastebin) / [file storage](/system-design/design-file-storage-dropbox).',
    },
    { type: 'h2', text: 'Sandbox worker' },
    {
      type: 'ul',
      items: [
        'Compile in an isolated container (or skip for interpreted languages).',
        'For each test: mount input, run binary with CPU/memory/wall-clock limits.',
        'Compare stdout to expected (exact or float epsilon).',
        'Capture TLE, MLE, RE, CE as first-class verdicts.',
        'Never enable outbound network from the judge container.',
      ],
    },
    {
      type: 'p',
      text: 'Pool warm VMs/containers per language to avoid cold starts. Dirty containers are destroyed or snapshotted back - do not reuse a filesystem a user just wrote.',
    },
    { type: 'h2', text: 'Queueing and fairness' },
    {
      type: 'p',
      text: 'One shared Kafka topic can work; better: priority queues for contests vs practice, and per-user rate limits so a script cannot enqueue 10K jobs ([rate limiter](/system-design/design-rate-limiter), [API gateway](/system-design/design-api-gateway)). Scale workers on queue depth - classic [async processing](/system-design/message-queues-async-processing) autoscale.',
    },
    { type: 'h2', text: 'Contest mode' },
    {
      type: 'ul',
      items: [
        'Freeze scoreboard optionally; compute ranks from accepted times.',
        'Hide detailed WA diffs to reduce leaking hidden tests.',
        'Pre-warm worker fleets before contest start.',
        'Cache problem statements on CDN; DB still owns submits.',
      ],
    },
    { type: 'h2', text: 'Plagiarism and abuse' },
    {
      type: 'p',
      text: 'Async job fingerprints ASTs or token hashes and flags similar pairs for review. Rate-limit submit bursts. Store audit logs of IP and user agent. Do not block the judge path on plagiarism - run it after verdict.',
    },
    { type: 'h2', text: 'Scaling math' },
    {
      type: 'p',
      text: 'Assume 100 submits/sec peak, average 5 tests × 200 ms = 1 CPU-sec per submit → ~100 cores busy. Burst 10× needs either a huge pool or queue delay with honest “in queue #520” UX. Spot instances for workers save money; spot death just requeues the job (idempotent submission_id).',
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'User submits C# for Two Sum; API writes submission S77, enqueues job.',
        'Worker compiles; runs 40 tests in a cgroup-limited container.',
        'Test 17 wrong answer → verdict WA; remaining tests skipped (or run for stats).',
        'UI updates via poll; plagiarism scanner fingerprints S77 offline.',
      ],
    },
    { type: 'h2', text: 'Multi-region' },
    {
      type: 'p',
      text: 'Pin a contest to one region for consistent clocks and ranking. Practice traffic can be geo-routed. Object storage for tests replicates; do not split-brain a live contest scoreboard.',
    },
    { type: 'h2', text: 'Special verdicts' },
    {
      type: 'table',
      headers: ['Verdict', 'Meaning'],
      rows: [
        ['AC', 'All tests passed'],
        ['WA', 'Wrong output'],
        ['TLE', 'Exceeded time limit'],
        ['MLE', 'Exceeded memory'],
        ['RE', 'Runtime crash / signal'],
        ['CE', 'Compile error'],
      ],
    },
    {
      type: 'p',
      text: 'Interactive problems need a judge process talking to the user binary over pipes - mention as an extension. Floating-point compares use absolute/relative epsilon. Custom checkers are admin-uploaded programs run after stdout capture.',
    },
    { type: 'h2', text: 'Interview narrative' },
    {
      type: 'p',
      text: 'Lead with trust boundary and sandbox, then queue + workers, then contest spike plan. Mention signed URLs for downloading statements and S3 for artifacts. Compare to CI systems (GitHub Actions): same isolation problem, different UX. That framing feels real.',
    },
  ],
}

export default article
