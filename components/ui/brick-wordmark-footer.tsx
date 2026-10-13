'use client';

// Brick Wordmark Footer: adapted from the 21st.dev "Halftone Wordmark Footer". The wordmark
// is set enormous and cropped by the bottom edge, but laid in running-bond bricks instead of
// halftone dots: a brick is laid wherever the letter covers most of it, so the word reads as
// masonry at any width. Move across it and the bricks shove away from the pointer on springs,
// turning as they're pushed and warming toward hi-vis; click and an impact ring runs through
// the wall. Above it sit the company line, link columns and a back-to-top over a hairline.
//
// One file, React only. A 2D canvas for the bricks and the grain, real links for the
// navigation. Every rule in the scoped <style> is .bwf- prefixed and nothing is fetched:
// the faces come from the host page (CSS variables are resolved for the canvas).

import * as React from 'react';
import Link from 'next/link';

export interface BrickPalette {
  /** The footer background. */
  background: string;
  /** The text, and the lightest brick tone. */
  ink: string;
  /** The darkest brick tone. */
  shade: string;
  /** The colour a brick warms toward as it's pushed off its place (and the odd painted brick). */
  warm: string;
}

export interface FooterLink {
  label: string;
  href?: string;
  /** A muted second line under the link. */
  note?: string;
  /** Open in a new tab (for map links). */
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface BrickWordmarkFooterProps {
  /** The giant word laid in bricks. Short, heavy words read best. */
  wordmark?: string;
  /** Top-left company line. */
  label?: string;
  /** The muted lines under it. */
  meta?: string[];
  columns?: FooterColumn[];
  /** Small print along the hairline (left side). */
  legal?: React.ReactNode;
  backToTop?: boolean;
  palette?: Partial<BrickPalette>;
  /** Brick height in CSS px; bricks are twice as long as they are tall. Defaults to 7. */
  brick?: number;
  /** How far the pointer pushes, in CSS px. Defaults to 90. */
  radius?: number;
  /** How much of the word's cap height hangs below the bottom edge, 0-0.6. Defaults to 0.16. */
  crop?: number;
  /** Print grain over everything, 0-1. Defaults to 0.5. */
  grain?: number;
  interactive?: boolean;
  /** Face for the wordmark (a CSS var like var(--font-archivo) is resolved). */
  fontFamily?: string;
  fontWeight?: number;
  /** CSS font-stretch keyword for the wordmark, where the face has a width axis. */
  fontStretch?: string;
  className?: string;
}

const DEFAULT_PALETTE: BrickPalette = { background: '#121211', ink: '#e7e4dd', shade: '#6f6b63', warm: '#ffb800' };

// #region bricks
// Pure helpers.

/** Hex → [r, g, b] in 0-255, or null for anything that isn't #rgb / #rrggbb. */
export function bwfHex(hex: string) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || '').trim());
  if (!m) return null;
  const h =
    m[1].length === 3
      ? m[1]
          .split('')
          .map((c) => c + c)
          .join('')
      : m[1];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/**
 * One step of a brick's spring back home, plus the push from a pointer at (px, py) within
 * radius r. The push also spins the brick (by which side of it the pointer is on).
 * Returns [x, y, vx, vy, a, va].
 */
export function bwfStep(x: number, y: number, vx: number, vy: number, a: number, va: number, hx: number, hy: number, px: number, py: number, r: number) {
  const dx = x - px;
  const dy = y - py;
  const d2 = dx * dx + dy * dy;
  if (r > 0 && d2 < r * r) {
    const d = Math.sqrt(d2) + 0.001;
    const f = (1 - d / r) * 2.4;
    vx += (dx / d) * f;
    vy += (dy / d) * f;
    va += ((dx * 0.5 - dy) / d) * f * 0.012;
  }
  vx = (vx + (hx - x) * 0.045) * 0.84;
  vy = (vy + (hy - y) * 0.045) * 0.84;
  va = (va - a * 0.05) * 0.86;
  return [x + vx, y + vy, vx, vy, a + va, va];
}

/** How warm a brick is drawn: 0 at home, 1 once it's `span` px or more away. */
export function bwfWarmth(x: number, y: number, hx: number, hy: number, span: number) {
  const d = Math.hypot(x - hx, y - hy);
  return span > 0 ? Math.min(1, d / span) : 0;
}

/** Font size that sets `measured` (width at 100px) to fill `width` exactly. */
export function bwfFitSize(measured: number, width: number) {
  return measured > 0 ? (width / measured) * 100 : 0;
}
// #endregion

