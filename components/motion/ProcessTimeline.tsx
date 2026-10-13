'use client';

import { useEffect, useRef } from 'react';

// Pins "How it works" on desktop and slides the four steps sideways as you scroll down,
// filling each big numeral with hi-vis as its panel reaches the middle of the screen.
// GSAP + ScrollTrigger load only here, only on desktop, only with motion allowed.
// Without it the steps are a plain vertical list.
export function ProcessTimeline({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!document.documentElement.classList.contains('js-motion')) return;
    if (!matchMedia('(min-width: 1024px)').matches) return;

    let ctx: { revert: () => void } | undefined;
    let offLenis: (() => void) | undefined;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
          if (cancelled) return;
          gsap.registerPlugin(ScrollTrigger);
          const track = el.querySelector<HTMLElement>('[data-track]');
          const bar = el.querySelector<HTMLElement>('[data-progress]');
          const nums = Array.from(el.querySelectorAll<HTMLElement>('[data-num]'));
          if (!track) return;
          ctx = gsap.context(() => {
            const distance = () => Math.max(0, track.scrollWidth - innerWidth);
            const tl = gsap.timeline({
              scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${distance()}`, scrub: 0.6, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
            });
            tl.to(track, { x: () => -distance(), ease: 'none', duration: 1 }, 0);
            if (bar) tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 }, 0);
            // Fill each numeral as its panel's centre crosses the middle of the screen.
            nums.forEach((n) => {
              const panel = n.parentElement!;
              const at = Math.min(0.98, Math.max(0, (panel.offsetLeft + panel.offsetWidth / 2 - innerWidth / 2) / Math.max(1, distance())));
              tl.to(n, { color: '#FFB800', webkitTextStrokeColor: '#FFB800', ease: 'power2.out', duration: 0.08 }, Math.max(0, at - 0.04));
            });
          }, el);
          const lenis = (window as unknown as { __lenis?: { on: (e: 'scroll', f: () => void) => () => void } }).__lenis;
          offLenis = lenis?.on('scroll', ScrollTrigger.update);
        });
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      offLenis?.();
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      {children}
    </div>
  );
}
