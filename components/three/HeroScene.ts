// The home page's 3D: a concrete block wall that breaks apart as you scroll, then
// chunks of it tumble down the page edges and land in a pile on the footer.
// One canvas, one WebGL context, two passes per frame:
//   1. the wall, drawn into the hero's scene box (same framing as the poster)
//   2. the falling debris, drawn across the whole viewport
// Plain three.js to stay inside the 3D budget in technical-seo.md §4.
// Loaded only through HeroSceneMount, never in the initial bundle.
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  DynamicDrawUsage,
  Euler,
  HemisphereLight,
  InstancedMesh,
  MathUtils,
  Matrix4,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Quaternion,
  SRGBColorSpace,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';

// Wall layout (running bond). Exported so the poster and the scene frame identically.
const COLS = 7;
const ROWS = 9;
const BW = 1.2; // block width
const BH = 0.58; // block height
const BD = 0.62; // block depth
const GAP = 0.06;
export const WALL_W = COLS * (BW + GAP) + BW / 2;
export const WALL_H = ROWS * (BH + GAP);
export const FRAME_MARGIN = 1.22; // the poster is rendered with the same margin
export const FRAME_ASPECT = (WALL_W * FRAME_MARGIN) / (WALL_H * FRAME_MARGIN);

const FOV = 32;
const ACCENT = new Color('#E7B008');

type Block = {
  base: Vector3;
  tilt: Vector3; // resting imperfection, a degree or two
  vel: Vector3;
  spin: Vector3;
  delay: number; // 0..1, when this block starts to go
  scale: Vector3;
};

// Small seeded RNG so the wall (and the poster) is identical on every load.
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function concreteTexture(rand: () => number) {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#bdbdb8';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 2200; i++) {
    const v = 120 + Math.floor(rand() * 110);
    ctx.fillStyle = `rgba(${v},${v},${v - 6},${0.25 + rand() * 0.4})`;
    const r = rand() * 1.6 + 0.3;
    ctx.fillRect(rand() * size, rand() * size, r, r);
  }
  for (let i = 0; i < 26; i++) {
    ctx.fillStyle = `rgba(60,60,58,${0.25 + rand() * 0.35})`;
    ctx.beginPath();
    ctx.arc(rand() * size, rand() * size, rand() * 2.2 + 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

function dustSprite() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,0.9)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.25)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new CanvasTexture(c);
}

export type Rect = { left: number; top: number; width: number; height: number };

export type HeroSceneHandle = {
  /** Where the hero's scene box is on screen (CSS px), or null to draw it full-canvas (poster). */
  setBox: (r: Rect | null) => void;
  /** Hero break progress, 0..1. */
  setProgress: (p: number) => void;
  /** Page scroll in px and the footer's top edge on screen, for the falling debris. */
  setPage: (scrollY: number, footerTop: number | null) => void;
  setPointer: (x: number, y: number) => void;
  setRunning: (on: boolean) => void;
  renderOnce: () => void;
  resize: () => void;
  dispose: () => void;
};

// Falling debris: a few chunks per side of the page, landing in a pile on the footer.
const TRAIL = 12;

type Chunk = {
  side: -1 | 1;
  x: number; // 0..1 across that side's gutter
  phase: number; // 0..1 starting point in the fall loop
  speed: number; // falls this many viewports per viewport scrolled
  spin: Vector3;
  size: number; // px width on screen
  pile: { x: number; y: number; rz: number; ry: number }; // resting slot: x in vw fraction, y in rows above the footer
};

