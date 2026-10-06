import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, DM_Sans } from 'next/font/google';
import './globals.css';
import { site } from '@/lib/site';
import { businessSchema, websiteSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { SkipLink } from '@/components/site/SkipLink';
import { MotionRoot } from '@/components/motion/MotionRoot';
import { motionBootScript } from '@/components/motion/motionBoot';

// Two variable families = two font files (technical-seo.md §3).
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  applicationName: site.name,
  formatDetection: { telephone: false },
  openGraph: { siteName: site.name, locale: 'en_US', type: 'website', images: ['/og/default.png'] },
  twitter: { card: 'summary_large_image' },
  // verification: { google: '[FILL]' },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${spaceGrotesk.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
      </head>
      <body>
        <SkipLink />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MotionRoot />
        <JsonLd data={businessSchema()} />
        <JsonLd data={websiteSchema()} />
      </body>
    </html>
  );
}
