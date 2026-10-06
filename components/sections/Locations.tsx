import { site, formatAddress, mapsUrl } from '@/lib/site';

// The three yards, with directions links (no map embed: technical-seo.md §3).
export function Locations({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {site.locations.map((l, i) => (
        <li key={l.id} className="slab flex flex-col p-6" data-reveal style={{ '--i': i } as React.CSSProperties}>
          <h3 className="h-card">{l.name}</h3>
          <p className={`mt-3 ${tone === 'dark' ? 'text-paper' : ''}`}>{formatAddress(l)}</p>
          <p className={`mt-1 text-sm ${tone === 'dark' ? 'text-dust' : 'text-muted'}`}>{l.note}</p>
          <a href={mapsUrl(l)} target="_blank" rel="noopener" className="link-under mt-auto pt-5 font-display text-sm font-bold uppercase tracking-wide">
            Directions to {l.street}
            <span className="sr-only"> (opens Google Maps)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
