import { MetadataRoute } from 'next'
import { getAllProblemsMeta } from '@/lib/problems'
import { getAllGfgProblemsMeta } from '@/lib/gfg-problems'
import { getAllTags } from '@/lib/tags'
import { SITE_URL } from '@/lib/constants'
import { BUILD_DATE } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const problems = getAllProblemsMeta()
  const buildDate = BUILD_DATE

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,               lastModified: buildDate, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE_URL}/gfg`,            lastModified: buildDate, changeFrequency: 'daily',   priority: 0.95 },
    { url: `${SITE_URL}/study-guide`,    lastModified: buildDate, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/cheat-sheet`,    lastModified: buildDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/faq`,            lastModified: buildDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/about`,          lastModified: buildDate, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: buildDate, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${SITE_URL}/contact`,        lastModified: buildDate, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${SITE_URL}/terms`,          lastModified: buildDate, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${SITE_URL}/topics`,         lastModified: buildDate, changeFrequency: 'weekly',  priority: 0.8 },
  ]

  const tags = getAllTags()
  const topicPages: MetadataRoute.Sitemap = tags.map(({ tag }) => ({
    url: `${SITE_URL}/topics/${tag}`,
    lastModified: buildDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const problemPages: MetadataRoute.Sitemap = problems.map(p => ({
    url: `${SITE_URL}/problems/${p.slug}`,
    lastModified: buildDate,
    changeFrequency: 'monthly' as const,
    priority: p.difficulty === 'Easy' ? 0.75 : p.difficulty === 'Medium' ? 0.7 : 0.65,
  }))

  const gfgProblems = getAllGfgProblemsMeta()
  const gfgPages: MetadataRoute.Sitemap = gfgProblems.map(p => ({
    url: `${SITE_URL}/gfg/${p.slug}`,
    lastModified: buildDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...topicPages, ...problemPages, ...gfgPages]
}
