import type { Metadata, Viewport } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { site } from '@/lib/site';
import { businessSchema, websiteSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { SkipLink } from '@/components/site/SkipLink';
import { MotionRoot } from '@/components/motion/MotionRoot';
import { motionBootScript } from '@/components/motion/motionBoot';
import { DustFX } from '@/components/fx/DustFX';
import { RouteCurtain } from '@/components/fx/RouteCurtain';

// Two variable families = two font files (technical-seo.md §3).
// Archivo carries the width axis: expanded for display type, normal width for body.
const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jbmono', display: 'swap' });

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
  themeColor: '#121211',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${archivo.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
      </head>
      <body>
        <SkipLink />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MotionRoot />
        <DustFX />
        <RouteCurtain />
        <JsonLd data={businessSchema()} />
        <JsonLd data={websiteSchema()} />
      </body>
    </html>
  );
}
