import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for DSA Solutions (dsasolved.com).',
  alternates: { canonical: '/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy - DSA Solutions',
    description: 'Privacy Policy for DSA Solutions (dsasolved.com).',
    url: '/privacy-policy',
    type: 'website',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-slate-400 text-sm mb-8"><em>Last updated: April 2026</em></p>

      <p className="text-slate-600 mb-6">
        This Privacy Policy describes how DSA Solutions (dsasolved.com) collects, uses, and
        shares information when you visit.
      </p>

      <Section title="Information we collect">
        <p>
          We do not directly collect personal information. However, third-party services used by
          this site may collect data automatically, including pages visited, browser type, operating
          system, and approximate geographic location.
        </p>
      </Section>

      <Section title="Third-party advertising (Google AdSense)">
        <p>
          This site uses Google AdSense to display advertisements. Google, as a third-party vendor,
          uses cookies to serve ads based on your prior visits to this and other websites. You can
          opt out of personalised advertising by visiting{' '}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Google Ads Settings
          </a>.
        </p>
      </Section>

      <Section title="Analytics (Google Analytics 4)">
        <p>
          This site uses Google Analytics 4, loaded via Google Tag Manager, to collect anonymised
          usage data such as pages visited, session duration, and geographic region. No personally
          identifiable information is collected. You can opt out via{' '}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Google Analytics Opt-out
          </a>.
        </p>
      </Section>

      <Section title="Analytics (Microsoft Clarity)">
        <p>
          This site uses{' '}
          <a href="https://clarity.microsoft.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Microsoft Clarity</a>
          {' '}(loaded via Google Tag Manager) to understand how visitors interact with the site.
          Clarity may collect session recordings, heatmaps, click maps, and aggregated usage data.
          This data does not personally identify you. You can learn more in{' '}
          <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Microsoft&apos;s Privacy Statement
          </a>.
        </p>
      </Section>

      <Section title="Tag management (Google Tag Manager)">        
        <p>
          This site uses Google Tag Manager to manage and deploy analytics and tracking scripts.
          GTM itself does not collect personal data but may load third-party tags (GA4, Clarity)
          that collect usage data as described above.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          Cookies may be placed by Google AdSense or analytics providers. You can control cookies
          through your browser settings.
        </p>
      </Section>

      <Section title="External links">
        <p>
          This site contains links to LeetCode, GitHub, and other external sites. We are not
          responsible for their privacy practices.
        </p>
      </Section>

      <Section title="Children's privacy">
        <p>
          This site is not directed at children under 13 and we do not knowingly collect personal
          information from children.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          If you have questions about this policy, please use the{' '}
          <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">Contact page</Link>.
        </p>
      </Section>

      <div className="mt-10">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to all problems
        </Link>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="text-slate-600">{children}</div>
    </div>
  )
}
