// The home page's 3D: a three-story concrete-frame building that comes down as you
// scroll through the pinned hero.
// The hero's scroll progress (0..1) runs three beats:
//   0.04-0.30  the excavator takes the top front corner off
//   0.30-0.80  the floors pancake, columns topple, the infill crumbles into a heap
//   0.80-1.00  the dust settles and the camera drops to the rubble
// One canvas inside the hero's scene box, one WebGL context (same framing as the poster).
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
  Mesh,
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

// Building: a 3 x 2 bay concrete frame, three floors, block infill on the two faces
// toward the camera (front +z, right +x). Ground (top of the foundation) is y = 0.
const BAY = 3.4;
const NX = 3;
const NZ = 2;
const FLOORS = 3;
const FH = 3; // floor-to-floor
const SLAB = 0.32;
const COL = 0.44;
const FOUND = 0.4;
const FOUND_PAD = 1.2; // foundation reaches this far past the frame on every side
const W = NX * BAY;
const D = NZ * BAY;
const TOP = FLOORS * FH;
const BLOCK_D = 0.3;
const BLOCK_ROWS = 6;
const BLOCK_COLS = 3;

const YAW = 0.55; // camera from the front-right, so the knocked corner faces the viewer
const PITCH = 0.12;
const FOV = 32;
const FRAME_MARGIN = 1.12; // the poster is rendered with the same margin
const LOOK_Y = (TOP - FOUND) / 2;

// Framing: project the site's eight corners through the resting camera and find the
// distance that fits them inside the margin. Perspective (the near corner, the downward
// view) makes a flat width/height estimate crop the poster, so it's measured instead.
const SITE_CORNERS: Vector3[] = [];
for (const x of [-1, 1]) for (const y of [-FOUND, TOP]) for (const z of [-1, 1]) SITE_CORNERS.push(new Vector3(x * (W / 2 + FOUND_PAD), y, z * (D / 2 + FOUND_PAD)));

function placeCamera(cam: PerspectiveCamera, yaw: number, pitch: number, dist: number, lookY: number) {
  cam.position.set(Math.sin(yaw) * Math.cos(pitch) * dist, lookY + Math.sin(pitch) * dist, Math.cos(yaw) * Math.cos(pitch) * dist);
  cam.lookAt(0, lookY, 0);
  cam.updateMatrixWorld();
}

const probe = new Vector3();
function siteExtent(cam: PerspectiveCamera) {
  let x = 0;
  let y = 0;
  for (const c of SITE_CORNERS) {
    probe.copy(c).project(cam);
    x = Math.max(x, Math.abs(probe.x));
    y = Math.max(y, Math.abs(probe.y));
  }
  return { x, y };
}

function fitDistance(aspect: number) {
  const cam = new PerspectiveCamera(FOV, aspect, 0.1, 500);
  let lo = 5;
  let hi = 300;
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2;
    placeCamera(cam, YAW, PITCH, mid, LOOK_Y);
    const ext = siteExtent(cam);
    if (Math.max(ext.x, ext.y) * FRAME_MARGIN > 1) lo = mid;
    else hi = mid;
  }
  return hi;
}

// The poster's aspect: the site's projected width over height (square probe, so NDC units match).
export const FRAME_ASPECT = (() => {
  const cam = new PerspectiveCamera(FOV, 1, 0.1, 500);
  placeCamera(cam, YAW, PITCH, fitDistance(1), LOOK_Y);
  const ext = siteExtent(cam);
  return ext.x / ext.y;
})();

const ACCENT = new Color('#E7B008');

type Piece = {
  base: Vector3;
  size: Vector3;
  tilt: Vector3; // resting imperfection, a degree or so
  t0: number; // when it lets go (hero progress)
  dur: number;
  end: Vector3; // where it comes to rest in the heap
  endRot: Vector3;
  lift: number; // upward kick when the bucket hits
};

