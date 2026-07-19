import { SITE_URL } from './constants'
import { getAllProblemsMeta } from './problems'
import { getAllGfgProblemsMeta } from './gfg-problems'
import type { Problem, ProblemMeta } from './problems'
import type { GfgProblem } from './gfg-problems'

export interface RichExplanation {
  intuition: string
  algorithm: string[]
  example?: { input: string; steps: string[]; output: string }
  pitfalls?: string[]
}

/** Frozen at build time — used for sitemap lastModified and JSON-LD dateModified. */
export const BUILD_DATE = new Date()

export const AUTHOR = {
  name: 'Sivalingam Ramasamy',
  url: 'https://github.com/cvalingam',
} as const

export function getSiteStats() {
  const lcCount = getAllProblemsMeta().length
  const gfgCount = getAllGfgProblemsMeta().length
  return { lcCount, gfgCount, total: lcCount + gfgCount }
}

/** Google meta description sweet spot is ~150–160 characters. */
export function truncateDescription(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut) + '…'
}

export function buildLcDescription(
  problem: Problem,
  rich?: RichExplanation,
): string {
  const primary = problem.primaryExt === 'cs' ? 'C#' : problem.primaryExt.toUpperCase()
  let desc = `LeetCode ${problem.number} ${problem.title} (${problem.difficulty}) — ${primary} solution with code`

  if (rich?.intuition) {
    desc += `. ${rich.intuition}`
  } else if (problem.approach) {
    desc += `. ${problem.approach}`
  }

  if (problem.complexity) {
    desc += `. Time ${problem.complexity.time}, space ${problem.complexity.space}.`
  }

  if (problem.tags.length > 0) {
    desc += ` Topics: ${problem.tags.slice(0, 3).join(', ')}.`
  }

  return truncateDescription(desc)
}

export function buildGfgDescription(
  problem: GfgProblem,
  rich?: RichExplanation,
): string {
  let desc = `GeeksforGeeks ${problem.title} — Java solution with explanation and full code`

  if (rich?.intuition) {
    desc += `. ${rich.intuition}`
  } else if (problem.approach) {
    desc += `. ${problem.approach}`
  }

  if (problem.complexity) {
    desc += `. Time ${problem.complexity.time}, space ${problem.complexity.space}.`
  }

  return truncateDescription(desc)
}

export function buildOrganizationSchema() {
  const { lcCount, gfgCount } = getSiteStats()
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DSA Solutions',
    url: SITE_URL,
    logo: `${SITE_URL}/icon`,
    description: `${lcCount}+ LeetCode and ${gfgCount}+ GeeksforGeeks solutions with explanations for interview prep.`,
    sameAs: ['https://github.com/cvalingam'],
    founder: {
      '@type': 'Person',
      name: AUTHOR.name,
      url: AUTHOR.url,
    },
  }
}

