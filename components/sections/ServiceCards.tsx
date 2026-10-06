import Link from 'next/link';
import { serviceById } from '@/content/services';
import { ServiceIcon } from './ServiceIcon';

// Six bordered slabs that tilt slightly toward the pointer (CSS only, desktop hover).
export function ServiceCards({ ids }: { ids: string[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {ids.map((id, i) => {
        const s = serviceById(id);
        return (
          <li key={id} data-reveal style={{ '--i': i } as React.CSSProperties} className="[perspective:900px]">
            <Link
              href={`/services#${s.id}`}
              className="slab group flex h-full flex-col gap-4 p-6 transition-[transform,box-shadow] duration-200 ease-[var(--ease-out-heavy)] hover:-translate-y-1 hover:[transform:rotateX(4deg)_rotateY(-4deg)_translateY(-4px)] hover:shadow-[10px_10px_0_0_var(--color-accent)] lg:p-7"
            >
              <span className="flex h-12 w-12 items-center justify-center border-2 border-current bg-accent text-ink">
                <ServiceIcon id={s.id} />
              </span>
              <h3 className="h-card">{s.name}</h3>
              <p className="text-dust">{s.short}</p>
              <span aria-hidden="true" className="mt-auto block h-[3px] w-10 bg-accent transition-[width] duration-200 group-hover:w-20" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
