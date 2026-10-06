import { site } from '@/lib/site';

// Four facts from stats.md. Numbers are real text in the HTML; count-up only animates them.
export function Stats() {
  const items = [
    { value: String(site.foundingYear), count: undefined, label: 'In business since' },
    { value: String(site.stats.crews), count: site.stats.crews, label: `crews, never more than ${site.stats.maxProjects} jobs at once` },
    { value: site.stats.recycledRange, count: undefined, label: 'of removed material recycled' },
    { value: `${site.stats.projectsPerYear}`, count: site.stats.projectsPerYear, label: 'or so demolition projects a year' },
  ];
  return (
    <section aria-label="Dunn Demolition at a glance" className="border-b-2 border-ink bg-accent text-ink">
      <dl className="container-x grid grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <div
            key={it.label}
            data-reveal
            style={{ '--i': i } as React.CSSProperties}
            className={`flex flex-col-reverse justify-end gap-2 border-ink py-8 pr-4 ${i % 2 ? 'pl-4 sm:pl-6 border-l-2' : ''} ${i > 1 ? 'border-t-2 lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l-2 lg:pl-6' : ''}`}
          >
            <dt className="text-sm font-semibold leading-snug sm:text-base">{it.label}</dt>
            <dd className="num font-display text-[clamp(2.5rem,5vw,4rem)] font-bold leading-none tracking-tight">
              <span data-countup={it.count}>{it.value}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
