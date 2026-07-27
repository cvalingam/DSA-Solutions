import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-recommendation-system',
  title: 'Design a Recommendation System',
  description:
    'How to design a recommendation system for interviews: candidate generation, ranking, features, offline training, online serving, and feedback loops.',
  readMinutes: 13,
  published: '2026-07-14',
  category: 'case-study',
  seoKeywords: [
    'recommendation system design',
    'recommender system architecture interview',
    'Netflix Amazon recommendation system design',
    'candidate generation ranking system design',
  ],
  sections: [
    {
      type: 'p',
      text: '“Design Netflix recommendations” is not an invitation to derive matrix factorization on a whiteboard. Interviewers want a production shape: offline training, candidate generation, ranking, filters, and a feedback loop - wired to products you already know like [Netflix](/system-design/design-video-streaming-netflix), [Spotify](/system-design/design-spotify-music-streaming), or [e-commerce](/system-design/design-ecommerce-shopping-cart).',
    },
    {
      type: 'p',
      text: 'Use the [framework](/system-design/how-to-approach-system-design-interviews): pick one surface (home feed shelf, “because you watched,” or product page “similar items”), define success (CTR, watch time, revenue), and keep ML depth proportional to the round.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Return a ranked list of N items for a user/context (homepage, item page, email).',
        'Support cold-start users and cold-start items.',
        'Respect business rules: no spoilers, in-stock only, region licensing, blocklist.',
        'Log impressions and engagements for training.',
        'Optional: explanations (“because you liked X”), A/B experiment hooks.',
      ],
    },
    { type: 'h2', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'P99 latency under ~100-200 ms for online recommend API.',
        'Freshness: new viral items appear within minutes to hours, not only next day.',
        'Availability: degrade to popular/trending if personalization is down.',
        'Diversity and fatigue - do not return 20 nearly identical items.',
      ],
    },
    {
      type: 'callout',
      title: 'Two-stage is the interview answer',
      text: 'Almost every large recommender is retrieve-then-rank. First pull hundreds or thousands of candidates cheaply, then score on the order of hundreds with a heavier model. Saying “I will score the entire catalog with a deep net per request” is a red flag.',
    },
    { type: 'h2', text: 'Capacity sketch' },
    {
      type: 'p',
      text: '100M DAU, homepage loads averaging 5 recommend calls → ~5K-10K QPS with peaks. Catalog 1M-100M items. Candidate stage must be O(log n) or precomputed - not a full scan. Feature store reads should be cached ([Redis](/system-design/design-distributed-cache-redis) / local).',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'ol',
      items: [
        'Event pipeline - views, clicks, watches, purchases → [Kafka](/system-design/message-queues-async-processing).',
        'Feature store - user and item features (batch + nearline).',
        'Offline training - daily/ hourly jobs produce embeddings and ranker weights.',
        'Candidate generators - collaborative filters, content similarity, trending, editorial.',
        'Ranker service - scores candidates with gradient-boosted trees or a small neural net.',
        'Filter / blender - business rules, dedupe, diversity, exploration.',
        'Online API - assemble response; fall back shelves on failure.',
        'Experimentation - assign users to variants; log exposures.',
      ],
    },
    { type: 'h2', text: 'Candidate generation' },
    {
      type: 'ul',
      items: [
        'Item-item CF: “users who liked X also liked Y” - precompute top-K neighbors in a KV store.',
        'User embedding ANN: approximate nearest neighbors (Faiss / ScaNN) over item vectors.',
        'Trending / popular: time-decayed counters - great cold-start baseline.',
        'Graph / social: friends’ recent likes if the product has a social graph ([news feed](/system-design/design-news-feed) adjacency).',
        'Co-occurrence from search or session - complementary to [search](/system-design/design-search-engine) logs.',
      ],
    },
    {
      type: 'p',
      text: 'Union candidates from 3-5 sources with caps per source so one noisy channel cannot dominate. Cap at ~500-1000 before ranking.',
    },
    { type: 'h2', text: 'Ranking and features' },
    {
      type: 'table',
      headers: ['Feature type', 'Examples', 'Freshness'],
      rows: [
        ['User', 'Age proxy, language, tenure, average session length', 'Daily + nearline'],
        ['Context', 'Device, time of day, country, page type', 'Request-time'],
        ['Item', 'Category, creator, embedding, quality score', 'Batch'],
        ['Cross', 'User×item affinity, hours since last similar watch', 'Nearline'],
      ],
    },
    {
      type: 'p',
      text: 'Pointwise rankers predict click/watch probability; listwise methods optimize whole-slate metrics. In interviews, pick pointwise + simple diversity re-rank and move on. Mention calibration so scores are comparable across candidate sources.',
    },
    { type: 'h2', text: 'Online serving path' },
    {
      type: 'ol',
      items: [
        'Request arrives with user_id + context.',
        'Fetch user features (cache-aside); fetch candidate lists in parallel.',
        'Filter ineligible items (geo, inventory, already watched).',
        'Score survivors; apply diversity and exploration (ε-greedy or bandit light).',
        'Return IDs; client hydrates cards from a catalog service.',
        'Log impression set asynchronously for training (critical for unbiased learning).',
      ],
    },
    { type: 'h2', text: 'Cold start' },
    {
      type: 'p',
      text: 'New users: onboarding interests + popular-in-region + exploration. New items: content embeddings from title/metadata/transcript; boost in exploration slots until enough interactions exist. Never leave a blank homepage - product managers will veto your design in the room.',
    },
    { type: 'h2', text: 'Feedback loops and bias' },
    {
      type: 'p',
      text: 'You only observe clicks on items you showed - position bias and selection bias are real. Say you will log impressions, use propensity weighting or random exploration slots, and separate training data from serving policy. This one paragraph signals senior judgment.',
    },
    { type: 'h2', text: 'Scaling and failure' },
    {
      type: 'ul',
      items: [
        'Precompute heavy candidates; keep online path CPU-light.',
        'Shard ANN indexes; replicate ranker replicas behind a [load balancer](/system-design/load-balancing-and-scaling).',
        'Circuit-break personalization → trending shelf ([CAP](/system-design/cap-theorem-consistency-models) favor availability for homepage).',
        'Monitor recommendation quality with offline AUC and online A/B - not only QPS.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'User opens Netflix-like home.',
        'Generators return: similar-to-recent (120), trending (80), CF neighbors (200).',
        'After filters, 350 candidates; ranker scores watch-probability.',
        'Blender builds rows: Top Picks, Trending, Because you watched X.',
        'Impressions logged; tonight’s trainer will update item affinities.',
      ],
    },
    { type: 'h2', text: 'Interview narrative' },
    {
      type: 'p',
      text: 'Draw retrieve → rank → filter. Stress precomputation, feature store, and graceful fallback. Tie events to Kafka and contrast with a pure [search engine](/system-design/design-search-engine) (query in, docs out) versus recommendations (user+context in, personalized slate out). Skip the research-paper rabbit hole unless they ask.',
    },
  ],
}

export default article