const BWF_CSS = `
.bwf-root {
  position: relative; width: 100%; overflow: hidden; isolation: isolate;
  background: var(--bwf-bg); color: var(--bwf-ink); -webkit-font-smoothing: antialiased;
  padding-bottom: var(--bwf-word);
}
.bwf-root canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; max-width: none; }
.bwf-top {
  position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 1.4fr) repeat(3, minmax(0, 1fr));
  gap: 32px; padding: clamp(40px, 5vw, 72px) clamp(16px, 2.8vw, 40px) 0; max-width: 90rem; margin: 0 auto;
  font-family: var(--bwf-mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; line-height: 1.9;
}
.bwf-brand strong { display: block; font-family: var(--bwf-display); font-size: clamp(22px, 2vw, 30px); font-weight: 900; font-stretch: 125%; letter-spacing: -.02em; line-height: 1; }
.bwf-brand span { display: block; opacity: .55; margin-top: 10px; }
.bwf-brand span + span { margin-top: 0; }
.bwf-col h3 { margin: 0 0 10px; font: inherit; color: var(--bwf-warm); font-weight: 500; }
.bwf-col ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
.bwf-col small { display: block; font-size: 10px; opacity: .5; letter-spacing: .12em; line-height: 1.5; margin-bottom: 6px; }
.bwf-col a, .bwf-up {
  color: inherit; text-decoration: none; opacity: .85; background: none; border: 0; padding: 0;
  font: inherit; letter-spacing: inherit; text-transform: inherit; cursor: pointer;
  background-image: linear-gradient(currentColor, currentColor); background-size: 0% 1px;
  background-repeat: no-repeat; background-position: 0 100%; transition: opacity .25s ease, background-size .35s cubic-bezier(.2,.7,.1,1);
}
.bwf-col a:hover, .bwf-up:hover { opacity: 1; background-size: 100% 1px; }
.bwf-col a:focus-visible, .bwf-up:focus-visible { outline: 1px solid var(--bwf-warm); outline-offset: 3px; opacity: 1; }
.bwf-rule {
  position: relative; z-index: 1; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px 24px;
  max-width: calc(90rem - 2 * clamp(16px, 2.8vw, 40px)); margin: clamp(28px, 3.4vw, 48px) auto 0; padding-top: 14px;
  width: calc(100% - 2 * clamp(16px, 2.8vw, 40px));
  border-top: 1px solid color-mix(in srgb, var(--bwf-ink) 16%, transparent);
  font-family: var(--bwf-mono); font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; line-height: 1.7;
}
.bwf-legal { opacity: .55; max-width: 60rem; }
.bwf-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 900px) {
  .bwf-top { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); row-gap: 28px; }
  .bwf-brand { grid-column: 1 / -1; }
}
@media (max-width: 520px) {
  .bwf-top { grid-template-columns: minmax(0, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .bwf-col a, .bwf-up { transition: none; }
}
`;

function resolveFont(family: string, el: Element) {
  const m = /^var\((--[^),]+)/.exec(family.trim());
  if (!m) return family;
  return getComputedStyle(el).getPropertyValue(m[1]).trim() || 'sans-serif';
}

