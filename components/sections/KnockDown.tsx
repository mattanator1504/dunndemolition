'use client';

import { useEffect, useRef } from 'react';
import { Split } from '@/components/fx/Split';
import { dust } from '@/components/fx/dust';

// "Take a swing": a running-bond wall and a hi-vis excavator arm you drive with the pointer
// (or tap to strike, on touch). Real 2D physics (matter-js, loaded only when the section is
// near the screen); hard hits throw dust and debris through the site-wide DustFX layer.
// Under reduced motion the wall is drawn once, standing, with no arm and no interaction.

type Brick = { body: import('matter-js').Body; tone: number; hx: number; hy: number };

export function KnockDown({ title = 'Take a swing', line = 'Swing the bucket into the wall.', id = 'swing-title' }: { title?: string; line?: string; id?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const rebuildRef = useRef<() => void>(() => {});

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!stage || !canvas || !ctx) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const M = await import('matter-js');
      if (disposed) return;
      const { Engine, Bodies, Body, Composite, Events, Sleeping } = M;

      let W = 0;
      let H = 0;
      let dpr = 1;
      let bw = 48;
      let bh = 22;
      const engine = Engine.create({ enableSleeping: true });
      engine.gravity.y = 1.1;
      let bricks: Brick[] = [];
      let statics: import('matter-js').Body[] = [];
      let bucket: import('matter-js').Body | null = null;
      const target = { x: 0, y: 0, active: false };
      let lastDust = 0;
      let downCount = -1;

      const size = () => {
        const r = stage.getBoundingClientRect();
        W = Math.round(r.width);
        H = Math.round(r.height);
        dpr = Math.min(devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
      };

      const build = () => {
        Composite.clear(engine.world, false);
        size();
        const ground = H - 18;
        bw = Math.max(30, Math.min(60, W / 19));
        bh = bw * 0.46;
        const cols = Math.max(5, Math.min(12, Math.floor((W * 0.5) / bw)));
        // Squat enough to stand on its own: no taller than about 1.5x its width.
        const rows = Math.max(6, Math.min(Math.floor((H * 0.58) / bh), Math.round(cols * 2.2)));
        const wallW = cols * bw;
        // Right-aligned, clear of the excavator parked bottom left.
        const x0 = W > 700 ? W * 0.9 - wallW : W - wallW - bw * 0.4;
        statics = [
          Bodies.rectangle(W / 2, ground + 40, W * 3, 80, { isStatic: true, friction: 0.9 }),
          Bodies.rectangle(-40, H / 2, 80, H * 4, { isStatic: true }),
          Bodies.rectangle(W + 40, H / 2, 80, H * 4, { isStatic: true }),
        ];
        let seed = 1974;
        const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
        bricks = [];
        for (let r = 0; r < rows; r++) {
          const odd = r % 2 === 1;
          const y = ground - bh / 2 - r * bh;
          // Running bond: odd courses start and end with a half brick.
          const units: [number, number][] = [];
          if (odd) {
            units.push([x0 + bw / 4, bw / 2]);
            for (let c = 0; c < cols - 1; c++) units.push([x0 + bw / 2 + c * bw + bw / 2, bw]);
            units.push([x0 + wallW - bw / 4, bw / 2]);
          } else for (let c = 0; c < cols; c++) units.push([x0 + c * bw + bw / 2, bw]);
          for (const [x, w] of units) {
            const body = Bodies.rectangle(x, y, w - 1.5, bh - 1.5, { friction: 0.7, frictionStatic: 1.2, restitution: 0.04, density: 0.0016, slop: 0.02 });
            Sleeping.set(body, true);
            bricks.push({ body, tone: rand(), hx: x, hy: y });
          }
        }
        bucket = Bodies.rectangle(W * 0.22, H * 0.35, bw * 1.5, bw * 1.1, { density: 0.06, frictionAir: 0.02, chamfer: { radius: [2, 2, bw * 0.4, 2] } });
        target.x = W * 0.22;
        target.y = H * 0.35;
        Composite.add(engine.world, [...statics, ...bricks.map((b) => b.body), bucket]);
        downCount = -1;
      };

      rebuildRef.current = () => {
        build();
        const r = stage.getBoundingClientRect();
        dust(r.left + r.width * 0.7, r.bottom - 20, { power: 1.2, chunks: 6 });
      };

      // Dust where things hit hard.
      Events.on(engine, 'collisionStart', (ev) => {
        const now = performance.now();
        if (now - lastDust < 70) return;
        for (const pair of ev.pairs) {
          const a = pair.bodyA;
          const b = pair.bodyB;
          const rel = Math.hypot(a.velocity.x - b.velocity.x, a.velocity.y - b.velocity.y);
          if (rel < 7) continue;
          const sp = pair.collision.supports[0];
          if (!sp) continue;
          const r = stage.getBoundingClientRect();
          dust(r.left + sp.x, r.top + sp.y, { power: Math.min(1.5, rel / 16), chunks: rel > 14 ? 5 : 2, lean: Math.sign(a.velocity.x - b.velocity.x) * 0.5 });
          lastDust = now;
          break;
        }
      });

      // Drive the bucket toward the pointer: set its velocity each step, so it hits with real momentum.
      Events.on(engine, 'beforeUpdate', () => {
        if (!bucket) return;
        const idle = !target.active;
        const tx = idle ? W * 0.22 + Math.sin(performance.now() / 900) * 18 : target.x;
        const ty = idle ? H * 0.35 + Math.cos(performance.now() / 700) * 10 : target.y;
        let vx = (tx - bucket.position.x) * 0.22;
        let vy = (ty - bucket.position.y) * 0.22;
        const max = 34;
        const m = Math.hypot(vx, vy);
        if (m > max) {
          vx = (vx / m) * max;
          vy = (vy / m) * max;
        }
        Body.setVelocity(bucket, { x: vx, y: vy });
        Body.setAngularVelocity(bucket, 0);
        Body.setAngle(bucket, bucket.angle + (Math.max(-0.6, Math.min(0.6, vx * 0.03)) - bucket.angle) * 0.2);
      });

      const local = (e: PointerEvent) => {
        const r = stage.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
      };
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse' && e.buttons === 0) return;
        const p = local(e);
        target.x = p.x;
        target.y = Math.min(p.y, H - 30);
        target.active = true;
      };
      const onDown = (e: PointerEvent) => {
        const p = local(e);
        target.x = p.x;
        target.y = Math.min(p.y, H - 30);
        target.active = true;
      };
      const onLeave = () => {
        target.active = false;
      };

      // The machine: tracks, cab and counterweight, parked bottom left. The arm (boom +
      // stick, two-bone IK, elbow up) rises from the cab to wherever the bucket is.
      const cab = () => {
        const gy = H - 18;
        const u = bw;
        return { gy, u, x0: u * 0.5, px: u * 3.5, py: gy - u * 1.75 };
      };
      const drawCab = () => {
        const { gy, u, x0 } = cab();
        // Tracks
        ctx.fillStyle = '#1f1e1c';
        ctx.strokeStyle = '#3a3935';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x0, gy - u * 0.7, u * 4, u * 0.7, u * 0.35);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#3a3935';
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.arc(x0 + u * 0.4 + i * u * 0.8, gy - u * 0.35, u * 0.17, 0, Math.PI * 2);
          ctx.fill();
        }
        // Counterweight and cab
        ctx.fillStyle = '#c78f00';
        ctx.fillRect(x0 - u * 0.15, gy - u * 1.45, u * 1.4, u * 0.7);
        ctx.fillStyle = '#ffb800';
        ctx.beginPath();
        ctx.moveTo(x0 + u * 1.1, gy - u * 0.75);
        ctx.lineTo(x0 + u * 1.1, gy - u * 2.3);
        ctx.lineTo(x0 + u * 2.5, gy - u * 2.3);
        ctx.lineTo(x0 + u * 3.3, gy - u * 1.5);
        ctx.lineTo(x0 + u * 3.5, gy - u * 0.75);
        ctx.closePath();
        ctx.fill();
        // Window
        ctx.fillStyle = '#121211';
        ctx.beginPath();
        ctx.moveTo(x0 + u * 1.35, gy - u * 1.5);
        ctx.lineTo(x0 + u * 1.35, gy - u * 2.1);
        ctx.lineTo(x0 + u * 2.35, gy - u * 2.1);
        ctx.lineTo(x0 + u * 2.95, gy - u * 1.5);
        ctx.closePath();
        ctx.fill();
      };
      const drawArm = (bx: number, by: number) => {
        const { px, py } = cab();
        const L1 = Math.max(W * 0.42, bw * 9);
        const L2 = Math.max(W * 0.36, bw * 8);
        let dx = bx - px;
        let dy = by - py;
        let d = Math.hypot(dx, dy);
        const reach = L1 + L2 - 1;
        if (d > reach) {
          dx *= reach / d;
          dy *= reach / d;
          d = reach;
        }
        const a = Math.atan2(dy, dx);
        const cosB = Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)));
        const ang = a - Math.acos(cosB); // elbow up
        const ex = px + Math.cos(ang) * L1;
        const ey = py + Math.sin(ang) * L1;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#121211';
        ctx.lineWidth = bw * 0.55;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(ex, ey);
        ctx.lineTo(bx, by);
        ctx.stroke();
        ctx.strokeStyle = '#ffb800';
        ctx.lineWidth = bw * 0.42;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        ctx.lineWidth = bw * 0.32;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(bx, by);
        ctx.stroke();
        // Hydraulic cylinder along the boom.
        ctx.strokeStyle = '#d9d4ca';
        ctx.lineWidth = bw * 0.09;
        ctx.beginPath();
        ctx.moveTo(px + (ex - px) * 0.18, py + (ey - py) * 0.18 + bw * 0.25);
        ctx.lineTo(px + (ex - px) * 0.72, py + (ey - py) * 0.72 + bw * 0.25);
        ctx.stroke();
        ctx.fillStyle = '#121211';
        for (const [jx, jy] of [
          [ex, ey],
          [bx, by],
        ]) {
          ctx.beginPath();
          ctx.arc(jx, jy, bw * 0.13, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      const draw = () => {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        // Ground line with tape ticks.
        ctx.fillStyle = '#2c2b28';
        ctx.fillRect(0, H - 18, W, 1);
        let down = 0;
        for (const b of bricks) {
          const { position: p, angle } = b.body;
          if (Math.abs(p.x - b.hx) > bh * 0.6 || Math.abs(p.y - b.hy) > bh * 0.6 || Math.abs(angle) > 0.3) down++;
          const v = b.body.vertices;
          const t = b.tone;
          ctx.fillStyle = t > 0.988 ? '#ffb800' : `hsl(40 5% ${44 + t * 34}%)`;
          ctx.beginPath();
          ctx.moveTo(v[0].x, v[0].y);
          for (let i = 1; i < v.length; i++) ctx.lineTo(v[i].x, v[i].y);
          ctx.closePath();
          ctx.fill();
        }
        if (bucket && !reduced) {
          drawCab();
          drawArm(bucket.position.x, bucket.position.y);
          const v = bucket.vertices;
          ctx.fillStyle = '#ffb800';
          ctx.strokeStyle = '#121211';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(v[0].x, v[0].y);
          for (let i = 1; i < v.length; i++) ctx.lineTo(v[i].x, v[i].y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          // Teeth along the leading edge.
          ctx.save();
          ctx.translate(bucket.position.x, bucket.position.y);
          ctx.rotate(bucket.angle);
          ctx.fillStyle = '#121211';
          const hw = bw * 0.75;
          const hh = bw * 0.55;
          for (let i = 0; i < 4; i++) ctx.fillRect(hw - 2, -hh + 4 + i * ((hh * 2 - 8) / 4), bw * 0.16, (hh * 2 - 8) / 4 - 3);
          ctx.restore();
        }
        if (down !== downCount && countRef.current) {
          downCount = down;
          countRef.current.textContent = `${down} / ${bricks.length}`;
        }
      };

      build();
      if (reduced) {
        draw();
        cleanup = () => {};
        return;
      }

      let raf = 0;
      let visible = false;
      let last = performance.now();
      let acc = 0;
      const loop = (now: number) => {
        acc += Math.min(100, now - last);
        last = now;
        while (acc >= 1000 / 60) {
          Engine.update(engine, 1000 / 60);
          acc -= 1000 / 60;
        }
        draw();
        raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
      };
      const wake = () => {
        if (!raf && visible && !document.hidden) {
          last = performance.now();
          raf = requestAnimationFrame(loop);
        }
      };
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        wake();
      });
      io.observe(stage);
      let lastW = W;
      const ro = new ResizeObserver(() => {
        if (Math.abs(stage.getBoundingClientRect().width - lastW) < 2) return;
        lastW = stage.getBoundingClientRect().width;
        build();
      });
      ro.observe(stage);
      stage.addEventListener('pointermove', onMove);
      stage.addEventListener('pointerdown', onDown);
      stage.addEventListener('pointerleave', onLeave);
      document.addEventListener('visibilitychange', wake);
      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        stage.removeEventListener('pointermove', onMove);
        stage.removeEventListener('pointerdown', onDown);
        stage.removeEventListener('pointerleave', onLeave);
        document.removeEventListener('visibilitychange', wake);
        Events.off(engine, 'collisionStart');
        Events.off(engine, 'beforeUpdate');
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      };
    };

    // Load the physics only when the section is close.
    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        near.disconnect();
        start();
      },
      { rootMargin: '400px 0px' },
    );
    near.observe(stage);
    return () => {
      disposed = true;
      near.disconnect();
      cleanup();
    };
  }, []);

  return (
    <section className="on-ink relative overflow-hidden bg-ink text-paper" aria-labelledby={id}>
      <div className="container-x relative z-10 flex flex-col gap-6 pt-20 lg:flex-row lg:items-end lg:justify-between lg:pt-28" data-reveal>
        <div>
          <h2 id={id} className="h-section" aria-label={title}>
            <Split text={title} />
          </h2>
          <p className="lede mt-5 text-dust">{line}</p>
        </div>
        <div className="flex items-center gap-6">
          <p className="label text-dust">
            Bricks down{' '}
            <span ref={countRef} className="num ml-2 text-accent">
              0
            </span>
          </p>
          <button type="button" onClick={() => rebuildRef.current()} className="btn btn-secondary min-h-11 px-4 py-2 text-[0.8rem] text-paper">
            Rebuild
          </button>
        </div>
      </div>
      <div ref={stageRef} className="relative h-[62svh] min-h-[380px] cursor-crosshair touch-pan-y select-none lg:h-[74svh]">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      </div>
      <div className="hazard h-4" aria-hidden="true" />
    </section>
  );
}
