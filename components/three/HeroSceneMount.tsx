'use client';

import { useEffect, useRef, useState } from 'react';
import type { HeroSceneHandle } from './HeroScene';

// Decides whether and when the 3D wall loads (technical-seo.md §4):
// - never under reduced motion, Save-Data, no WebGL, small screens or low-power devices
// - otherwise on the first user interaction, or once the page has been idle a while
// The poster (same framing as the scene's first frame) is always rendered first.
// The canvas fills the hero's scene box (click-through). Under html.js-pin the hero is a
// tall track with a sticky stage; progress runs across the track up to where the rest of
// the page starts sliding over it.

function canRun3D() {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(location.search);
  if (params.has('poster')) return true;
  const force = params.has('3d'); // testing: skip the low-power checks
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (!matchMedia('(min-width: 1024px)').matches) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if (!force && (nav.hardwareConcurrency ?? 8) <= 4) return false;
  if (!force && nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  try {
    const c = document.createElement('canvas');
    return !!c.getContext('webgl2');
  } catch {
    return false;
  }
}

export function HeroSceneMount({ heroId }: { heroId: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);
  const [shown, setShown] = useState(false);

  // Step 1: wait for a reason to load.
  useEffect(() => {
    if (!canRun3D()) {
      // The boot script pinned the hero for a scene that can't run here (e.g. no WebGL2):
      // unpin, so the poster isn't held for screens of dead scroll.
      document.documentElement.classList.remove('js-pin');
      return;
    }
    const poster = new URLSearchParams(location.search).has('poster');
    if (poster) {
      setActive(true);
      return;
    }
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      cleanup();
      setActive(true);
    };
    const events = ['pointermove', 'pointerdown', 'wheel', 'scroll', 'keydown', 'touchstart'] as const;
    events.forEach((ev) => window.addEventListener(ev, go, { passive: true, once: true }));
    const idle = window.setTimeout(() => {
      if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 2000 });
      else go();
    }, 6000);
    function cleanup() {
      events.forEach((ev) => window.removeEventListener(ev, go));
      clearTimeout(idle);
    }
    return cleanup;
  }, []);

  // Step 2: load three.js and run the scene.
  useEffect(() => {
    if (!active || !canvasRef.current || !boxRef.current) return;
    let handle: HeroSceneHandle | undefined;
    let disposed = false;
    let raf = 0;
    let ro: ResizeObserver | undefined;
    const poster = new URLSearchParams(location.search).has('poster');
    const hero = document.getElementById(heroId);

    const header = document.querySelector('header');
    const pctEl = hero?.querySelector<HTMLElement>('[data-hero-pct]') ?? null;
    const sync = () => {
      if (!hero || !handle || !boxRef.current) return;
      const r = hero.getBoundingClientRect();
      const headerH = header?.offsetHeight ?? 0;
      const stage = innerHeight - headerH;
      // Pinned: the track minus the stage, minus the stretch where the rest of the page slides over.
      const travel = r.height - 2 * stage;
      const p = Math.min(1, Math.max(0, travel > stage * 0.5 ? (headerH - r.top) / travel : -r.top / (r.height * 0.8)));
      handle.setProgress(p);
      // Site log readout (Hero.tsx): which beat we're in, the bar, and the percentage.
      const beat = String(p < 0.04 ? 0 : p < 0.3 ? 1 : p < 0.8 ? 2 : 3);
      if (hero.dataset.beat !== beat) hero.dataset.beat = beat;
      hero.style.setProperty('--p', p.toFixed(3));
      const pct = `${Math.round(p * 100)}%`;
      if (pctEl && pctEl.textContent !== pct) pctEl.textContent = pct;

    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    };
    const onPointer = (e: PointerEvent) => {
      handle?.setPointer((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
    };
    const onResize = () => {
      handle?.resize();
      sync();
    };
    const onVisibility = () => handle?.setRunning(!document.hidden);

    import('./HeroScene').then(({ createHeroScene, FRAME_ASPECT }) => {
      Object.assign(window, { __frameAspect: FRAME_ASPECT });
      if (disposed || !canvasRef.current) return;
      handle = createHeroScene(canvasRef.current, { poster });
      if (poster) {
        handle.renderOnce();
        Object.assign(window, { __heroScene: handle, __posterReady: true });
        return;
      }
      sync();
      handle.renderOnce();
      requestAnimationFrame(() => {
        setShown(true);
        // Hide the poster once the live canvas has faded in over it.
        window.setTimeout(() => hero?.setAttribute('data-scene', 'live'), 700);
      });
      handle.setRunning(!document.hidden);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('pointermove', onPointer, { passive: true });
      window.addEventListener('resize', onResize);
      ro = new ResizeObserver(onResize);
      if (boxRef.current) ro.observe(boxRef.current);
      document.addEventListener('visibilitychange', onVisibility);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      handle?.dispose();
      hero?.removeAttribute('data-scene');
    };
  }, [active, heroId]);

  return (
    <div ref={boxRef} className="absolute inset-0" aria-hidden="true">
      {active && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-700"
          style={{ opacity: shown || (typeof location !== 'undefined' && location.search.includes('poster')) ? 1 : 0 }}
        />
      )}
    </div>
  );
}