export default function BrickWordmarkFooter({
  wordmark = 'DUNN',
  label = 'Dunn Demolition',
  meta = [],
  columns = [],
  legal,
  backToTop = true,
  palette,
  brick = 7,
  radius = 90,
  crop = 0.16,
  grain = 0.5,
  interactive = true,
  fontFamily = 'var(--font-archivo)',
  fontWeight = 900,
  fontStretch = 'expanded',
  className = '',
}: BrickWordmarkFooterProps) {
  const colors = { ...DEFAULT_PALETTE, ...(palette || {}) };
  const rootRef = React.useRef<HTMLElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const opts = React.useRef({ colors, brick, radius, crop, grain, interactive, fontFamily, fontWeight, fontStretch, wordmark });
  opts.current = { colors, brick, radius, crop, grain, interactive, fontFamily, fontWeight, fontStretch, wordmark };
  const key = [wordmark, brick, crop, grain, fontFamily, fontWeight, fontStretch, colors.background, colors.ink, colors.shade, colors.warm].join('|');

  React.useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let px = -1e5;
    let py = -1e5;
    let raf = 0;
    let visible = true;
    let awake = true;
    let ring = { x: 0, y: 0, t: -1 };
    // Flat arrays: x, y, vx, vy, a, va, hx, hy, tone per brick.
    const S = 9;
    let bricks = new Float32Array(0);
    let count = 0;
    let bw = 14;
    let bh = 7;
    let grainTile: HTMLCanvasElement | null = null;
    const ink = bwfHex(opts.current.colors.ink) || [231, 228, 221];
    const shade = bwfHex(opts.current.colors.shade) || [111, 107, 99];
    const warm = bwfHex(opts.current.colors.warm) || [255, 184, 0];
    // A brick's resting colour: somewhere between shade and ink, the odd one painted hi-vis.
    const restColor = (tone: number) => {
      if (tone > 0.985) return warm;
      const t = 0.35 + tone * 0.65;
      return [shade[0] + (ink[0] - shade[0]) * t, shade[1] + (ink[1] - shade[1]) * t, shade[2] + (ink[2] - shade[2]) * t];
    };

    const layout = () => {
      const o = opts.current;
      const rect = root.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      bh = Math.max(3, o.brick * (w < 640 ? 0.7 : 1));
      bw = bh * 2;

      // Set the word once, at a size that fills the width, on a 1x mask.
      const mask = document.createElement('canvas');
      mask.width = w;
      mask.height = h;
      const m = mask.getContext('2d', { willReadFrequently: true });
      if (!m) return;
      const family = resolveFont(o.fontFamily, root);
      const mm = m as CanvasRenderingContext2D & { fontStretch?: string };
      if ('fontStretch' in mm) mm.fontStretch = o.fontStretch as never;
      m.font = `${o.fontWeight} 100px ${family}`;
      const word = o.wordmark || ' ';
      const fit = bwfFitSize(m.measureText(word).width, w * 0.98);
      m.font = `${o.fontWeight} ${fit}px ${family}`;
      const box = m.measureText(word);
      const cap = box.actualBoundingBoxAscent || fit * 0.72;
      const c = Math.max(0, Math.min(0.6, o.crop));
      m.fillStyle = '#000';
      m.textBaseline = 'alphabetic';
      m.fillText(word, (w - box.width) / 2, h + cap * c);
      const img = m.getImageData(0, 0, w, h).data;

      // Running bond: every other course shifts half a brick.
      const rows = Math.ceil(h / bh);
      const tmp: number[] = [];
      let seed = 1974;
      const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      for (let gy = 0; gy < rows; gy++) {
        const off = gy % 2 ? -bw / 2 : 0;
        for (let x0 = off; x0 < w; x0 += bw) {
          // Coverage: average alpha over a 4x2 sample of the brick.
          let sum = 0;
          for (let sy = 0; sy < 2; sy++) {
            for (let sx = 0; sx < 4; sx++) {
              const x = Math.min(w - 1, Math.max(0, Math.floor(x0 + ((sx + 0.5) * bw) / 4)));
              const y = Math.min(h - 1, Math.floor(gy * bh + ((sy + 0.5) * bh) / 2));
              sum += img[(y * w + x) * 4 + 3];
            }
          }
          const cov = sum / (8 * 255);
          if (cov < 0.5) continue;
          const hx = x0 + bw / 2;
          const hy = gy * bh + bh / 2;
          tmp.push(hx, hy, 0, 0, 0, 0, hx, hy, rand());
        }
      }
      bricks = new Float32Array(tmp);
      count = tmp.length / S;

      // A fixed tile of print grain, drawn once and laid over every frame.
      grainTile = document.createElement('canvas');
      grainTile.width = 256;
      grainTile.height = 256;
      const g = grainTile.getContext('2d');
      if (g) {
        const id = g.createImageData(256, 256);
        for (let i = 0; i < id.data.length; i += 4) {
          const v = Math.random() * 255;
          id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
          id.data[i + 3] = Math.random() < 0.5 ? 0 : 255;
        }
        g.putImageData(id, 0, 0);
      }
      awake = true;
    };

    const draw = (now: number) => {
      const o = opts.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = o.colors.background;
      ctx.fillRect(0, 0, w, h);

      const r = o.interactive && !reduced ? Math.max(0, o.radius) : 0;
      const ringAge = ring.t < 0 ? 1e9 : now - ring.t;
      const ringR = ringAge * 0.95;
      const mortar = Math.max(1, bh * 0.16);
      const dw = bw - mortar;
      const dh = bh - mortar;
      let moving = false;
      for (let i = 0; i < count; i++) {
        const j = i * S;
        let x = bricks[j];
        let y = bricks[j + 1];
        let vx = bricks[j + 2];
        let vy = bricks[j + 3];
        let a = bricks[j + 4];
        let va = bricks[j + 5];
        const hx = bricks[j + 6];
        const hy = bricks[j + 7];
        if (!reduced) {
          if (ringAge < 1000) {
            const dx = hx - ring.x;
            const dy = hy - ring.y;
            const d = Math.sqrt(dx * dx + dy * dy) + 0.001;
            const band = 1 - Math.min(1, Math.abs(d - ringR) / 30);
            if (band > 0) {
              const f = band * 3.6 * (1 - ringAge / 1000);
              vx += (dx / d) * f;
              vy += (dy / d) * f - f * 0.4;
              va += (bricks[j + 8] - 0.5) * f * 0.08;
            }
          }
          const s = bwfStep(x, y, vx, vy, a, va, hx, hy, px, py, r);
          x = s[0];
          y = s[1];
          vx = s[2];
          vy = s[3];
          a = s[4];
          va = s[5];
          if (Math.abs(vx) + Math.abs(vy) + Math.abs(va) * 20 > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) + Math.abs(a) * 20 > 0.05) moving = true;
          else {
            x = hx;
            y = hy;
            vx = vy = a = va = 0;
          }
          bricks[j] = x;
          bricks[j + 1] = y;
          bricks[j + 2] = vx;
          bricks[j + 3] = vy;
          bricks[j + 4] = a;
          bricks[j + 5] = va;
        }
        const base = restColor(bricks[j + 8]);
        const k = bwfWarmth(x, y, hx, hy, 34);
        ctx.fillStyle = `rgb(${Math.round(base[0] + (warm[0] - base[0]) * k)},${Math.round(base[1] + (warm[1] - base[1]) * k)},${Math.round(base[2] + (warm[2] - base[2]) * k)})`;
        if (a === 0) {
          ctx.fillRect(x - dw / 2, y - dh / 2, dw, dh);
        } else {
          const cs = Math.cos(a);
          const sn = Math.sin(a);
          ctx.setTransform(dpr * cs, dpr * sn, -dpr * sn, dpr * cs, dpr * x, dpr * y);
          ctx.fillRect(-dw / 2, -dh / 2, dw, dh);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      }

      if (grainTile && o.grain > 0) {
        ctx.globalAlpha = Math.min(1, o.grain) * 0.09;
        ctx.globalCompositeOperation = 'overlay';
        const pattern = ctx.createPattern(grainTile, 'repeat');
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, w, h);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }
      // Sleep once everything is home and nothing is pushing.
      awake = moving || ringAge < 1000 || px > -1e4;
    };

    const loop = (now: number) => {
      raf = 0;
      if (!visible) return;
      draw(now);
      if (awake) raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      awake = true;
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };

    const toLocal = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top];
    };
    const onMove = (e: PointerEvent) => {
      if (!opts.current.interactive) return;
      const p = toLocal(e);
      px = p[0];
      py = p[1];
      wake();
    };
    const onLeave = () => {
      px = -1e5;
      py = -1e5;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      if (!opts.current.interactive || reduced) return;
      if ((e.target as HTMLElement).closest('a,button')) return;
      const p = toLocal(e);
      ring = { x: p[0], y: p[1], t: performance.now() };
      wake();
    };

    layout();
    draw(performance.now());
    wake();

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('pointerdown', onDown);
    let lastW = w;
    const ro = new ResizeObserver(() => {
      // Height changes alone (content reflow) don't need a re-lay.
      if (Math.abs(root.getBoundingClientRect().width - lastW) < 1 && Math.abs(root.getBoundingClientRect().height - h) < 1) return;
      lastW = root.getBoundingClientRect().width;
      layout();
      wake();
    });
    ro.observe(root);
    const io = new IntersectionObserver((entries) => {
      visible = entries[0] ? entries[0].isIntersecting : true;
      if (visible) wake();
    });
    io.observe(root);
    // A web font that lands late re-sets the word in its real face.
    let alive = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!alive) return;
        layout();
        wake();
      });
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('pointerdown', onDown);
    };
  }, [key]);

  const toTop = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return (
    <footer
      ref={rootRef}
      className={'bwf-root ' + className}
      style={
        {
          '--bwf-bg': colors.background,
          '--bwf-ink': colors.ink,
          '--bwf-warm': colors.warm,
          '--bwf-mono': 'var(--font-mono)',
          '--bwf-display': 'var(--font-display)',
          '--bwf-word': 'clamp(120px, 23vw, 420px)',
        } as React.CSSProperties
      }
    >
      <style>{BWF_CSS}</style>
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="bwf-sr">{wordmark}</span>
      <div className="bwf-top">
        <div className="bwf-brand">
          <strong>{label}</strong>
          {meta.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
        {columns.map((col) => (
          <nav className="bwf-col" key={col.title} aria-label={col.title}>
            <h3>{col.title}</h3>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  {!l.href ? (
                    <span>{l.label}</span>
                  ) : l.href.startsWith('/') ? (
                    <Link href={l.href}>{l.label}</Link>
                  ) : (
                    <a href={l.href} {...(l.external ? { target: '_blank', rel: 'noopener' } : {})}>
                      {l.label}
                      {l.external && <span className="bwf-sr"> (opens in a new tab)</span>}
                    </a>
                  )}
                  {l.note && <small>{l.note}</small>}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="bwf-rule">
        <div className="bwf-legal">{legal}</div>
        {backToTop ? (
          <button type="button" className="bwf-up" onClick={toTop}>
            Back to top ↑
          </button>
        ) : null}
      </div>
    </footer>
  );
}
