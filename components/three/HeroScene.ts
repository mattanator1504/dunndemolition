// The home hero's 3D scene: a concrete block wall that breaks apart as you scroll.
// Plain three.js (no React renderer) to stay inside the 3D budget in technical-seo.md §4.
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

export type HeroSceneHandle = {
  setProgress: (p: number) => void;
  setPointer: (x: number, y: number) => void;
  setRunning: (on: boolean) => void;
  renderOnce: () => void;
  resize: () => void;
  dispose: () => void;
};

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

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 100);

  // Lights: cool sky fill, warm key from the upper left, a yellow rim behind.
  scene.add(new HemisphereLight(0xdfe6ee, 0x111111, 0.8));
  const key = new DirectionalLight(0xfff1dc, 3.2);
  key.position.set(-10, 7, 6);
  scene.add(key);
  const rim = new PointLight(ACCENT, 60, 30, 1.6);
  rim.position.set(4.5, 3, -4);
  scene.add(rim);

  // Blocks: one instanced mesh = one draw call.
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
  const dust = new Points(dustGeo, dustMat);
  scene.add(dust);

  const m = new Matrix4();
  const q = new Quaternion();
  const e = new Euler();
  const p = new Vector3();

  let progress = 0;
  let smooth = 0;
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  let running = false;
  let raf = 0;
  let last = performance.now();
  let time = 0;

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

  function layoutDust(t: number, dt: number) {
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
    void dt;
  }

  function frameCamera() {
    const { clientWidth: w, clientHeight: h } = canvas;
    const aspect = w / Math.max(h, 1);
    camera.aspect = aspect;
    const tan = Math.tan(MathUtils.degToRad(FOV / 2));
    const dH = (WALL_H * FRAME_MARGIN) / 2 / tan;
    const dW = (WALL_W * FRAME_MARGIN) / 2 / (tan * aspect);
    const d = Math.max(dH, dW);
    camera.position.set(0, 0, d);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    return d;
  }
  let camDist = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, opts.lowPower ? 1 : 1.5);
    renderer.setPixelRatio(opts.poster ? 2 : dpr);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    camDist = frameCamera();
  }

  function render() {
    // Gentle camera sway toward the pointer (a few degrees, lerped).
    pointer.sx += (pointer.x - pointer.sx) * 0.05;
    pointer.sy += (pointer.y - pointer.sy) * 0.05;
    const yaw = -0.3 + pointer.sx * 0.1;
    const pitch = 0.07 + pointer.sy * 0.05;
    camera.position.set(Math.sin(yaw) * camDist, Math.sin(pitch) * camDist, Math.cos(yaw) * camDist);
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  function tick(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;
    smooth += (progress - smooth) * Math.min(1, dt * 7);
    if (Math.abs(progress - smooth) < 0.0005) smooth = progress;
    layoutBlocks(smooth);
    layoutDust(smooth, dt);
    render();
    if (running) raf = requestAnimationFrame(tick);
  }

  resize();
  layoutBlocks(0);
  layoutDust(0, 0);

  return {
    setProgress(v) {
      progress = MathUtils.clamp(v, 0, 1);
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
      layoutDust(smooth, 0);
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
      renderer.dispose();
    },
  };
}
