'use client';

import { useEffect, useRef } from 'react';

// Pins "How it works" on desktop and advances the four steps as you scroll,
// with a progress rule filling across. GSAP + ScrollTrigger load only here,
// only on desktop, only with motion allowed. Without it the steps are a plain grid.
export function ProcessTimeline({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!document.documentElement.classList.contains('js-motion')) return;
    if (!matchMedia('(min-width: 1024px)').matches) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
          if (cancelled) return;
          gsap.registerPlugin(ScrollTrigger);
          const steps = Array.from(el.querySelectorAll<HTMLElement>('[data-step]'));
          const bar = el.querySelector<HTMLElement>('[data-progress]');
          ctx = gsap.context(() => {
            gsap.set(steps, { opacity: 0.25, y: 40, rotateX: -12, transformPerspective: 900, transformOrigin: '50% 100%' });
            const tl = gsap.timeline({
              scrollTrigger: { trigger: el, start: 'top top', end: '+=140%', scrub: 0.6, pin: true, anticipatePin: 1 },
            });
            if (bar) tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: steps.length }, 0);
            steps.forEach((s, i) => {
              tl.to(s, { opacity: 1, y: 0, rotateX: 0, ease: 'power3.out', duration: 0.8 }, i * 0.9);
            });
          }, el);
          const lenis = (window as unknown as { __lenis?: { on: (e: string, f: () => void) => void } }).__lenis;
          lenis?.on('scroll', ScrollTrigger.update);
        });
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      {children}
    </div>
  );
}
