import { ImageResponse } from 'next/og'
import { getGfgProblemBySlug } from '@/lib/gfg-problems'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'GFG solution'

export default function OgImage({ params }: { params: { slug: string } }) {
  const problem = getGfgProblemBySlug(params.slug)
  const title = problem?.title ?? 'GFG Solution'

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)',
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
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '22px',
              fontWeight: 700,
              padding: '8px 20px',
              borderRadius: '999px',
            }}
          >
            Java
          </div>
          <div style={{ color: '#a7f3d0', fontSize: '24px', fontWeight: 600 }}>GeeksforGeeks</div>
        </div>
        <div style={{ color: 'white', fontSize: '52px', fontWeight: 800, lineHeight: 1.15, maxWidth: '1000px' }}>
          {title}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#d1fae5', fontSize: '26px' }}>GFG Solution</div>
          <div style={{ color: 'white', fontSize: '24px', fontWeight: 700 }}>dsasolved.com</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
