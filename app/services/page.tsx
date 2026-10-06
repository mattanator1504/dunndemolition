import Link from 'next/link';
import { buildMetadata, serviceSchema } from '@/lib/seo';
import { site } from '@/lib/site';
import { services } from '@/content/services';
import { materials } from '@/content/pricing';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/sections/PageHero';
import { SectionHead } from '@/components/sections/SectionHead';
import { Photo } from '@/components/site/Photo';
import { ServiceIcon } from '@/components/sections/ServiceIcon';
import { Locations } from '@/components/sections/Locations';
import { QuoteCta } from '@/components/sections/QuoteCta';

// Primary keyword: "demolition services Virginia Beach" (provisional, see references/used-keywords.md)
export const metadata = buildMetadata({
  title: 'Demolition Services in Virginia Beach, VA | Dunn Demolition',
  description:
    'Demolition services in Virginia Beach and Hampton Roads: houses, commercial, gut outs, industrial, site clearing, tanks, pools and concrete recycling.',
  path: '/services',
});

export default function ServicesPage() {
  const demolition = services.filter((s) => s.group === 'demolition');
  const siteWork = services.filter((s) => s.group === 'site');
  const recycling = services.find((s) => s.id === 'concrete-recycling')!;
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Services', path: '/services' }]}
        title="Demolition services, start to finish"
        lede={
          <p>
            Demolition services across Virginia Beach, Chesapeake and Hampton Roads, from a shed to an industrial plant. We take it down, haul it off
            and recycle what we can.
          </p>
        }
        image="excavator-commercial-teardown"
      />

      <section className="bg-paper py-20 lg:py-28" aria-labelledby="demo-title">
        <div className="container-x">
          <SectionHead id="demo-title" title="Demolition" intro="Residential, commercial and industrial structures of every size." />
          <ul className="mt-14 grid gap-10 md:grid-cols-2 lg:gap-12">
            {demolition.map((s, i) => (
              <li key={s.id} id={s.id} className="scroll-mt-24" data-reveal style={{ '--i': i % 2 } as React.CSSProperties}>
                <article className="slab h-full">
                  <div className="relative aspect-[16/9] overflow-hidden border-b-2 border-ink">
                    <Photo name={s.image} sizes="(min-width: 768px) 45vw, 100vw" className="photo absolute inset-0 h-full w-full scale-[1.14] object-cover" parallax />
                  </div>
                  <div className="p-6 lg:p-8">
                    <h3 className="h-card text-[1.6rem]">{s.name}</h3>
                    <p className="mt-3 text-muted">{s.body}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="on-ink bg-ink py-20 text-paper lg:py-28" aria-labelledby="site-title">
        <div className="container-x">
          <SectionHead id="site-title" title="Site work and removals" intro="So you only need one contractor." />
          <ul className="mt-14 grid gap-6 md:grid-cols-2">
            {siteWork.map((s, i) => (
              <li key={s.id} id={s.id} className="slab scroll-mt-24 p-6 lg:p-8" data-reveal style={{ '--i': i % 2 } as React.CSSProperties}>
                <span className="flex h-12 w-12 items-center justify-center bg-accent text-ink">
                  <ServiceIcon id={s.id} />
                </span>
                <h3 className="h-card mt-5">{s.name}</h3>
                <p className="mt-3 text-dust">{s.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id={recycling.id} className="scroll-mt-20 bg-concrete py-20 lg:py-28" aria-labelledby="recycle-title">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHead id="recycle-title" title="Concrete, brick and block recycling" />
            <div className="prose-dunn mt-6 text-muted" data-reveal>
              <p>
                We recycle {site.stats.recycledRange} of what we remove and sell the crushed stone. It meets or exceeds VDOT specs and comes with an engineered
                proctor.
              </p>
              <p>Drop off clean concrete for free. Red brick carries a $5/ton tip fee.</p>
            </div>
            <ul className="mt-8 flex flex-wrap gap-3" data-reveal>
              {materials.map((m) => (
                <li key={m.id}>
                  <Link href={`/buy#${m.id}`} className="inline-block border-2 border-ink bg-paper px-4 py-2 font-display text-sm font-bold uppercase hover:bg-accent">
                    {m.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/buy" className="btn btn-primary mt-8" data-reveal>
              Buy recycled stone
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden border-2 border-ink shadow-[10px_10px_0_0_var(--color-ink)]" data-reveal>
            <Photo name="concrete-rubble-stockpile" sizes="(min-width: 1024px) 45vw, 100vw" className="photo absolute inset-0 h-full w-full scale-[1.14] object-cover" parallax />
          </div>
        </div>
      </section>

      <section className="bg-paper py-20 lg:py-28" aria-labelledby="equipment-title">
        <div className="container-x">
          <SectionHead id="equipment-title" title="Heavy-duty equipment" intro="JCB and Caterpillar excavators, chosen for efficiency and reliability." />
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { t: 'Hydraulic thumbs', b: 'Precise control, faster sorting, safer demolition.' },
              { t: 'Constant cleanup', b: 'Dump trailers and trucks haul debris as we go.' },
              { t: 'Containers', b: 'Drop-off and pick-up for your own disposal needs.' },
            ].map((e, i) => (
              <li key={e.t} className="slab p-6" data-reveal style={{ '--i': i } as React.CSSProperties}>
                <h3 className="h-card">{e.t}</h3>
                <p className="mt-3 text-muted">{e.b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="on-ink bg-ink py-20 text-paper lg:py-28" aria-labelledby="locations-title">
        <div className="container-x">
          <SectionHead id="locations-title" title="Yards, hours and who to call" intro="Three yards in Virginia Beach and Chesapeake." />
          <div className="mt-12">
            <Locations tone="dark" />
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="slab p-6" data-reveal>
              <h3 className="h-card">Hours</h3>
              <p className="mt-3">
                {site.hours[0].days}: {site.hours[0].label}
              </p>
              <p className="mt-1 text-sm text-dust">All locations</p>
            </div>
            <div className="slab p-6" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
              <h3 className="h-card">Demolition and stone crushing</h3>
              <a href={site.phone.href} className="num mt-3 block font-display text-2xl font-bold hover:text-accent">
                {site.phone.display}
              </a>
              <p className="text-sm text-dust">Ask for {site.phone.contact}</p>
            </div>
            <div className="slab p-6" data-reveal style={{ '--i': 2 } as React.CSSProperties}>
              <h3 className="h-card">MHR Recycling</h3>
              <a href={site.recyclingPhone.href} className="num mt-3 block font-display text-2xl font-bold hover:text-accent">
                {site.recyclingPhone.display}
              </a>
              <p className="text-sm text-dust">Ask for {site.recyclingPhone.contact}</p>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={serviceSchema(services.map((s) => ({ name: s.name.replace(/[“”]/g, ''), description: s.body })))} />
      <QuoteCta />
    </>
  );
}
