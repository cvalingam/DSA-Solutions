import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Works — live projects by Sivalingam Ramasamy'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <div style={{ color: 'rgba(199,210,254,1)', fontSize: 28, fontWeight: 600, marginBottom: 20 }}>
          DSA Solutions
        </div>
        <div
          style={{
            color: 'white',
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          Works
        </div>
        <div style={{ color: 'rgba(199,210,254,1)', fontSize: 28, fontWeight: 400, maxWidth: 900 }}>
          NEET MDS · Skin Klove · Steel Express · DSA Solutions · and more
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
