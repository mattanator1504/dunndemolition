'use client';

import { useEffect, useRef } from 'react';
import { Split } from './Split';
import { dust } from './dust';

// A page title that behaves like a structure:
// - proximity: letters near the pointer squeeze narrower and lighter (Archivo's wdth and
//   wght axes), like they're in the grip of a hydraulic thumb. Fine pointers only.
// - crumble: as you scroll past it, the letters crack loose and fall with a puff of dust,
//   and build themselves back up if you scroll back. Motion allowed only.
// The text is real (aria-label on the heading, letters in the HTML); only transforms move.
export function DemoTitle({
  text,
  accent,
  className = '',
  crumble = true,
  proximity = true,
  as: Tag = 'h1',
  id,
}: {
  text: string;
  accent?: string;
  className?: string;
  crumble?: boolean;
  proximity?: boolean;
  as?: 'h1' | 'h2' | 'p' | 'span';
  id?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const chars = Array.from(el.querySelectorAll<HTMLElement>('[data-ch]'));
    let seed = text.length * 97 + 13;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const fall = chars.map(() => ({ d: rand() * 0.75, dx: (rand() - 0.5) * 160, spin: (rand() - 0.5) * 140, dusted: false }));
    let raf = 0;
    const ptr = { x: -1e5, y: -1e5 };
    const fine = proximity && matchMedia('(hover: hover) and (pointer: fine)').matches;

    // Crumble is measured from where the title rests on the page, and only armed once the
    // page has settled (after a route change the old scroll position can linger a moment).
    let armed = false;
    let startY = 0;
    const frame = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = innerHeight;
      // 0 at rest, 1 after scrolling about 60% of a screen past the point it starts to go.
      const p = crumble && armed ? Math.min(1, Math.max(0, (scrollY - startY) / (vh * 0.6))) : 0;
      const near = fine && ptr.y > r.top - 160 && ptr.y < r.bottom + 160;
      chars.forEach((c, i) => {
        const f = fall[i];
        const t = Math.min(1, Math.max(0, p * 1.9 - f.d));
        if (t > 0.02 && !f.dusted) {
          f.dusted = true;
          const b = c.getBoundingClientRect();
          if (i % 2 === 0) dust(b.left + b.width / 2, b.bottom, { power: 0.35, chunks: 3 });
        }
        if (t === 0) f.dusted = false;
        c.style.transform = t ? `translate(${(f.dx * t).toFixed(1)}px, ${(t * t * vh * 0.7).toFixed(1)}px) rotate(${(f.spin * t).toFixed(1)}deg)` : '';
        c.style.opacity = t > 0.7 ? String(Math.max(0, 1 - (t - 0.7) / 0.3)) : '';
        if (near && !t) {
          const b = c.getBoundingClientRect();
          const d = Math.hypot(ptr.x - (b.left + b.width / 2), ptr.y - (b.top + b.height / 2));
          const k = Math.max(0, 1 - d / 170);
          const e = k * k * (3 - 2 * k);
          c.style.fontVariationSettings = e > 0.01 ? `"wdth" ${(125 - e * 50).toFixed(0)}, "wght" ${(900 - e * 520).toFixed(0)}` : '';
        } else if (c.style.fontVariationSettings) c.style.fontVariationSettings = '';
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onMove = (e: PointerEvent) => {
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      schedule();
    };
    if (crumble) addEventListener('scroll', schedule, { passive: true });
    if (fine) addEventListener('pointermove', onMove, { passive: true });
    schedule();
    const arm = window.setTimeout(() => {
      // Start once the title's top would pass a third of the way up the screen.
      startY = Math.max(0, el.getBoundingClientRect().top + scrollY - innerHeight * 0.35);
      armed = true;
      schedule();
    }, 900);
    return () => {
      clearTimeout(arm);
      cancelAnimationFrame(raf);
      removeEventListener('scroll', schedule);
      removeEventListener('pointermove', onMove);
    };
  }, [text, crumble, proximity]);

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} id={id} aria-label={Tag === 'span' ? undefined : text} className={className}>
      <Split text={text} accent={accent} />
    </Tag>
  );
}
