import { ImageResponse } from 'next/og'
import { getProblemBySlug } from '@/lib/problems'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'LeetCode solution'

const DIFF_COLOR: Record<string, string> = {
  Easy: '#059669',
  Medium: '#d97706',
  Hard: '#dc2626',
  Unknown: '#6b7280',
}

export default function OgImage({ params }: { params: { slug: string } }) {
  const problem = getProblemBySlug(params.slug)
  const title = problem ? `${problem.number}. ${problem.title}` : 'LeetCode Solution'
  const difficulty = problem?.difficulty ?? 'Unknown'
  const lang = problem?.primaryExt === 'cs' ? 'C#' : (problem?.primaryExt?.toUpperCase() ?? 'Code')
  const accent = DIFF_COLOR[difficulty] ?? DIFF_COLOR.Unknown

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              background: accent,
              color: 'white',
              fontSize: '22px',
              fontWeight: 700,
              padding: '8px 20px',
              borderRadius: '999px',
            }}
          >
            {difficulty}
          </div>
          <div style={{ color: '#c7d2fe', fontSize: '24px', fontWeight: 600 }}>{lang}</div>
        </div>
        <div style={{ color: 'white', fontSize: '52px', fontWeight: 800, lineHeight: 1.15, maxWidth: '1000px' }}>
          {title}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#a5b4fc', fontSize: '26px' }}>LeetCode Solution</div>
          <div style={{ color: 'white', fontSize: '24px', fontWeight: 700 }}>dsasolved.com</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
