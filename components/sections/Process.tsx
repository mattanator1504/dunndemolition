import { ProcessTimeline } from '@/components/motion/ProcessTimeline';
import { site } from '@/lib/site';

const steps = [
  { title: 'Site visit', body: 'We walk the site, talk through what comes down and when, and quote it. Free.' },
  { title: 'Permits and disconnects', body: 'We help pull the permit and line up utility disconnects.' },
  { title: 'Demolition', body: 'Excavators take the structure down in a controlled order. No explosives.' },
  { title: 'Haul and clean up', body: 'Debris is hauled and recycled as we go. The site is left clean.' },
];

// Four real, sequential steps, so numbering carries meaning here.
// Desktop with motion: pinned and advanced by scroll. Otherwise: a plain grid.
export function Process() {
  return (
    <section className="border-y-2 border-ink bg-accent text-ink" aria-labelledby="process-title">
      <ProcessTimeline>
        <div className="container-x flex flex-col justify-center py-20 lg:min-h-[100svh] lg:py-24">
          <div className="max-w-3xl">
            <h2 id="process-title" className="h-section">
              Four steps. No surprises.
            </h2>
            <p className="lede mt-5">
              Most jobs can start {site.timing.leadTime} after you say go. A typical house comes down in {site.timing.residential}.
            </p>
          </div>
          <div className="relative mt-14">
            <div className="absolute left-0 right-0 top-0 hidden h-[3px] bg-ink/20 lg:block" aria-hidden="true">
              <div data-progress className="h-full origin-left bg-ink" />
            </div>
            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:pt-10">
              {steps.map((s, i) => (
                <li key={s.title} data-step className="slab relative p-6 pt-14 lg:p-7 lg:pt-16">
                  <span className="num absolute left-0 top-0 flex h-11 w-14 items-center justify-center bg-ink font-display text-lg font-bold text-accent" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="h-card">{s.title}</h3>
                  <p className="mt-3 text-muted">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </ProcessTimeline>
    </section>
  );
}
