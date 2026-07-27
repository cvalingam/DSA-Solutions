import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of Use for DSA Solutions (dsasolved.com). Read about permitted use, disclaimers, and your rights.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of Use - DSA Solutions',
    description: 'Terms of Use for DSA Solutions (dsasolved.com).',
    url: '/terms',
    type: 'website',
  },
}

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Terms of Use</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">Last updated: April 6, 2026</p>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-gray-700 dark:text-gray-300">

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using <strong>DSA Solutions</strong> (&quot;the Site&quot;, available at{' '}
            <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">dsasolved.com</Link>
            ), you agree to be bound by these Terms of Use. If you do not agree, please do not use the Site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">2. Purpose of the Site</h2>
          <p>
            DSA Solutions provides educational programming solutions to LeetCode (C#) and GeeksForGeeks (Java)
            problems for learning and interview preparation purposes. The solutions are intended to help developers
            understand data structures and algorithms (DSA) concepts - not to be copied verbatim into professional
            assessments or competitions where such use is prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">3. Intellectual Property</h2>
          <p>
            The source code solutions on this Site are published under the{' '}
            <a
              href="https://github.com/cvalingam/DSA-Solutions/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              MIT License
            </a>
            . You are free to use, copy, modify, and distribute the code with attribution. The Site&apos;s design,
            written content, and editorial commentary are &copy; Sivalingam Ramasamy and may not be reproduced
            without permission.
          </p>
          <p className="mt-3">
            Problem statements are the property of LeetCode and GeeksForGeeks respectively. This site does not
            reproduce problem statements - only original solutions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">4. Permitted Use</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Study and learn from the solutions for personal education</li>
            <li>Reference solutions while practicing on LeetCode or GeeksForGeeks</li>
            <li>Use code snippets in your own projects under the MIT License</li>
            <li>Share links to this Site</li>
          </ul>
          <p className="mt-3 font-medium">Not permitted:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Reproducing substantial portions of the Site&apos;s content without attribution</li>
            <li>Using solutions in academic or professional assessments that prohibit external assistance</li>
            <li>Scraping or automated bulk-downloading of content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">5. Disclaimer of Warranties</h2>
          <p>
            The Site is provided <strong>&quot;as is&quot;</strong> without warranty of any kind. While we strive for
            correctness, we do not guarantee that every solution is optimal, free of bugs, or passes all
            test cases on any particular platform. Solutions may reflect specific platform versions and
            constraints at the time they were written.
          </p>
          <p className="mt-3">
            Use solutions as a learning aid, not as a definitive or production-ready implementation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Sivalingam Ramasamy shall not be liable for any
            direct, indirect, incidental, special, or consequential damages arising from your use of
            the Site or reliance on any content published here.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">7. Third-Party Services</h2>
          <p>The Site uses the following third-party services. Your use of the Site implies acceptance of their respective policies:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>
              <strong>Google AdSense</strong> - displays advertisements. See{' '}
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Google&apos;s ad policy</a>.
            </li>
            <li>
              <strong>Google Analytics (GA4)</strong> - anonymous usage analytics. See{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Google Privacy Policy</a>.
            </li>
            <li>
              <strong>Microsoft Clarity</strong> - anonymous session analytics. See{' '}
              <a href="https://clarity.microsoft.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Clarity Privacy Policy</a>.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">8. Links to Other Sites</h2>
          <p>
            The Site may contain links to external sites (LeetCode, GeeksForGeeks, GitHub, etc.).
            We are not responsible for the content, accuracy, or privacy practices of those sites.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">9. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the Site after changes
            are posted constitutes your acceptance of the revised Terms. The &quot;Last updated&quot; date
            at the top of this page reflects the most recent revision.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">10. Contact</h2>
          <p>
            Questions about these Terms? Reach us via the{' '}
            <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">Contact page</Link>.
          </p>
        </section>

      </div>
    </main>
  )
}
