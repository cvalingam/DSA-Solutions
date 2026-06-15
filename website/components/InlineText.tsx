import Link from 'next/link'
import type { ReactNode } from 'react'

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g

/** Renders plain text with optional [label](/path) markdown-style internal links. */
export default function InlineText({ text, className = '' }: { text: string; className?: string }) {
  const parts: ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index))
    }
    const href = match[2]
    const isInternal = href.startsWith('/')
    if (isInternal) {
      parts.push(
        <Link
          key={key++}
          href={href}
          className="text-violet-600 dark:text-violet-400 hover:underline font-medium"
        >
          {match[1]}
        </Link>,
      )
    } else {
      parts.push(
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-600 dark:text-violet-400 hover:underline font-medium"
        >
          {match[1]}
        </a>,
      )
    }
    last = match.index + match[0].length
  }

  if (last < text.length) parts.push(text.slice(last))

  return <span className={className}>{parts}</span>
}
