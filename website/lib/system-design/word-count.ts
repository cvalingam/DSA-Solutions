import type { ArticleBlock } from './types'

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

export function countArticleWords(sections: ArticleBlock[]): number {
  let total = 0
  for (const s of sections) {
    switch (s.type) {
      case 'p':
        total += countWords(s.text)
        break
      case 'h2':
      case 'h3':
        total += countWords(s.text)
        break
      case 'callout':
        total += countWords(s.title) + countWords(s.text)
        break
      case 'ul':
      case 'ol':
        total += countWords(s.items.join(' '))
        break
      case 'table':
        total += countWords(s.headers.join(' '))
        total += countWords(s.rows.flat().join(' '))
        break
    }
  }
  return total
}

/** ~200 words/minute for technical reading. */
export function estimateReadMinutes(sections: ArticleBlock[]): number {
  return Math.max(6, Math.ceil(countArticleWords(sections) / 200))
}
