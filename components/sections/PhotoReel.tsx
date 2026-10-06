import { Photo } from '@/components/site/Photo';

// Two rows of job-site photos that drift in opposite directions as you scroll
// (MotionRoot moves [data-drift] with transform only; static without motion).
const rows = [
  ['aerial-heavy-equipment', 'excavator-bucket-on-rubble', 'broken-concrete-rubble', 'excavator-dismantling-industrial-building', 'loader-at-night'],
  ['excavator-loading-dump-truck', 'broken-rock-pile', 'aerial-dump-trucks', 'yellow-hard-hat', 'rubble-street-demolition'],
];

export function PhotoReel() {
  return (
    <section aria-label="Demolition and site work photos" className="overflow-hidden border-y-2 border-ink bg-ink py-6 lg:py-8">
      <div className="grid gap-4 lg:gap-6">
        {rows.map((row, r) => (
          <ul key={r} data-drift={r ? -1 : 1} className={`flex w-max gap-4 lg:gap-6 ${r ? '-ml-48' : '-ml-8'}`}>
            {[...row, ...row].map((name, i) => (
              <li key={`${name}-${i}`} className="relative aspect-[3/2] w-[15rem] shrink-0 overflow-hidden border-2 border-paper sm:w-[20rem] lg:w-[26rem]">
                <Photo
                  name={name}
                  alt={i < row.length ? undefined : ''}
                  sizes="(min-width: 1024px) 26rem, (min-width: 640px) 20rem, 15rem"
                  maxWidth={640}
                  className="photo absolute inset-0 h-full w-full object-cover"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
