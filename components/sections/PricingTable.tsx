import { materials, tipFees, money, pricesUpdated } from '@/content/pricing';
import { site } from '@/lib/site';

// The price guide as a real table (on-page-seo.md §11). Prices from content/pricing.ts only.
export function PricingTable() {
  const updated = new Date(pricesUpdated + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  return (
    <div>
      <div className="slab overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left">
          <caption className="sr-only">Recycled stone and rip rap prices per ton, with freight</caption>
          <thead>
            <tr className="bg-ink text-paper">
              <th scope="col" className="p-4 font-display text-sm font-bold uppercase tracking-wide">
                Material
              </th>
              <th scope="col" className="p-4 font-display text-sm font-bold uppercase tracking-wide">
                Price
              </th>
              <th scope="col" className="p-4 font-display text-sm font-bold uppercase tracking-wide">
                Freight
              </th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m) => (
              <tr key={m.id} id={m.id} className="border-t-2 border-ink align-top">
                <th scope="row" className="p-4 font-normal">
                  <span className="block font-display text-lg font-bold uppercase leading-tight">{m.name}</span>
                  <span className="mt-1 block text-sm text-muted">{m.description}</span>
                  {m.recycled && <span className="mt-2 inline-block bg-accent px-2 py-0.5 text-xs font-bold uppercase tracking-wide">Recycled</span>}
                </th>
                <td className="p-4">
                  <ul className="space-y-1">
                    {m.lines.map((l) => (
                      <li key={l.label} className="num flex justify-between gap-6">
                        <span className="text-muted">{l.label}</span>
                        <span className="font-display text-lg font-bold">{money(l.price)}/ton</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="num p-4 text-sm">{m.freight ? `${money(m.freight.price)} ${m.freight.note}` : 'Included in delivery price'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-muted">
        Prices as listed on {updated}. Call {site.recyclingPhone.contact} at{' '}
        <a href={site.recyclingPhone.href} className="link-under num text-ink">
          {site.recyclingPhone.display}
        </a>{' '}
        to confirm today’s price and delivery. Tip fees:{' '}
        {tipFees.map((t, i) => (
          <span key={t.material}>
            {t.material.toLowerCase()} {t.fee.toLowerCase()}
            {i < tipFees.length - 1 ? ', ' : '.'}
          </span>
        ))}
      </p>
    </div>
  );
}
