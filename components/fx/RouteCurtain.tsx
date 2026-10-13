'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { dust } from './dust';

// Page transitions: on an internal link, a wall of eight slabs drops in from above, the
// route changes behind it, then the wall collapses (bottom-up, tumbling) to reveal the new
// page with a line of dust along the bottom. Skipped under reduced motion, for new-tab
// clicks, hash links, and the very first load (the headline must paint first).
const SLABS = 8;

export function RouteCurtain() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef(false);

  // Cover, then navigate.
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest?.('a');
      if (!a || a.target || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // same page (incl. #anchors)
      const el = ref.current;
      if (!el) return;
      e.preventDefault();
      pending.current = true;
      el.dataset.state = 'cover';
      window.setTimeout(() => router.push(url.pathname + url.search + url.hash), 420);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  // New page in: collapse the wall.
  useEffect(() => {
    const el = ref.current;
    if (!el || !pending.current) return;
    pending.current = false;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o: { immediate: boolean }) => void } }).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      el.dataset.state = 'fall';
      window.setTimeout(() => {
        for (let i = 0; i < 5; i++) dust((innerWidth * (i + 0.5)) / 5, innerHeight - 8, { power: 0.8, chunks: 4 });
      }, 360);
      window.setTimeout(() => {
        el.dataset.state = '';
      }, 1100);
    });
  }, [pathname]);

  return (
    <div ref={ref} aria-hidden="true" data-state="" className="curtain pointer-events-none fixed inset-0 z-[60] flex">
      {Array.from({ length: SLABS }, (_, i) => (
        <i key={i} style={{ '--si': i, '--sr': `${((i * 53) % 9) - 4}deg` } as React.CSSProperties} />
      ))}
    </div>
  );
}
