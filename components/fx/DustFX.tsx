'use client';

import { useEffect, useRef } from 'react';
import type { BurstOptions } from './dust';

// One fixed, click-through canvas for every dust burst on the site: soft concrete-dust
// puffs that billow and fade, plus a few chunks of debris thrown out under gravity.
// It only animates while particles are alive, and stays empty under reduced motion.
type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; spin: number; a: number; kind: 0 | 1; tone: number };

const MAX = 700;

export function DustFX() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 1.5);
      w = innerWidth;
      h = innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    addEventListener('resize', resize);

    // A soft round sprite for the dust, drawn once.
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 64;
    const sg = sprite.getContext('2d')!;
    const grad = sg.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(214,208,196,0.55)');
    grad.addColorStop(0.5, 'rgba(190,184,172,0.22)');
    grad.addColorStop(1, 'rgba(170,164,152,0)');
    sg.fillStyle = grad;
    sg.fillRect(0, 0, 64, 64);

    const ps: P[] = [];
    let raf = 0;
    let last = 0;

    const burst = (x: number, y: number, o: BurstOptions = {}) => {
      const power = o.power ?? 1;
      const lean = o.lean ?? 0;
      const nDust = Math.round(10 + power * 16);
      const nChunks = o.chunks ?? Math.round(power * 9);
      for (let i = 0; i < nDust && ps.length < MAX; i++) {
        const ang = -Math.PI / 2 + lean * 0.6 + (Math.random() - 0.5) * Math.PI * 1.4;
        const sp = (40 + Math.random() * 160) * power;
        const max = 0.9 + Math.random() * 0.9 * Math.min(1.6, power);
        ps.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp * 0.6, life: max, max, size: (10 + Math.random() * 18) * (0.6 + power * 0.5), spin: 0, a: 0, kind: 0, tone: 0 });
      }
      for (let i = 0; i < nChunks && ps.length < MAX; i++) {
        const ang = -Math.PI / 2 + lean * 0.7 + (Math.random() - 0.5) * Math.PI * 1.1;
        const sp = (160 + Math.random() * 380) * Math.sqrt(power);
        const max = 1 + Math.random() * 0.6;
        ps.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: max, max, size: 2 + Math.random() * 5 * Math.min(1.5, power), spin: (Math.random() - 0.5) * 18, a: Math.random() * 6, kind: 1, tone: Math.random() });
      }
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.life -= dt;
        if (p.life <= 0 || p.y > h + 60) {
          ps.splice(i, 1);
          continue;
        }
        const k = p.life / p.max; // 1 → 0
        if (p.kind === 0) {
          // Dust: drags to a stop, drifts up a touch, billows out and fades.
          p.vx *= 1 - dt * 3.2;
          p.vy = p.vy * (1 - dt * 3.2) - 14 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          const s = p.size * (1 + (1 - k) * 2.4);
          ctx.globalAlpha = Math.min(1, k * 1.6) * 0.8;
          ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
        } else {
          // Chunks: ballistic, spinning.
          p.vy += 1500 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.a += p.spin * dt;
          ctx.globalAlpha = Math.min(1, k * 2.5);
          ctx.fillStyle = p.tone > 0.93 ? '#ffb800' : `hsl(40 6% ${38 + p.tone * 34}%)`;
          ctx.setTransform(dpr * Math.cos(p.a), dpr * Math.sin(p.a), -dpr * Math.sin(p.a), dpr * Math.cos(p.a), dpr * p.x, dpr * p.y);
          ctx.fillRect(-p.size / 2, -p.size * 0.35, p.size, p.size * 0.7);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      }
      ctx.globalAlpha = 1;
      raf = ps.length ? requestAnimationFrame(tick) : 0;
      if (!raf) ctx.clearRect(0, 0, w, h);
    };

    (window as unknown as { __dust?: { burst: typeof burst } }).__dust = { burst };
    return () => {
      removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
      delete (window as unknown as { __dust?: unknown }).__dust;
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[65] h-full w-full" />;
}
