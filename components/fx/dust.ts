// Dust bursts: call dust(x, y) from anywhere (viewport px). DustFX (mounted once in the
// layout) draws them; before it mounts, or under reduced motion, this does nothing.
export type BurstOptions = {
  /** 0.3 = a puff, 1 = an impact, 2 = a big hit. */
  power?: number;
  /** Debris chunks thrown out with the dust. */
  chunks?: number;
  /** Bias the throw: -1 left, 0 straight up, 1 right. */
  lean?: number;
};

export function dust(x: number, y: number, opts: BurstOptions = {}) {
  (window as unknown as { __dust?: { burst: (x: number, y: number, o: BurstOptions) => void } }).__dust?.burst(x, y, opts);
}
