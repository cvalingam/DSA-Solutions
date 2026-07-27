import type { SystemDesignArticle } from './types'

const article: SystemDesignArticle = {
  slug: 'design-google-calendar',
  title: 'Design Google Calendar',
  description:
    'How to design Google Calendar for interviews: events and recurrence, availability, invites, reminders, sync, and concurrency on overlapping edits.',
  readMinutes: 13,
  published: '2026-07-16',
  category: 'case-study',
  seoKeywords: [
    'Google Calendar system design',
    'calendar system design interview',
    'design calendar application architecture',
    'recurring events system design',
  ],
  sections: [
    {
      type: 'p',
      text: 'Calendar looks like CRUD until recurrence, time zones, and “find a slot for five people” show up. It borrows availability thinking from [ticket booking](/system-design/design-ticket-booking-system) (busy intervals, not finite seats) and delivery patterns from [notifications](/system-design/design-notification-system) (reminders). Interviewers listen for event modeling and sync - not whether you memorized iCal RFCs.',
    },
    {
      type: 'p',
      text: 'Scope with the [framework](/system-design/how-to-approach-system-design-interviews): personal calendars, create/edit events, invites, reminders, basic free/busy. Full Google Meet orchestration can point at [Zoom](/system-design/design-zoom-video-conferencing) as a dependency.',
    },
    { type: 'h2', text: 'Functional requirements' },
    {
      type: 'ul',
      items: [
        'Create, update, delete events with start/end, timezone, attendees.',
        'Support recurring events (daily/weekly/monthly) with exceptions.',
        'Invite users; track accept/decline/tentative.',
        'Reminders via push/email/SMS.',
        'Sync across web and mobile; offline edits with conflict resolution.',
        'Optional: shared calendars, free/busy scheduling assistant.',
      ],
    },
    { type: 'h2', text: 'Non-functional' },
    {
      type: 'ul',
      items: [
        'Read-heavy: month views dominate writes.',
        'Strong-ish consistency for a user’s own primary calendar; eventual OK for free/busy of others.',
        'Correct time-zone arithmetic - DST bugs are legendary.',
        'Reminder delivery within a small skew (tens of seconds).',
      ],
    },
    {
      type: 'callout',
      title: 'Store rules, expand on read',
      text: 'Do not insert 10 years of daily rows for a recurrence. Persist an RRULE (or equivalent) plus exception list; expand instances for the visible window (e.g. ± a few months). That single decision keeps storage sane.',
    },
    { type: 'h2', text: 'Capacity sketch' },
    {
      type: 'p',
      text: '1B users is fantasy scale for a whiteboard - pick 100M MAU, 5 events created/user/week, huge read amplification from month grids. Reminder fan-out near the top of the hour causes spikes - classic [job scheduler](/system-design/design-distributed-job-scheduler) load shape.',
    },
    { type: 'h2', text: 'High-level architecture' },
    {
      type: 'ol',
      items: [
        'API / sync service - CRUD + incremental sync tokens ([API design](/system-design/api-design-rest-interviews)).',
        'Calendar/event store - SQL sharded by calendar_id / user_id.',
        'Recurrence expander - library used by read path and reminder planner.',
        'Invite service - attendee rows + email notifications.',
        'Reminder scheduler - materialize near-term firings into a queue.',
        'Notification workers - push/email/SMS.',
        'Free/busy index - denormalized busy intervals for scheduling queries.',
        'Client sync - local DB + conflict policy.',
      ],
    },
    { type: 'h2', text: 'Data model' },
    {
      type: 'table',
      headers: ['Entity', 'Fields', 'Notes'],
      rows: [
        ['Calendar', 'owner, acl, tz default', 'Shard key'],
        ['Event', 'start, end, tz, title, rrule, series_id', 'Master for recurrence'],
        ['Exception', 'instance_start, overrides / cancelled', 'This-one vs all-following'],
        ['Attendee', 'event_id, user_id, status', 'RSVP state'],
        ['Reminder', 'event_id, fire_at, channel', 'Or derived from offsets'],
      ],
    },
    { type: 'h2', text: 'Recurrence and edits' },
    {
      type: 'p',
      text: 'Editing “this event” writes an exception. Editing “this and following” splits the series (end old RRULE, start new series). Editing “all” updates the master. Expand with a well-tested library; do not hand-roll monthly edge cases live. For reads, query masters overlapping the window, expand, subtract exceptions.',
    },
    { type: 'h2', text: 'Invites and free/busy' },
    {
      type: 'p',
      text: 'Creating an event with attendees inserts attendee rows and sends [notifications](/system-design/design-notification-system). Free/busy for scheduling: maintain busy intervals per user (expanded a few months ahead by a worker). Query intersection for proposed slots - similar spirit to availability in [Airbnb](/system-design/design-airbnb-hotel-booking), but for people instead of listings.',
    },
    { type: 'h2', text: 'Reminders' },
    {
      type: 'ol',
      items: [
        'On create/update, compute next fire times for the near horizon (e.g. 48 h).',
        'Persist due reminders; a dispatcher polls/queues due work ([scheduler](/system-design/design-distributed-job-scheduler)).',
        'Send push; mark delivered; schedule the following occurrence for long series.',
        'Idempotent delivery keys prevent double pings on worker retry.',
      ],
    },
    { type: 'h2', text: 'Sync and conflicts' },
    {
      type: 'p',
      text: 'Clients hold a sync_token / version per calendar. Pull returns changed events since token. Concurrent edits: last-write-wins with updated_at + etag is MVP; optional OT/CRDT is overkill (point to [Docs](/system-design/design-collaborative-document-editor) only if they insist on co-editing the same event description). Offline creates use client-generated UUIDs.',
    },
    { type: 'h2', text: 'Scaling' },
    {
      type: 'ul',
      items: [
        'Shard by user_id / calendar_id ([sharding](/system-design/database-sharding-replication)).',
        'Cache month views in Redis ([caching](/system-design/caching-fundamentals-for-interviews)) with short TTL or version keys.',
        'Reminder load: shard dispatchers by fire_at ranges; smooth top-of-hour spikes with jitter.',
        'Read replicas for free/busy; primary for event writes.',
      ],
    },
    { type: 'h2', text: 'Worked example' },
    {
      type: 'ol',
      items: [
        'Alice creates weekly standup RRULE with Bob; exceptions none.',
        'Bob’s client syncs new series; both get a 10-minute reminder job materialized for the next meeting.',
        'Alice edits only next Tuesday → exception row overrides that instance.',
        'Charlie checks Alice free/busy; busy index shows Tuesday blocked, other Tuesdays still series-busy.',
      ],
    },
    { type: 'h2', text: 'Interview narrative' },
    {
      type: 'p',
      text: 'Lead with event + RRULE + exceptions, then sync tokens and reminder scheduler. Contrast with ticket booking (finite seats) and chat (ephemeral). Keep Meet/Zoom as an external join link. That is Google Calendar at interview depth.',
    },
  ],
}

export default article
