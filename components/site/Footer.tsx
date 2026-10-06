import Link from 'next/link';
import { Logo } from './Logo';
import { site, nav, formatAddress, mapsUrl } from '@/lib/site';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-ink bg-ink text-paper">
      <div className="hazard h-3" aria-hidden="true" />
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-dust">
            Demolition, site clearing and concrete recycling across Virginia, North Carolina and Maryland since {site.foundingYear}.
          </p>
          <ul className="mt-6 space-y-1 text-sm text-dust">
            <li>{site.license}</li>
            <li>Fully insured, including demolition coverage</li>
            <li>Member, {site.memberships[0]}</li>
          </ul>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-accent">Pages</h2>
          <ul className="mt-4 space-y-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-block py-1.5 hover:text-accent hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacy" className="inline-block py-1.5 hover:text-accent hover:underline">
                Privacy
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-accent">Call or email</h2>
          <ul className="mt-4 space-y-4">
            <li>
              <a href={site.phone.href} className="num block py-1 font-display text-xl font-bold hover:text-accent">
                {site.phone.display}
              </a>
              <span className="text-sm text-dust">
                {site.phone.contact}: {site.phone.role.toLowerCase()}
              </span>
            </li>
            <li>
              <a href={site.recyclingPhone.href} className="num block py-1 font-display text-xl font-bold hover:text-accent">
                {site.recyclingPhone.display}
              </a>
              <span className="text-sm text-dust">
                {site.recyclingPhone.contact}: {site.recyclingPhone.role}
              </span>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="inline-block break-all py-1 underline decoration-1 underline-offset-4 hover:text-accent">
                {site.email}
              </a>
            </li>
            <li className="text-sm text-dust">
              {site.hours[0].days}, {site.hours[0].label}
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-accent">Yards</h2>
          <ul className="mt-4 space-y-4">
            {site.locations.map((l) => (
              <li key={l.id}>
                <span className="block font-bold">{l.name}</span>
                <a href={mapsUrl(l)} target="_blank" rel="noopener" className="text-dust underline decoration-1 underline-offset-4 hover:text-paper">
                  {formatAddress(l)}
                  <span className="sr-only"> (opens Google Maps)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line-dark">
        <div className="container-x flex flex-col gap-2 py-6 text-sm text-dust md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}. We accept {site.payments.slice(0, -1).join(', ')} and {site.payments.at(-1)}.
          </p>
          <p>Stock photos from Unsplash. They show the kind of work we do, not Dunn job sites.</p>
        </div>
      </div>
    </footer>
  );
}
