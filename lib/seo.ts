import type { Metadata } from 'next';
import { site, mainLocation, formatAddress, type Location } from '@/lib/site';
import type { Faq } from '@/content/faqs';
import type { Material } from '@/content/pricing';

type MetaInput = {
  title: string; // full title, 50–60 characters, suffix included
  description: string; // 140–160 characters
  path: string; // '/' or '/about' (no trailing slash)
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
};

export function buildMetadata({ title, description, path, image = '/og/default.png', type = 'website', noindex }: MetaInput): Metadata {
  const url = path === '/' ? site.url : `${site.url}${path}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type,
      locale: 'en_US',
      images: [{ url: image, width: 1200, height: 630, alt: `${site.name}, demolition contractor since ${site.foundingYear}` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

const businessId = `${site.url}/#business`;

function postalAddress(l: Location) {
  return {
    '@type': 'PostalAddress',
    streetAddress: l.street,
    addressLocality: l.city,
    addressRegion: l.state,
    ...(l.zip ? { postalCode: l.zip } : {}),
    addressCountry: 'US',
  };
}

const openingHours = site.hours.map((h) => ({
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  opens: h.open,
  closes: h.close,
}));

export function businessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': businessId,
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    logo: `${site.url}/icon.png`,
    image: `${site.url}/og/default.png`,
    telephone: '+1-757-472-4142',
    email: site.email,
    foundingDate: String(site.foundingYear),
    address: postalAddress(mainLocation),
    openingHoursSpecification: openingHours,
    areaServed: site.areaServed.map((name) => ({ '@type': 'State', name })),
    paymentAccepted: site.payments.join(', '),
    knowsAbout: ['Demolition', 'Interior demolition', 'Concrete recycling', 'Site clearing'],
    memberOf: site.memberships.map((name) => ({ '@type': 'Organization', name })),
    department: site.locations.map((l) => ({
      '@type': 'HomeAndConstructionBusiness',
      name: l.name,
      address: postalAddress(l),
      telephone: l.id === 'mhr' ? '+1-757-574-1006' : '+1-757-472-4142',
    })),
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    name: site.name,
    url: site.url,
    publisher: { '@id': businessId },
    inLanguage: 'en-US',
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.path === '/' ? site.url : `${site.url}${it.path}`,
    })),
  };
}

export function faqSchema(items: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function serviceSchema(services: { name: string; description: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': services.map((s) => ({
      '@type': 'Service',
      name: s.name,
      serviceType: s.name,
      description: s.description,
      provider: { '@id': businessId },
      areaServed: site.areaServed.map((name) => ({ '@type': 'State', name })),
    })),
  };
}

export function productSchema(materials: Material[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': materials.map((m) => ({
      '@type': 'Product',
      name: m.name,
      description: `${m.description}. ${m.use}.`,
      brand: { '@id': businessId },
      offers: m.lines.map((line) => ({
        '@type': 'Offer',
        name: `${m.name}, ${line.label}`,
        price: line.price.toFixed(2),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        unitText: 'per ton',
        seller: { '@id': businessId },
      })),
    })),
  };
}

export { formatAddress };
