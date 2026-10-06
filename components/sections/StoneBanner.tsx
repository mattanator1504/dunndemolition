import Link from 'next/link';
import { Photo } from '@/components/site/Photo';
import { materials, money } from '@/content/pricing';

// Full-bleed band selling recycled stone, linking to /buy.
export function StoneBanner() {
  const base = materials.find((m) => m.id === '21a')!;
  return (
    <section className="on-ink relative isolate overflow-hidden bg-ink text-paper" aria-labelledby="stone-title">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Photo name="excavator-crushing-concrete" alt="" sizes="100vw" className="photo absolute inset-0 h-full w-full scale-[1.14] object-cover opacity-40" parallax />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
      </div>
      <div className="container-x py-24 lg:py-32">
        <div className="max-w-2xl" data-reveal>
          <p className="inline-block bg-accent px-3 py-1.5 font-display text-sm font-bold uppercase tracking-wide text-ink">Recycled stone for sale</p>
          <h2 id="stone-title" className="h-section mt-6">
            Crushed concrete, stone and rip rap
          </h2>
          <p className="lede mt-6 text-dust">
            The concrete we take out comes back as stone that meets or exceeds VDOT specs, for pickup or local delivery. 21A
            crusher run is{' '}
            <strong className="num text-paper">
              {money(base.lines[0].price)}/ton
            </strong>{' '}
            picked up at the yard.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/buy" className="btn btn-primary">
              See stone prices
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
