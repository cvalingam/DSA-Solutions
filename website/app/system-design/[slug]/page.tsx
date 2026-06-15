import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'
import { AUTHOR } from '@/lib/seo'
import {
  getAllSystemDesignArticles,
  getSystemDesignArticle,
} from '@/lib/system-design'
import SystemDesignArticleView from '@/components/SystemDesignArticle'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return getAllSystemDesignArticles().map(a => ({ slug: a.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getSystemDesignArticle(params.slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/system-design/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `/system-design/${article.slug}`,
      type: 'article',
      publishedTime: article.published,
      authors: [AUTHOR.name],
    },
  }
}

export default function SystemDesignArticlePage({ params }: Props) {
  const article = getSystemDesignArticle(params.slug)
  if (!article) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
    url: `${SITE_URL}/system-design/${article.slug}`,
    datePublished: article.published,
    dateModified: article.published,
    image: `${SITE_URL}/opengraph-image`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SystemDesignArticleView article={article} />
    </>
  )
}