export function buildLcArticleGraph(
  problem: Problem,
  rich: RichExplanation | undefined,
  primaryLabel: string,
) {
  const url = `${SITE_URL}/problems/${problem.slug}`
  const headline = `${problem.number}. ${problem.title} — LeetCode ${primaryLabel} Solution`
  const description = buildLcDescription(problem, rich)

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'TechArticle',
      headline,
      description,
      author: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
      publisher: { '@type': 'Organization', name: 'DSA Solutions', url: SITE_URL },
      url,
      mainEntityOfPage: url,
      datePublished: '2024-01-01',
      dateModified: BUILD_DATE.toISOString().split('T')[0],
      image: `${url}/opengraph-image`,
      programmingLanguage: primaryLabel,
      proficiencyLevel: problem.difficulty,
      keywords: problem.tags.join(', '),
      isAccessibleForFree: true,
      inLanguage: 'en',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'LeetCode Solutions', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: `${problem.number}. ${problem.title}`, item: url },
      ],
    },
    {
      '@type': 'SoftwareSourceCode',
      name: headline,
      description,
      url,
      programmingLanguage: primaryLabel,
      author: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
      ...(problem.complexity
        ? {
            runtimePlatform: 'LeetCode',
            additionalProperty: [
              { '@type': 'PropertyValue', name: 'timeComplexity', value: problem.complexity.time },
              { '@type': 'PropertyValue', name: 'spaceComplexity', value: problem.complexity.space },
            ],
          }
        : {}),
    },
  ]

  if (rich?.algorithm.length) {
    graph.push({
      '@type': 'HowTo',
      name: `How to solve LeetCode ${problem.number} ${problem.title}`,
      description: rich.intuition,
      step: rich.algorithm.map((text, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        text,
      })),
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

export function buildGfgArticleGraph(
  problem: GfgProblem,
  rich: RichExplanation | undefined,
) {
  const url = `${SITE_URL}/gfg/${problem.slug}`
  const headline = `${problem.title} — GFG Java Solution`
  const description = buildGfgDescription(problem, rich)

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'TechArticle',
      headline,
      description,
      author: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
      publisher: { '@type': 'Organization', name: 'DSA Solutions', url: SITE_URL },
      url,
      mainEntityOfPage: url,
      datePublished: '2025-01-01',
      dateModified: BUILD_DATE.toISOString().split('T')[0],
      image: `${url}/opengraph-image`,
      programmingLanguage: 'Java',
      isAccessibleForFree: true,
      inLanguage: 'en',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'GFG Solutions', item: `${SITE_URL}/gfg` },
        { '@type': 'ListItem', position: 2, name: problem.title, item: url },
      ],
    },
    {
      '@type': 'SoftwareSourceCode',
      name: headline,
      description,
      url,
      programmingLanguage: 'Java',
      author: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
      ...(problem.complexity
        ? {
            additionalProperty: [
              { '@type': 'PropertyValue', name: 'timeComplexity', value: problem.complexity.time },
              { '@type': 'PropertyValue', name: 'spaceComplexity', value: problem.complexity.space },
            ],
          }
        : {}),
    },
  ]

  if (rich?.algorithm.length) {
    graph.push({
      '@type': 'HowTo',
      name: `How to solve ${problem.title} on GeeksforGeeks`,
      description: rich.intuition,
      step: rich.algorithm.map((text, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        text,
      })),
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

export function buildCollectionPageSchema(
  name: string,
  description: string,
  url: string,
  items: { name: string; url: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    numberOfItems: items.length,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.slice(0, 20).map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: item.url,
      })),
    },
  }
}

export function getRelatedLcProblems(problem: ProblemMeta, limit = 6): ProblemMeta[] {
  if (problem.tags.length === 0) return []
  const tagSet = new Set(problem.tags)
  return getAllProblemsMeta()
    .filter(p => p.slug !== problem.slug && p.tags.some(t => tagSet.has(t)))
    .sort((a, b) => {
      const overlap = (p: ProblemMeta) => p.tags.filter(t => tagSet.has(t)).length
      return overlap(b) - overlap(a) || a.number - b.number
    })
    .slice(0, limit)
}

export function buildSystemDesignBreadcrumb(slug: string, title: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'System Design', item: `${SITE_URL}/system-design` },
      { '@type': 'ListItem', position: 3, name: title, item: `${SITE_URL}/system-design/${slug}` },
    ],
  }
}

export function buildSystemDesignHubSchema(
  articleCount: number,
  articles: { slug: string; title: string; description: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'System Design Interview Guide',
    description:
      `${articleCount} practical system design articles for coding interview prep: frameworks, URL shortener, rate limiter, caching, news feed, chat, payments, Uber, Gmail, CDN, Twitch, distributed logging, ad click aggregator, Google Calendar, recommendations, stock trading, DoorDash, Stack Overflow, web crawler, Netflix, search engine, ticketing, Redis, e-commerce, notifications, file storage, CAP theorem, sharding, Kafka, SQL vs NoSQL, load balancing, and API design.`,
    url: `${SITE_URL}/system-design`,
    author: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
    numberOfItems: articleCount,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articles.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: a.title,
        description: a.description,
        url: `${SITE_URL}/system-design/${a.slug}`,
      })),
    },
  }
}

export function buildWorksPageSchema(
  projects: {
    title: string
    description: string
    url: string
    github?: string
    tags: string[]
  }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Works — Live Projects by Sivalingam Ramasamy',
    description:
      'Selected live projects by Sivalingam Ramasamy — NEET MDS Image Sizer, DSA Solutions, Skin Klove, Clinic OS, Invoice Generator, GST Bot, and Steel Express.',
    url: `${SITE_URL}/works`,
    author: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
    numberOfItems: projects.length,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: p.title,
          description: p.description,
          url: p.url,
          applicationCategory: 'WebApplication',
          operatingSystem: 'Any',
          author: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
          keywords: p.tags.join(', '),
          ...(p.github ? { codeRepository: p.github } : {}),
        },
      })),
    },
  }
}
