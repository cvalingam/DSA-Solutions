export type WorkProject = {
  id: string
  title: string
  description: string
  url: string
  github?: string
  tags: string[]
}

/** Curated portfolio of live projects (custom domains preferred). */
export const WORKS: WorkProject[] = [
  {
    id: 'neet-mds-image-sizer',
    title: 'NEET MDS Image Sizer',
    description:
      'Browser-only tool that crops and encodes passport, postcard, signature, and thumb images to Tamil Nadu / NEET MDS portal sizes and file-size limits.',
    url: 'https://neet-mds-image-sizer.vercel.app',
    tags: ['Next.js', 'Canvas', 'Client-side'],
  },
  {
    id: 'dsa-solutions',
    title: 'DSA Solutions',
    description:
      'LeetCode C# and GeeksforGeeks Java solutions with step-by-step explanations, system design guides, and interview prep.',
    url: 'https://dsasolved.com',
    github: 'https://github.com/cvalingam/DSA-Solutions',
    tags: ['Next.js', 'C#', 'Java', 'Interview prep'],
  },
  {
    id: 'skin-klove',
    title: 'Skin Klove',
    description:
      'Marketing site for Skin Klove — clinic branding and patient-facing web presence.',
    url: 'https://www.skinklove.com',
    tags: ['Next.js', 'Marketing'],
  },
  {
    id: 'clinic-os',
    title: 'Clinic OS',
    description:
      'Clinic operations frontend for Skin Klove — appointment and practice workflows.',
    url: 'https://app.skinklove.com',
    tags: ['Next.js', 'SaaS'],
  },
  {
    id: 'invoice-generator',
    title: 'Invoice Generator',
    description:
      'Web app for creating and downloading invoices quickly.',
    url: 'https://invoice-generator-eight-lilac.vercel.app',
    tags: ['Next.js', 'PDF'],
  },
  {
    id: 'gst-bot',
    title: 'GST Bot',
    description:
      'GST-focused helper tool for Indian tax workflows.',
    url: 'https://gst-bot.vercel.app',
    tags: ['Next.js', 'GST'],
  },
  {
    id: 'ish-payload',
    title: 'ISH Payload',
    description:
      'Steel Express Solution — production Payload CMS site for industrial / logistics content.',
    url: 'https://www.steelxpresssolution.com',
    tags: ['Next.js', 'Payload CMS'],
  },
]
