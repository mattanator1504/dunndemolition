import { Photo } from '@/components/site/Photo';

// Two rows of job-site photos that drift in opposite directions as you scroll
// (MotionRoot moves [data-drift] with transform only; static without motion).
const rows = [
  ['aerial-heavy-equipment', 'excavator-bucket-on-rubble', 'broken-concrete-rubble', 'excavator-dismantling-industrial-building', 'loader-at-night'],
  ['excavator-loading-dump-truck', 'broken-rock-pile', 'aerial-dump-trucks', 'yellow-hard-hat', 'rubble-street-demolition'],
];

export function PhotoReel() {
  return (
    <section aria-label="Demolition and site work photos" className="on-ink overflow-hidden bg-ink py-3 lg:py-4">
      <div className="grid gap-3 lg:gap-4">
        {rows.map((row, r) => (
          <ul key={r} data-drift={r ? -1 : 1} className={`flex w-max gap-3 lg:gap-4 ${r ? '-ml-48' : '-ml-8'}`}>
            {[...row, ...row].map((name, i) => (
              <li key={`${name}-${i}`} className="group relative aspect-[3/2] w-[15rem] shrink-0 overflow-hidden sm:w-[20rem] lg:w-[28rem]">
                <Photo
                  name={name}
                  alt={i < row.length ? undefined : ''}
                  sizes="(min-width: 1024px) 28rem, (min-width: 640px) 20rem, 15rem"
                  maxWidth={640}
                  className="photo absolute inset-0 h-full w-full object-cover transition-[filter] duration-500 group-hover:[filter:none]"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
