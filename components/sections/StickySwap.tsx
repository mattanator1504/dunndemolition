'use client';

import { useEffect, useRef, useState } from 'react';
import { Photo } from '@/components/site/Photo';

type Item = { id: string; name: string; body: string; image: string };

// Text scrolls on the left; on the right a sticky frame swaps to the photo for whichever
// item is crossing the middle of the screen, wiping the new one up from the bottom.
// Small screens: each item carries its own photo instead.
export function StickySwap({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const rows = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[data-swap]') ?? []);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.swap));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
      <ol ref={listRef} className="lg:col-span-6">
        {items.map((s, i) => (
          <li
            key={s.id}
            id={s.id}
            data-swap={i}
            className={`scroll-mt-24 border-t border-ink py-10 transition-opacity duration-500 lg:min-h-[62vh] lg:py-14 ${active === i ? 'lg:opacity-100' : 'lg:opacity-35'}`}
          >
            <p className="label num text-muted">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="mt-5 text-[clamp(2rem,3.8vw,3.6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.025em] [font-stretch:118%]">{s.name}</h3>
            <p className="mt-5 max-w-md text-muted">{s.body}</p>
            <div className="relative mt-8 aspect-[16/10] overflow-hidden lg:hidden" data-reveal="blocks">
              <Photo name={s.image} sizes="100vw" className="photo absolute inset-0 h-full w-full object-cover" />
            </div>
          </li>
        ))}
      </ol>
      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-28 aspect-[4/5] max-h-[calc(100svh-9rem)] w-full overflow-hidden bg-ink">
          {items.map((s, i) => (
            <div
              key={s.id}
              aria-hidden={active !== i}
              className="absolute inset-0 transition-[clip-path] duration-[900ms] ease-[var(--ease-out-heavy)]"
              style={{ clipPath: active === i ? 'inset(0 0 0 0)' : i > active ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)', zIndex: active === i ? 2 : 1 }}
            >
              <Photo name={s.image} sizes="45vw" className="photo absolute inset-0 h-full w-full object-cover" />
            </div>
          ))}
          <p className="label absolute bottom-4 left-4 z-10 bg-ink px-2 py-1 text-paper">
            <span className="num text-accent">{String(active + 1).padStart(2, '0')}</span> / {String(items.length).padStart(2, '0')}
          </p>
        </div>
      </div>
    </div>
  );
}
