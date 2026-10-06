import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { pages } from '@/lib/content';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((p) => ({
    url: p.path === '/' ? site.url : `${site.url}${p.path}`,
    lastModified: p.updated,
    changeFrequency: 'monthly',
    priority: p.path === '/' ? 1 : 0.8,
  }));
}