function smoothstep(a: number, b: number, x: number) {
  const t = MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

function addLights(scene: Scene) {
  scene.add(new HemisphereLight(0xdfe6ee, 0x111111, 0.8));
  const key = new DirectionalLight(0xfff1dc, 3.2);
  key.position.set(-10, 7, 6);
  scene.add(key);
  const rim = new PointLight(ACCENT, 60, 30, 1.6);
  rim.position.set(4.5, 3, -4);
  scene.add(rim);
}

export function createHeroScene(canvas: HTMLCanvasElement, opts: { poster?: boolean; lowPower?: boolean } = {}): HeroSceneHandle {
  const rand = rng(1974);
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: !!opts.poster,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.autoClear = false;

  // ---------- Pass 1: the wall ----------
  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 100);
  addLights(scene);

  const geo = new BoxGeometry(BW, BH, BD);
  const mat = new MeshStandardMaterial({ map: concreteTexture(rand), roughness: 0.93, metalness: 0 });
  const blocks: Block[] = [];
  const impact = new Vector3(WALL_W * 0.32, WALL_H * 0.42, 0); // upper-right corner, where the "bucket" hits

  for (let r = 0; r < ROWS; r++) {
    const offset = r % 2 ? (BW + GAP) / 2 : 0;
    for (let c = 0; c < COLS; c++) {
      const x = c * (BW + GAP) + offset - WALL_W / 2 + BW / 2;
      const y = r * (BH + GAP) - WALL_H / 2 + BH / 2;
      const base = new Vector3(x, y, (rand() - 0.5) * 0.12);
      const dist = base.distanceTo(impact) / Math.hypot(WALL_W, WALL_H);
      const away = base.clone().sub(impact).normalize();
      blocks.push({
        base,
        delay: MathUtils.clamp(dist * 0.62 + rand() * 0.08, 0, 0.7),
        vel: new Vector3(away.x * (1.5 + rand() * 2.5), 1.2 + rand() * 2.2, 3.5 + rand() * 4.5),
        spin: new Vector3((rand() - 0.5) * 7, (rand() - 0.5) * 7, (rand() - 0.5) * 5),
        scale: new Vector3(1 - rand() * 0.04, 1 - rand() * 0.06, 1 - rand() * 0.05),
        tilt: new Vector3((rand() - 0.5) * 0.03, (rand() - 0.5) * 0.05, (rand() - 0.5) * 0.035),
      });
    }
  }

  const mesh = new InstancedMesh(geo, mat, blocks.length);
  mesh.instanceMatrix.setUsage(DynamicDrawUsage);
  const grey = new Color();
  blocks.forEach((_, i) => {
    // About one block in twenty is painted safety yellow; the rest vary slightly in tone.
    const painted = rand() < 0.045;
    mesh.setColorAt(i, painted ? ACCENT : grey.setHSL(0.09, 0.03, 0.4 + rand() * 0.2));
  });
  scene.add(mesh);

  // Dust: one Points draw call. Brighter and denser as the wall breaks.
  const DUST = opts.lowPower ? 140 : 320;
  const dustPos = new Float32Array(DUST * 3);
  const dustSeed = new Float32Array(DUST * 4);
  for (let i = 0; i < DUST; i++) {
    dustSeed[i * 4] = (rand() - 0.5) * WALL_W * 1.6;
    dustSeed[i * 4 + 1] = (rand() - 0.5) * WALL_H * 1.3;
    dustSeed[i * 4 + 2] = (rand() - 0.2) * 4;
    dustSeed[i * 4 + 3] = rand();
  }
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute('position', new BufferAttribute(dustPos, 3).setUsage(DynamicDrawUsage));
  const dustMat = new PointsMaterial({
    map: dustSprite(),
    size: 0.32,
    transparent: true,
    depthWrite: false,
    opacity: 0.18,
    color: 0xd8d2c4,
    blending: AdditiveBlending,
  });
  scene.add(new Points(dustGeo, dustMat));

  // ---------- Pass 2: falling debris across the page ----------
  const trailScene = new Scene();
  const trailCam = new PerspectiveCamera(FOV, 1, 0.1, 100);
  const TRAIL_D = 24;
  trailCam.position.set(0, 0, TRAIL_D);
  addLights(trailScene);
  const trailMesh = new InstancedMesh(geo, mat, TRAIL);
  trailMesh.instanceMatrix.setUsage(DynamicDrawUsage);
  trailMesh.frustumCulled = false;
  trailScene.add(trailMesh);

  // Pile: 5 on the bottom row, 4, then 3, offset like a dumped heap, right of center.
  const pileSlots: { x: number; y: number }[] = [];
  [5, 4, 3].forEach((n, row) => {
    for (let k = 0; k < n; k++) pileSlots.push({ x: 0.66 + (k - (n - 1) / 2) * 0.052 + row * 0.012, y: row });
  });
  const chunks: Chunk[] = [];
  for (let i = 0; i < TRAIL; i++) {
    const slot = pileSlots[i];
    chunks.push({
      side: i % 2 ? 1 : -1,
      x: rand(),
      phase: rand(),
      speed: 1.25 + rand() * 0.6,
      spin: new Vector3((rand() - 0.5) * 9, (rand() - 0.5) * 9, (rand() - 0.5) * 6),
      size: 48 + rand() * 34,
      pile: { x: slot.x, y: slot.y, rz: (rand() - 0.5) * 0.35, ry: (rand() - 0.5) * 0.9 },
    });
    trailMesh.setColorAt(i, i === 4 || i === 9 ? ACCENT : grey.setHSL(0.09, 0.03, 0.42 + rand() * 0.18));
  }

  const m = new Matrix4();
  const q = new Quaternion();
  const qRest = new Quaternion();
  const e = new Euler();
  const p = new Vector3();
  const sc = new Vector3();

  let progress = 0;
  let smooth = 0;
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  let running = false;
  let raf = 0;
  let last = performance.now();
  let time = 0;
  let box: Rect | null = null;
  let boxAspect = 0;
  let camDist = 0;
  let page = { scroll: 0, smooth: 0, footerTop: null as number | null };
  let trailDirty = true;

  function layoutBlocks(t: number) {
    blocks.forEach((b, i) => {
      // Local time for this block: 0 until its delay, then 0..1.
      const tau = MathUtils.clamp((t - b.delay) / (1 - b.delay), 0, 1);
      const k = tau * 2.4;
      p.set(b.base.x + b.vel.x * k, b.base.y + b.vel.y * k - 9.8 * 0.5 * k * k, b.base.z + b.vel.z * k);
      e.set(b.tilt.x + b.spin.x * k, b.tilt.y + b.spin.y * k, b.tilt.z + b.spin.z * k);
      q.setFromEuler(e);
      m.compose(p, q, b.scale);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }

  function layoutDust(t: number) {
    for (let i = 0; i < DUST; i++) {
      const s = dustSeed[i * 4 + 3];
      const drift = time * (0.05 + s * 0.12);
      dustPos[i * 3] = dustSeed[i * 4] + Math.sin(drift + s * 10) * 0.4 + t * (s - 0.5) * 6;
      dustPos[i * 3 + 1] = dustSeed[i * 4 + 1] + ((drift * 0.6 + s * 5) % 3) - 1.5 + t * 2.5 * s;
      dustPos[i * 3 + 2] = dustSeed[i * 4 + 2] + t * 3 * s;
    }
    dustGeo.attributes.position.needsUpdate = true;
    dustMat.opacity = 0.035 + t * 0.55;
    dustMat.size = 0.3 + t * 0.55;
  }

  // Screen-space (CSS px) layout for the debris, converted to world units at z = 0.
  function layoutTrail(heroT: number) {
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    const wpp = (2 * TRAIL_D * Math.tan(MathUtils.degToRad(FOV / 2))) / H; // world units per px
    const appear = smoothstep(0.35, 0.85, heroT); // chunks join once the wall has broken
    // The side gutters outside the content column, with a floor so they're never zero-width.
    const gutter = Math.max(56, (W - 1312) / 2);
    const land = page.footerTop === null ? 0 : smoothstep(H * 1.05, H * 0.45, page.footerTop);
    const s = page.smooth / H; // viewports scrolled

    chunks.forEach((c, i) => {
      // Falling: each chunk loops down its gutter a little faster than the page scrolls.
      const loop = (((s * c.speed + c.phase) % 1) + 1) % 1;
      let x = c.side < 0 ? gutter * (0.15 + c.x * 0.7) : W - gutter * (0.15 + c.x * 0.7);
      x += Math.sin(s * 2.2 + c.phase * 9) * 14;
      let y = -0.2 * H + loop * 1.4 * H;
      e.set(c.spin.x * s, c.spin.y * s, c.spin.z * s);
      q.setFromEuler(e);

      // Landing: as the footer comes up, ease each chunk into its slot on top of it.
      if (land > 0 && page.footerTop !== null) {
        const bh = c.size * (BH / BW);
        const px = W * c.pile.x;
        const py = page.footerTop - bh * 0.55 - c.pile.y * bh * 0.82;
        const k = smoothstep(i / TRAIL * 0.35, 0.65 + (i / TRAIL) * 0.35, land);
        x += (px - x) * k;
        y += (py - y) * k;
        // Settle the tumble into a resting pose along the shortest rotation.
        qRest.setFromEuler(e.set(0, c.pile.ry, c.pile.rz));
        q.slerp(qRest, k);
      }

      const size = (c.size / BW) * wpp * appear;
      p.set((x - W / 2) * wpp, -(y - H / 2) * wpp, 0);
      sc.set(size, size, size);
      m.compose(p, q, sc);
      trailMesh.setMatrixAt(i, m);
    });
    trailMesh.instanceMatrix.needsUpdate = true;
  }

  function frameCamera(aspect: number) {
    camera.aspect = aspect;
    const tan = Math.tan(MathUtils.degToRad(FOV / 2));
    const dH = (WALL_H * FRAME_MARGIN) / 2 / tan;
    const dW = (WALL_W * FRAME_MARGIN) / 2 / (tan * aspect);
    camDist = Math.max(dH, dW);
    camera.updateProjectionMatrix();
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, opts.lowPower ? 1 : 1.5);
    renderer.setPixelRatio(opts.poster ? 2 : dpr);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    trailCam.aspect = canvas.clientWidth / Math.max(canvas.clientHeight, 1);
    trailCam.updateProjectionMatrix();
    boxAspect = 0; // re-frame the wall on the next render
    trailDirty = true;
  }

  function render() {
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    renderer.setScissorTest(false);
    renderer.setViewport(0, 0, W, H);
    renderer.clear();

    // Pass 1: the wall, only while its box is on screen.
    const r = box ?? { left: 0, top: 0, width: W, height: H };
    if (r.top + r.height > 0 && r.top < H) {
      const aspect = r.width / Math.max(r.height, 1);
      if (Math.abs(aspect - boxAspect) > 1e-4) {
        boxAspect = aspect;
        frameCamera(aspect);
      }
      // Gentle camera sway toward the pointer (a few degrees, lerped).
      pointer.sx += (pointer.x - pointer.sx) * 0.05;
      pointer.sy += (pointer.y - pointer.sy) * 0.05;
      const yaw = -0.3 + pointer.sx * 0.1;
      const pitch = 0.07 + pointer.sy * 0.05;
      camera.position.set(Math.sin(yaw) * camDist, Math.sin(pitch) * camDist, Math.cos(yaw) * camDist);
      camera.lookAt(0, 0, 0);
      const y = H - (r.top + r.height); // WebGL viewports start bottom-left
      renderer.setViewport(r.left, y, r.width, r.height);
      renderer.setScissor(Math.max(0, r.left), Math.max(0, y), Math.min(r.width, W), Math.min(r.height, H));
      renderer.setScissorTest(true);
      renderer.render(scene, camera);
      renderer.setScissorTest(false);
    }

    // Pass 2: falling debris across the whole viewport.
    if (!opts.poster) {
      renderer.setViewport(0, 0, W, H);
      renderer.render(trailScene, trailCam);
    }
  }

  function tick(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;
    smooth += (progress - smooth) * Math.min(1, dt * 7);
    if (Math.abs(progress - smooth) < 0.0005) smooth = progress;
    const prevScroll = page.smooth;
    page.smooth += (page.scroll - page.smooth) * Math.min(1, dt * 9);
    if (Math.abs(page.scroll - page.smooth) < 0.3) page.smooth = page.scroll;
    const heroOnScreen = !box || (box.top + box.height > 0 && box.top < canvas.clientHeight);

    // Only draw when something moved: the hero animates (dust) while visible,
    // the debris only while the page is scrolling or settling.
    const moving = heroOnScreen || trailDirty || page.smooth !== prevScroll;
    if (moving) {
      if (heroOnScreen) {
        layoutBlocks(smooth);
        layoutDust(smooth);
      }
      layoutTrail(smooth);
      render();
      trailDirty = false;
    }
    if (running) raf = requestAnimationFrame(tick);
  }

  resize();
  layoutBlocks(0);
  layoutDust(0);

  return {
    setBox(r) {
      box = r;
    },
    setProgress(v) {
      progress = MathUtils.clamp(v, 0, 1);
    },
    setPage(scrollY, footerTop) {
      page.scroll = scrollY;
      if (footerTop !== page.footerTop) trailDirty = true;
      page.footerTop = footerTop;
    },
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
    },
    setRunning(on) {
      if (on === running) return;
      running = on;
      if (on) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      } else cancelAnimationFrame(raf);
    },
    renderOnce() {
      layoutBlocks(smooth);
      layoutDust(smooth);
      layoutTrail(smooth);
      render();
    },
    resize,
    dispose() {
      cancelAnimationFrame(raf);
      running = false;
      geo.dispose();
      mat.map?.dispose();
      mat.dispose();
      dustGeo.dispose();
      dustMat.map?.dispose();
      dustMat.dispose();
      mesh.dispose();
      trailMesh.dispose();
      renderer.dispose();
    },
  };
}
