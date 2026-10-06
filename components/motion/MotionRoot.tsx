'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Wires up the page's motion once per route:
// - [data-reveal]: "set-down" reveal when scrolled into view (CSS does the animation)
// - [data-countup]: numbers count up once, from the value already in the HTML
// - [data-parallax]: photos drift slightly inside their frame (transform only)
// - Lenis smooth scroll on desktop mice only
// Nothing here runs under prefers-reduced-motion; the HTML already shows final states.

export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('motion-ready');
    if (!root.classList.contains('js-motion')) return;

    const reveals = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
          if (e.target instanceof HTMLElement && e.target.dataset.countup !== undefined) countUp(e.target);
          e.target.querySelectorAll<HTMLElement>('[data-countup]').forEach(countUp);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    reveals.forEach((el) => io.observe(el));

    // Parallax: move each photo up to ±6% of its frame height as it crosses the viewport.
    const photos = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const vh = innerHeight;
        for (const img of photos) {
          const frame = img.parentElement!.getBoundingClientRect();
          if (frame.bottom < 0 || frame.top > vh) continue;
          const t = (frame.top + frame.height / 2 - vh / 2) / (vh / 2 + frame.height / 2); // -1..1
          img.style.transform = `translate3d(0, ${(-t * frame.height * 0.06).toFixed(1)}px, 0) scale(1.14)`;
        }
      });
    };
    if (photos.length) {
      onScroll();
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('resize', onScroll);
    }

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  // Smooth scroll: desktop with a fine pointer, no reduced motion. Loaded lazily.
  useEffect(() => {
    if (!document.documentElement.classList.contains('js-motion')) return;
    if (!matchMedia('(pointer: fine) and (min-width: 1024px)').matches) return;
    let lenis: { destroy: () => void; raf: (t: number) => void } | undefined;
    let raf = 0;
    let cancelled = false;
    const start = () =>
      import('lenis').then(({ default: Lenis }) => {
        if (cancelled) return;
        const l = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
        lenis = l;
        (window as unknown as { __lenis: unknown }).__lenis = l;
        const loop = (t: number) => {
          l.raf(t);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      });
    addEventListener('wheel', start, { once: true, passive: true });
    return () => {
      cancelled = true;
      removeEventListener('wheel', start);
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return null;
}

function countUp(el: HTMLElement) {
  if (el.dataset.counted) return;
  el.dataset.counted = '1';
  const target = Number(el.dataset.countup);
  if (!Number.isFinite(target)) return;
  const original = el.textContent ?? '';
  const duration = 1100;
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = String(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = original;
  };
  el.textContent = '0';
  requestAnimationFrame(step);
}
