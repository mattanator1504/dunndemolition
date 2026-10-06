import Link from 'next/link';
import { serviceById } from '@/content/services';
import { ServiceIcon } from './ServiceIcon';
import { Photo } from '@/components/site/Photo';

// Six photo-topped slabs that tilt slightly toward the pointer (CSS only, desktop hover).
export function ServiceCards({ ids }: { ids: string[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {ids.map((id, i) => {
        const s = serviceById(id);
        return (
          <li key={id} data-reveal style={{ '--i': i } as React.CSSProperties} className="[perspective:900px]">
            <Link
              href={`/services#${s.id}`}
              className="slab group flex h-full flex-col transition-[transform,box-shadow] duration-200 ease-[var(--ease-out-heavy)] hover:-translate-y-1 hover:[transform:rotateX(4deg)_rotateY(-4deg)_translateY(-4px)] hover:shadow-[10px_10px_0_0_var(--color-accent)]"
            >
              <span className="relative block aspect-[16/10] overflow-hidden border-b-2 border-paper">
                <Photo
                  name={s.image}
                  alt=""
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  maxWidth={640}
                  className="photo absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out-heavy)] group-hover:scale-105"
                />
                <span className="absolute bottom-0 left-0 flex h-12 w-12 items-center justify-center border-r-2 border-t-2 border-paper bg-accent text-ink">
                  <ServiceIcon id={s.id} />
                </span>
              </span>
              <span className="flex flex-1 flex-col gap-3 p-6 lg:p-7">
                <h3 className="h-card">{s.name}</h3>
                <span className="text-dust">{s.short}</span>
                <span aria-hidden="true" className="mt-auto block h-[3px] w-10 bg-accent transition-[width] duration-200 group-hover:w-20" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
