import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DSA Solutions',
    short_name: 'DSA Solutions',
    description:
      'LeetCode C# and GeeksforGeeks Java solutions with explanations and system design interview guides.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#4f46e5',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    scope: SITE_URL,
    lang: 'en',
    categories: ['education', 'productivity'],
  }
}
