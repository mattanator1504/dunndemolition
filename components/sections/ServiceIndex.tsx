'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Photo } from '@/components/site/Photo';
import type { Service } from '@/content/services';

// The services as an index: one huge row each. On hover a hi-vis fill rises through the
// row and a black-and-white photo follows the cursor, leaning with its speed.
// Touch screens get a thumbnail in the row instead of the floating photo.
export function ServiceIndex({ items, link = true }: { items: Pick<Service, 'id' | 'name' | 'short' | 'image'>[]; link?: boolean }) {
  const floatRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const el = floatRef.current;
    if (!el) return;
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pos = { x: innerWidth / 2, y: innerHeight / 2, tx: innerWidth / 2, ty: innerHeight / 2 };
    let raf = 0;
    const loop = () => {
      const dx = pos.tx - pos.x;
      pos.x += dx * 0.14;
      pos.y += (pos.ty - pos.y) * 0.14;
      const lean = Math.max(-12, Math.min(12, dx * 0.06));
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(${lean.toFixed(2)}deg)`;
      raf = Math.abs(dx) > 0.2 || Math.abs(pos.ty - pos.y) > 0.2 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => {
      pos.tx = e.clientX;
      pos.ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    // Scrolling moves the rows under a still pointer: re-check which row (if any) it's over.
    const onScroll = () => {
      const row = document.elementFromPoint(pos.tx, pos.ty)?.closest<HTMLElement>('[data-svc-row]');
      setActive(row ? Number(row.dataset.svcRow) : -1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="relative" onPointerLeave={() => setActive(-1)}>
      <ul className="border-t border-line-dark">
        {items.map((s, i) => (
          <li key={s.id} data-reveal style={{ '--i': i } as React.CSSProperties}>
            <Row
              link={link}
              href={`/services#${s.id}`}
              id={link ? undefined : s.id}
              data-svc-row={i}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(-1)}
              className="group relative isolate grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 gap-y-2 border-b border-line-dark py-6 text-paper transition-colors duration-300 hover:text-ink focus-visible:text-ink lg:grid-cols-[4rem_1.25fr_1fr_4rem] lg:py-9"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[var(--ease-out-heavy)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
              />
              <span className="label text-dust transition-colors group-hover:text-ink group-focus-visible:text-ink lg:pl-3">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="text-[clamp(1.5rem,3.7vw,3.6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.025em] transition-transform duration-500 ease-[var(--ease-out-heavy)] [font-stretch:120%] group-hover:translate-x-3">
                {s.name}
              </h3>
              <span className="relative block h-14 w-20 overflow-hidden lg:hidden">
                <Photo name={s.image} alt="" sizes="80px" maxWidth={640} className="photo absolute inset-0 h-full w-full object-cover" />
              </span>
              <p className="col-start-2 col-end-4 max-w-md text-dust transition-colors group-hover:text-ink group-focus-visible:text-ink lg:col-start-3 lg:col-end-4">
                {s.short}
              </p>
              <span
                aria-hidden="true"
                className="hidden justify-self-end pr-3 font-mono text-2xl transition-transform duration-500 ease-[var(--ease-out-heavy)] group-hover:-rotate-45 lg:block"
              >
                →
              </span>
            </Row>
          </li>
        ))}
      </ul>

      {/* Floating photo (fine pointers only). Fixed to the viewport, follows the cursor. */}
      <div
        ref={floatRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-30 hidden h-[17rem] w-[24rem] [@media(hover:hover)_and_(pointer:fine)]:block"
        style={{ transform: 'translate3d(-100vw, 0, 0)' }}
      >
        <div
          className={`relative h-full w-full overflow-hidden transition-[clip-path] duration-500 ease-[var(--ease-out-heavy)] ${active >= 0 ? '[clip-path:inset(0)]' : '[clip-path:inset(50%)]'}`}
        >
          {items.map((s, i) => (
            <Photo
              key={s.id}
              name={s.image}
              alt=""
              sizes="384px"
              maxWidth={640}
              className={`photo absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${active === i ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// A row is a link on the home page, and a plain anchored block on /services itself.
function Row({ link, href, children, ...rest }: { link: boolean; href: string; children: React.ReactNode } & React.HTMLAttributes<HTMLElement> & { 'data-svc-row'?: number }) {
  if (link)
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  return (
    <div tabIndex={-1} {...rest} className={`${rest.className ?? ''} scroll-mt-24`}>
      {children}
    </div>
  );
}
