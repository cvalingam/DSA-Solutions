import { MetadataRoute } from 'next'
import { getAllProblems } from '@/lib/problems'
import { getAllGfgProblems } from '@/lib/gfg-problems'
import { getAllTags } from '@/lib/tags'
import { SITE_URL } from '@/lib/constants'
import { BUILD_DATE } from '@/lib/seo'
import { isGfgPageIndexable, isLcPageIndexable } from '@/lib/content-quality'
import { getAllSystemDesignArticles } from '@/lib/system-design'

export default function sitemap(): MetadataRoute.Sitemap {
  const buildDate = BUILD_DATE

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,               lastModified: buildDate, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE_URL}/study-guide`,    lastModified: buildDate, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/system-design`,  lastModified: buildDate, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/cheat-sheet`,    lastModified: buildDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/faq`,            lastModified: buildDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/works`,          lastModified: buildDate, changeFrequency: 'monthly', priority: 0.6 },
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

  const problemPages: MetadataRoute.Sitemap = getAllProblems()
    .filter(isLcPageIndexable)
    .map(p => ({
      url: `${SITE_URL}/problems/${p.slug}`,
      lastModified: buildDate,
      changeFrequency: 'monthly' as const,
      priority: p.difficulty === 'Easy' ? 0.75 : p.difficulty === 'Medium' ? 0.7 : 0.65,
    }))

  const gfgPages: MetadataRoute.Sitemap = getAllGfgProblems()
    .filter(p => isGfgPageIndexable(p, p.slug))
    .map(p => ({
      url: `${SITE_URL}/gfg/${p.slug}`,
      lastModified: buildDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  const systemDesignPages: MetadataRoute.Sitemap = getAllSystemDesignArticles().map(a => ({
    url: `${SITE_URL}/system-design/${a.slug}`,
    lastModified: buildDate,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  return [...staticPages, ...topicPages, ...systemDesignPages, ...problemPages, { url: `${SITE_URL}/gfg`, lastModified: buildDate, changeFrequency: 'daily' as const, priority: 0.95 }, ...gfgPages]
}
