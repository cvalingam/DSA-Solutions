import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-mapreduce-batch-processing',
  title: 'Design MapReduce (Batch Processing)',
  description:
    'How to design MapReduce for interviews: map/shuffle/reduce, fault tolerance, speculative execution, schedulers, YARN/HDFS overlap, and when Spark wins.',
  readMinutes: 13,
  published: '2026-08-06',
  category: 'case-study',
  seoKeywords: [
    'MapReduce system design',
    'MapReduce interview',
    'batch processing system design',
    'map shuffle reduce design',
  ],
  sections: [
    {
      type: 'p',
      text: 'MapReduce is the grandparent of large-scale batch compute: run a map over split inputs, shuffle by key, reduce groups. Even if you would ship Spark today, interviews still ask MapReduce to probe partitioning, failure, and data locality. It connects to [object storage](/system-design/design-object-storage-s3) / HDFS, [job schedulers](/system-design/design-distributed-job-scheduler), and log analytics.',
    },
    {
      type: 'p',
      text: 'Open with the [framework](/system-design/how-to-approach-system-design-interviews): word count as the toy job, then scale to petabyte sorts. Separate the programming model from the cluster implementation.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Submit a job: mapper, reducer, input paths, output path, partitioner.',
        'Split inputs into tasks; run maps in parallel.',
        'Shuffle intermediate (key, value) pairs to reducers.',
        'Write final outputs; expose job status and counters.',
        'On worker death, re-run failed tasks without corrupting output.',
      ],
    },
    { type: 'h2', text: 'Non-functional requirements' },
    {
      type: 'ul',
      items: [
        'Scale to thousands of workers; jobs lasting minutes to hours.',
        'Tolerate frequent machine loss.',
        'Prefer data-local map tasks (compute near blocks).',
        'Predictable throughput over low latency (this is batch, not OLTP).',
      ],
    },
    {
      type: 'callout',
      title: 'Shuffle is the expensive middle',
      text: 'Maps are embarrassingly parallel. The cross-network shuffle dominates time and failure modes. Talk about sort/merge, skew, and combiner early - that shows senior instincts.',
    },
    { type: 'h2', text: 'Programming model' },
    {
      type: 'ol',
      items: [
        'Map(k1, v1) → list(k2, v2).',
        'Optional Combiner: local reduce on the map host to cut shuffle bytes.',
        'Partition(k2) → reducer id (default hash).',
        'Reduce(k2, list(v2)) → list(v3) written to output.',
      ],
    },
    {
      type: 'p',
      text: 'Word count: map emits (word, 1); combine sums locally; reduce sums fully. Mentally link hashing partitions to [sharding](/system-design/database-sharding-replication).',
    },
    { type: 'h2', text: 'Cluster architecture' },
    {
      type: 'table',
      headers: ['Component', 'Role'],
      rows: [
        ['Distributed FS', 'Input/output blocks with replication (HDFS/S3)'],
        ['Resource manager', 'CPUs/RAM slots (YARN/Mesos/K8s)'],
        ['Application master', 'Per-job coordinator of map/reduce tasks'],
        ['Workers', 'Run tasks; spill intermediates to local disk'],
      ],
    },
    {
      type: 'ol',
      items: [
        'Job splits input files into M map tasks by block size.',
        'Scheduler places maps on nodes that already hold those blocks.',
        'Each map writes partitioned spill files; shuffle copies to reduce hosts.',
        'Reducers merge-sort inputs, invoke reduce, write final files atomically.',
      ],
    },
    { type: 'h2', text: 'Fault tolerance' },
    {
      type: 'ul',
      items: [
        'Map failure: re-execute that split elsewhere; outputs are temporary until committed.',
        'Reduce failure: re-fetch map outputs (maps keep them until job ends) and re-run.',
        'Master failure: historically a weak point - checkpoint job state or restart.',
        'Speculative execution: run a duplicate of a straggler; first finisher wins.',
      ],
    },
    {
      type: 'p',
      text: 'Idempotent task outputs and rename-to-commit keep the job deterministic. Same spirit as [exactly-once illusions](/system-design/message-queues-async-processing) elsewhere - at-least-once tasks plus immutable outputs.',
    },
    { type: 'h2', text: 'Skew and tuning knobs' },
    {
      type: 'ul',
      items: [
        'Hot keys: custom partitioner, salting keys, or two-phase reduce.',
        'Too many maps: startup overhead; too few: poor parallelism.',
        'Combiner when reduce is associative/commutative.',
        'Compress shuffle spills to save network.',
      ],
    },
    { type: 'h2', text: 'MapReduce vs Spark (say in thirty seconds)' },
    {
      type: 'p',
      text: 'Classic MapReduce materialises every stage on disk. Spark keeps lineages of partitions in memory across stages, which wins for iterative jobs. In interviews: explain MapReduce correctly first; then note Spark as the modern default for many pipelines.',
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'Count clicks per campaign over 50 TB logs on S3.',
        '2000 map tasks parse logs → emit (campaign_id, 1) with combiner.',
        '100 reducers hash-partition ids, sum, write parquet outputs.',
        'Two slow maps speculative-retry; job completes; BI tables refresh.',
      ],
    },
    { type: 'h2', text: 'Interview summary' },
    {
      type: 'p',
      text: 'Map → shuffle → reduce, data locality, task-level restart, and skew. Mention combiners and speculative execution. Closing with Spark contrast is optional polish.',
    },
  ],
}

export default article
