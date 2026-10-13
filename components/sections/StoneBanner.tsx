import Link from 'next/link';
import { Photo } from '@/components/site/Photo';
import { materials, money, pricesUpdated } from '@/content/pricing';
import { Split } from '@/components/fx/Split';

// Recycled stone, sold off a departures board. Each price scrambles into place when the
// board comes into view (MotionRoot, [data-scramble]); the final text is in the HTML.
export function StoneBanner() {
  const base = materials.find((m) => m.id === '21a')!;
  const asOf = new Date(`${pricesUpdated}T12:00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return (
    <section className="relative bg-concrete py-24 lg:py-36" aria-labelledby="stone-title">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p className="label inline-block bg-ink px-2.5 py-1.5 text-accent" data-reveal>
            Recycled stone for sale
          </p>
          <h2 id="stone-title" className="h-section mt-8 lg:text-[clamp(2.3rem,4.4vw,4.5rem)]" data-reveal aria-label="Crushed concrete, stone and rip rap">
            <Split text="Crushed concrete, stone and rip rap" />
          </h2>
          <p className="lede mt-6 text-muted" data-reveal>
            The concrete we take out comes back as stone that meets or exceeds VDOT specs, for pickup or local delivery. 21A crusher run is{' '}
            <strong className="num font-semibold text-ink">{money(base.lines[0].price)}/ton</strong> picked up at the yard.
          </p>
          <Link href="/buy" className="btn btn-primary mt-10" data-reveal>
            See stone prices
          </Link>
          <div className="relative mt-14 aspect-[16/10] overflow-hidden" data-reveal="blocks">
            <Photo name="excavator-crushing-concrete" sizes="(min-width: 1024px) 38vw, 100vw" className="photo absolute inset-0 h-full w-full scale-[1.14] object-cover" parallax />
          </div>
        </div>

        <div className="on-ink self-start bg-ink p-2 text-paper lg:col-span-6 lg:col-start-7 lg:mt-24" data-reveal>
          <div className="label flex items-center justify-between border-b border-line-dark px-4 py-4 text-dust">
            <span>
              <span className="text-accent">●</span> Yard prices
            </span>
            <span>Per ton, from · {asOf}</span>
          </div>
          <ul>
            {materials.map((m) => (
              <li key={m.id} className="flex items-baseline justify-between gap-6 border-b border-line-dark px-4 py-5 last:border-b-0">
                <span className="font-mono text-[0.95rem] uppercase tracking-[0.06em]">{m.name}</span>
                <span className="num font-mono text-[clamp(1.5rem,2.4vw,2.1rem)] font-medium text-accent" data-scramble>
                  {money(Math.min(...m.lines.map((l) => l.price)))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
