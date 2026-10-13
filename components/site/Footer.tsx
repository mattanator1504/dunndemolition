import Link from 'next/link';
import BrickWordmarkFooter from '@/components/ui/brick-wordmark-footer';
import { site, nav, formatAddress, mapsUrl } from '@/lib/site';

// The footer: company line, pages, phones and yards, then DUNN laid in bricks along the bottom.
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <BrickWordmarkFooter
      wordmark="DUNN"
      label="Dunn Demolition"
      meta={[
        `Since ${site.foundingYear} · ${site.license}`,
        'Fully insured, including demolition coverage',
        `Member, ${site.memberships[0]}`,
      ]}
      columns={[
        {
          title: 'Pages',
          links: [...nav.map((n) => ({ label: n.label, href: n.href })), { label: 'Privacy', href: '/privacy' }],
        },
        {
          title: 'Call or email',
          links: [
            { label: site.phone.display, href: site.phone.href, note: `${site.phone.contact}: ${site.phone.role.toLowerCase()}` },
            { label: site.recyclingPhone.display, href: site.recyclingPhone.href, note: `${site.recyclingPhone.contact}: ${site.recyclingPhone.role}` },
            { label: site.email, href: `mailto:${site.email}` },
            { label: `${site.hours[0].days}, ${site.hours[0].label}` },
          ],
        },
        {
          title: 'Yards',
          links: site.locations.map((l) => ({ label: l.name, href: mapsUrl(l), note: formatAddress(l), external: true })),
        },
      ]}
      legal={
        <>
          © {year} {site.name}. We accept {site.payments.slice(0, -1).join(', ')} and {site.payments.at(-1)}. Stock photos from Unsplash: they show the kind of
          work we do, not Dunn job sites. <Link href="/privacy">Privacy</Link>
        </>
      }
    />
  );
}
