// Every indexable page, read by the sitemap (and by phase 2 loaders for services,
// service areas and blog posts as they're added). /privacy is noindex, so it's left out.
export const pages: { path: string; updated: string }[] = [
  { path: '/', updated: '2026-10-06' },
  { path: '/about', updated: '2026-10-06' },
  { path: '/services', updated: '2026-10-06' },
  { path: '/faqs', updated: '2026-10-06' },
  { path: '/buy', updated: '2026-10-06' },
  { path: '/contact', updated: '2026-10-06' },
];
