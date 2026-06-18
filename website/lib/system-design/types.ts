export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; title: string; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }

export interface SystemDesignArticle {
  slug: string
  title: string
  description: string
  readMinutes: number
  published: string
  category: 'fundamentals' | 'case-study' | 'bridge'
  seoKeywords?: string[]
  sections: ArticleBlock[]
}
