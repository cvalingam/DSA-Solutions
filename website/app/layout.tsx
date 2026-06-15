import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ThemeProvider from '@/components/ThemeProvider'
import { SITE_URL } from '@/lib/constants'
import { GTMScript, GTMNoScript } from '@/components/GoogleTagManager'
import { buildOrganizationSchema, getSiteStats } from '@/lib/seo'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const { lcCount, gfgCount, total } = getSiteStats()

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `DSA Solutions — ${lcCount}+ LeetCode C# & ${gfgCount}+ GFG Java`,
    template: '%s | DSA Solutions',
  },
  description:
    `Clean, readable solutions to ${lcCount}+ LeetCode and ${gfgCount}+ GeeksforGeeks problems with explanations, complexity analysis, and interview prep guides. ${total}+ total solutions.`,
  keywords: ['LeetCode', 'GeeksforGeeks', 'GFG', 'C#', 'csharp', 'Java', '.NET', 'solutions', 'interview prep', 'algorithms', 'data structures'],
  authors: [{ name: 'Sivalingam Ramasamy', url: 'https://github.com/cvalingam' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'DSA Solutions',
    url: SITE_URL,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'DSA Solutions' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = buildOrganizationSchema()

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* Anti-flash: apply saved theme before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t===null&&d)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5486715116636186"
          crossOrigin="anonymous"
        />
        {/* Google Tag Manager */}
        <GTMScript />
      </head>
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 antialiased flex flex-col min-h-screen font-sans transition-colors duration-200">
        {/* Google Tag Manager (noscript) */}
        <GTMNoScript />
        <ThemeProvider>
          <Header />
          <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 pt-20 pb-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
