'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { HeroSceneHandle } from './HeroScene';

// Decides whether and when the 3D wall loads (technical-seo.md §4):
// - never under reduced motion, Save-Data, no WebGL, small screens or low-power devices
// - otherwise on the first user interaction, or once the page has been idle a while
// The poster (same framing as the scene's first frame) is always rendered first.
// Live, the canvas is a fixed, click-through layer over the whole viewport: the wall is
// drawn inside the hero's box, and debris falls down the page edges to the footer.

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
    if (!canRun3D()) return;
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
    const poster = new URLSearchParams(location.search).has('poster');
    const hero = document.getElementById(heroId);

    const footer = document.querySelector('footer');
    const sync = () => {
      if (!hero || !handle || !boxRef.current) return;
      const r = hero.getBoundingClientRect();
      handle.setProgress(-r.top / (r.height * 0.8));
      const b = boxRef.current.getBoundingClientRect();
      handle.setBox({ left: b.left, top: b.top, width: b.width, height: b.height });
      handle.setPage(window.scrollY, footer ? footer.getBoundingClientRect().top : null);
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
      document.addEventListener('visibilitychange', onVisibility);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      handle?.dispose();
      hero?.removeAttribute('data-scene');
    };
  }, [active, heroId]);

  const poster = typeof location !== 'undefined' && location.search.includes('poster');
  const canvas = active && (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={
        poster
          ? 'absolute inset-0 h-full w-full'
          : 'pointer-events-none fixed inset-0 z-40 h-[100lvh] w-full transition-opacity duration-700'
      }
      style={{ opacity: shown || poster ? 1 : 0 }}
    />
  );
  return (
    <div ref={boxRef} className="absolute inset-0" aria-hidden="true">
      {canvas && (poster ? canvas : createPortal(canvas, document.body))}
    </div>
  );
}