// Small seeded RNG so the building (and the poster) is identical on every load.
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
  /** Screen y (CSS px) below which the building must not draw: the next section sliding over it. */
  setClip: (bottom: number | null) => void;
  /** Demolition progress, 0..1. */
  setProgress: (p: number) => void;
  setPointer: (x: number, y: number) => void;
  setRunning: (on: boolean) => void;
  renderOnce: () => void;
  resize: () => void;
  dispose: () => void;
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
  const fill = new DirectionalLight(0xdfe6ee, 0.7);
  fill.position.set(9, 3, 8);
  scene.add(fill);
  const rim = new PointLight(ACCENT, 70, 34, 1.6);
  rim.position.set(9, 8, -6);
  scene.add(rim);
}

// Lay out the frame and infill, and give every piece its moment and its resting place.
function buildPieces(rand: () => number) {
  const pieces: Piece[] = [];
  const kinds: ('col' | 'slab' | 'block')[] = [];
  const impact = new Vector3(W / 2, TOP, D / 2);
  const diag = Math.hypot(W, TOP, D);
  const heapC = new Vector3(0.6, 0, 0.5);
  const heapR = 7.5;
  const heap = (x: number, z: number) => 2.4 * Math.max(0, 1 - ((x - heapC.x) ** 2 + (z - heapC.z) ** 2) / heapR ** 2);

  const add = (kind: 'col' | 'slab' | 'block', base: Vector3, size: Vector3, normal?: Vector3) => {
    const h = base.y / TOP;
    const dImp = base.distanceTo(impact) / diag;
    const corner = dImp < 0.3 && base.y > TOP - FH - 0.2;
    let t0: number;
    let dur: number;
    let lift = 0;
    const end = new Vector3();
    const endRot = new Vector3();
    const out = new Vector3(base.x - heapC.x, 0, base.z - heapC.z);
    const outDir = out.clone().normalize();

    if (corner) {
      // Beat 1: knocked off the top front corner, thrown outward and down.
      t0 = 0.04 + (dImp / 0.3) * 0.17 + rand() * 0.03;
      dur = 0.1 + rand() * 0.06;
      lift = 0.5 + rand() * 0.9;
      end.set(base.x + outDir.x * (2 + rand() * 2.5), 0, base.z + outDir.z * (2 + rand() * 2.5));
    } else {
      // Beat 2: top-down pancake, spreading out from the hit corner.
      t0 = 0.3 + (1 - h) * 0.17 + dImp * 0.08 + rand() * 0.03 + (kind === 'col' ? 0.02 : 0);
      dur = 0.11 + 0.08 * h + rand() * 0.03;
      end.set(base.x + out.x * (0.12 + rand() * 0.3), 0, base.z + out.z * (0.12 + rand() * 0.3));
    }

    if (kind === 'slab') {
      const level = Math.round((base.y + SLAB / 2) / FH) - 1;
      end.x += (rand() - 0.5) * 0.8;
      end.z += (rand() - 0.5) * 0.8;
      end.y = SLAB / 2 + 0.1 + level * 0.42 + rand() * 0.15;
      endRot.set((rand() - 0.5) * 0.6, (rand() - 0.5) * 0.5, (rand() - 0.5) * 0.6);
    } else if (kind === 'col') {
      end.x += outDir.x * (0.6 + rand() * 1.2);
      end.z += outDir.z * (0.6 + rand() * 1.2);
      end.y = heap(end.x, end.z) * (0.5 + rand() * 0.4) + COL / 2;
      // Topple: lie down along a random horizontal axis.
      endRot.set(rand() < 0.5 ? Math.PI / 2 : -Math.PI / 2, rand() * Math.PI, (rand() - 0.5) * 0.3);
    } else {
      if (normal) {
        end.x += normal.x * (0.4 + rand() * 1.8);
        end.z += normal.z * (0.4 + rand() * 1.8);
      }
      end.x += (rand() - 0.5) * 1.8;
      end.z += (rand() - 0.5) * 1.8;
      end.y = heap(end.x, end.z) * (0.35 + rand() * 0.65) + 0.2;
      const q = () => (Math.round(rand() * 4) - 2) * (Math.PI / 2) + (rand() - 0.5) * 0.5;
      endRot.set(q(), rand() * Math.PI * 2, q());
    }

    // Everything comes to rest on the site pad, never in the void past its edge.
    const reach = Math.max(size.x, size.z) / 2;
    end.x = MathUtils.clamp(end.x, -W / 2 - FOUND_PAD + reach, W / 2 + FOUND_PAD - reach);
    end.z = MathUtils.clamp(end.z, -D / 2 - FOUND_PAD + reach, D / 2 + FOUND_PAD - reach);
    if (kind === 'block') end.y = Math.max(end.y, heap(end.x, end.z) * 0.35 + 0.2);

    pieces.push({
      base,
      size,
      tilt: new Vector3((rand() - 0.5) * 0.02, (rand() - 0.5) * 0.02, (rand() - 0.5) * 0.02),
      t0,
      dur,
      end,
      endRot,
      lift,
    });
    kinds.push(kind);
  };

  // Columns, one per grid point per floor.
  for (let f = 0; f < FLOORS; f++) {
    for (let i = 0; i <= NX; i++) {
      for (let j = 0; j <= NZ; j++) {
        add('col', new Vector3(-W / 2 + i * BAY, f * FH + (FH - SLAB) / 2, -D / 2 + j * BAY), new Vector3(COL, FH - SLAB, COL));
      }
    }
  }
  // Floor and roof slabs, one panel per bay.
  for (let f = 0; f < FLOORS; f++) {
    for (let i = 0; i < NX; i++) {
      for (let j = 0; j < NZ; j++) {
        add('slab', new Vector3(-W / 2 + (i + 0.5) * BAY, (f + 1) * FH - SLAB / 2, -D / 2 + (j + 0.5) * BAY), new Vector3(BAY - 0.04, SLAB, BAY - 0.04));
      }
    }
  }
  // Block infill: front face (+z) and right face (+x), with window openings
  // and a doorway in the middle bay of the ground floor.
  const cw = BAY - COL;
  const ch = FH - SLAB;
  const bw = cw / BLOCK_COLS;
  const bh = ch / BLOCK_ROWS;
  const faces = [
    { bays: NX, along: new Vector3(1, 0, 0), origin: new Vector3(-W / 2, 0, D / 2), normal: new Vector3(0, 0, 1), door: 1 },
    { bays: NZ, along: new Vector3(0, 0, -1), origin: new Vector3(W / 2, 0, D / 2), normal: new Vector3(1, 0, 0), door: -1 },
  ];
  for (const face of faces) {
    for (let f = 0; f < FLOORS; f++) {
      for (let b = 0; b < face.bays; b++) {
        for (let r = 0; r < BLOCK_ROWS; r++) {
          for (let c = 0; c < BLOCK_COLS; c++) {
            const door = f === 0 && b === face.door && c === 1 && r <= 4;
            const opening = c === 1 && r >= 2 && r <= 4;
            if (door || opening) continue;
            const s = b * BAY + COL / 2 + (c + 0.5) * bw;
            const base = face.origin
              .clone()
              .addScaledVector(face.along, s)
              .add(new Vector3(0, f * FH + (r + 0.5) * bh, 0));
            const size = face.normal.x ? new Vector3(BLOCK_D, bh - 0.04, bw - 0.04) : new Vector3(bw - 0.04, bh - 0.04, BLOCK_D);
            add('block', base, size, face.normal);
          }
        }
      }
    }
  }
  return { pieces, kinds };
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

  // ---------- Pass 1: the building ----------
  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 200);
  addLights(scene);

  const tex = concreteTexture(rand);
  const mat = new MeshStandardMaterial({ map: tex, roughness: 0.93, metalness: 0 });
  const unit = new BoxGeometry(1, 1, 1);

  const foundation = new Mesh(unit, new MeshStandardMaterial({ map: tex, roughness: 0.96, metalness: 0, color: 0x6b6a66 }));
  foundation.scale.set(W + FOUND_PAD * 2, FOUND, D + FOUND_PAD * 2);
  foundation.position.set(0, -FOUND / 2, 0);
  scene.add(foundation);

  const { pieces, kinds } = buildPieces(rand);
  const mesh = new InstancedMesh(unit, mat, pieces.length);
  mesh.instanceMatrix.setUsage(DynamicDrawUsage);
  mesh.frustumCulled = false;
  const tone = new Color();
  kinds.forEach((k, i) => {
    // Frame concrete reads lighter and smoother than the block infill.
    mesh.setColorAt(i, k === 'block' ? tone.setHSL(0.08, 0.04, 0.36 + rand() * 0.16) : tone.setHSL(0.1, 0.03, 0.56 + rand() * 0.08));
  });
  scene.add(mesh);

  // Dust: one Points draw call, a low cloud that rises with the collapse and then settles.
  const DUST = opts.lowPower ? 120 : 260;
  const dustPos = new Float32Array(DUST * 3);
  const dustSeed = new Float32Array(DUST * 4);
  for (let i = 0; i < DUST; i++) {
    dustSeed[i * 4] = (rand() - 0.5) * (W + 6);
    dustSeed[i * 4 + 1] = rand() * 2.2;
    dustSeed[i * 4 + 2] = (rand() - 0.5) * (D + 6);
    dustSeed[i * 4 + 3] = rand();
  }
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute('position', new BufferAttribute(dustPos, 3).setUsage(DynamicDrawUsage));
  const dustMat = new PointsMaterial({
    map: dustSprite(),
    size: 1.3,
    transparent: true,
    depthWrite: false,
    opacity: 0.03,
    color: 0xd8d2c4,
    blending: AdditiveBlending,
  });
  const dust = new Points(dustGeo, dustMat);
  dust.frustumCulled = false;
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
  let box: Rect | null = null;
  let clipBottom: number | null = null;
  let boxAspect = 0;
  let camDist = 0;

  function layoutPieces(t: number) {
    pieces.forEach((b, i) => {
      const tau = MathUtils.clamp((t - b.t0) / b.dur, 0, 1);
      if (tau === 0) {
        p.copy(b.base);
        e.set(b.tilt.x, b.tilt.y, b.tilt.z);
      } else {
        // Horizontal drift eases out, the drop accelerates (gravity), plus the bucket's kick.
        const hz = 1 - (1 - tau) * (1 - tau);
        const g = tau * tau;
        p.set(
          b.base.x + (b.end.x - b.base.x) * hz,
          b.base.y + (b.end.y - b.base.y) * g + b.lift * 4 * tau * (1 - tau),
          b.base.z + (b.end.z - b.base.z) * hz,
        );
        const r = smoothstep(0, 1, tau);
        e.set(b.tilt.x + (b.endRot.x - b.tilt.x) * r, b.tilt.y + (b.endRot.y - b.tilt.y) * r, b.tilt.z + (b.endRot.z - b.tilt.z) * r);
      }
      q.setFromEuler(e);
      m.compose(p, q, b.size);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }

  function layoutDust(t: number) {
    const puff = smoothstep(0.06, 0.16, t) * (1 - smoothstep(0.2, 0.34, t)) * 0.35; // the corner hit
    const rise = smoothstep(0.3, 0.72, t); // the collapse
    const settle = smoothstep(0.78, 1, t);
    for (let i = 0; i < DUST; i++) {
      const s = dustSeed[i * 4 + 3];
      const drift = time * (0.05 + s * 0.12);
      dustPos[i * 3] = dustSeed[i * 4] * (0.7 + rise * 0.5) + Math.sin(drift + s * 10) * 0.5;
      dustPos[i * 3 + 1] = dustSeed[i * 4 + 1] * (1 + rise * 3.2 * s) * (1 - settle * 0.55) + Math.sin(drift * 0.7 + s * 4) * 0.15;
      dustPos[i * 3 + 2] = dustSeed[i * 4 + 2] * (0.7 + rise * 0.5) + Math.cos(drift + s * 7) * 0.5;
    }
    dustGeo.attributes.position.needsUpdate = true;
    // Big, faint, overlapping sprites read as a cloud; small bright ones read as sparkle.
    dustMat.opacity = 0.03 + puff * 0.5 + rise * (0.2 - settle * 0.12);
    dustMat.size = 1.3 + rise * 2.6;
  }

  function frameCamera(aspect: number) {
    camera.aspect = aspect;
    camDist = fitDistance(aspect);
    camera.updateProjectionMatrix();
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, opts.lowPower ? 1 : 1.5);
    renderer.setPixelRatio(opts.poster ? 2 : dpr);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    boxAspect = 0; // re-frame the building on the next render
  }

  function render() {
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    renderer.setScissorTest(false);
    renderer.setViewport(0, 0, W, H);
    renderer.clear();

    // Pass 1: the building, only where its box is on screen and not covered by the next section.
    const r = box ?? { left: 0, top: 0, width: W, height: H };
    const visTop = Math.max(0, r.top);
    const visBottom = Math.min(H, r.top + r.height, clipBottom ?? Infinity);
    if (visBottom > visTop) {
      const aspect = r.width / Math.max(r.height, 1);
      if (Math.abs(aspect - boxAspect) > 1e-4) {
        boxAspect = aspect;
        frameCamera(aspect);
      }
      // Gentle camera sway toward the pointer, a slow orbit, and a drop to the rubble at the end.
      pointer.sx += (pointer.x - pointer.sx) * 0.05;
      pointer.sy += (pointer.y - pointer.sy) * 0.05;
      const down = smoothstep(0.35, 0.95, smooth);
      const yaw = YAW + smooth * 0.14 + pointer.sx * 0.08;
      const pitch = PITCH + down * 0.1 + pointer.sy * 0.04;
      const dist = camDist * (1 - down * 0.24);
      const lookY = LOOK_Y - down * 2.6;
      placeCamera(camera, yaw, pitch, dist, lookY);
      const y = H - (r.top + r.height); // WebGL viewports start bottom-left
      renderer.setViewport(r.left, y, r.width, r.height);
      renderer.setScissor(Math.max(0, r.left), H - visBottom, Math.min(r.width, W), visBottom - visTop);
      renderer.setScissorTest(true);
      renderer.render(scene, camera);
      renderer.setScissorTest(false);
    }

  }

  function tick(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;
    smooth += (progress - smooth) * Math.min(1, dt * 7);
    if (Math.abs(progress - smooth) < 0.0005) smooth = progress;
    const heroOnScreen = !box || (box.top + box.height > 0 && box.top < canvas.clientHeight && (clipBottom ?? Infinity) > Math.max(0, box.top));

    // Only draw while the stage is on screen (the dust drifts, so it animates even when still).
    if (heroOnScreen) {
      layoutPieces(smooth);
      layoutDust(smooth);
      render();
    }
    if (running) raf = requestAnimationFrame(tick);
  }

  resize();
  layoutPieces(0);
  layoutDust(0);

  return {
    setBox(r) {
      box = r;
    },
    setClip(bottom) {
      clipBottom = bottom;
    },
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
      layoutPieces(smooth);
      layoutDust(smooth);
      render();
    },
    resize,
    dispose() {
      cancelAnimationFrame(raf);
      running = false;
      unit.dispose();
      tex.dispose();
      mat.dispose();
      (foundation.material as MeshStandardMaterial).dispose();
      dustGeo.dispose();
      dustMat.map?.dispose();
      dustMat.dispose();
      mesh.dispose();
      renderer.dispose();
    },
  };
}
